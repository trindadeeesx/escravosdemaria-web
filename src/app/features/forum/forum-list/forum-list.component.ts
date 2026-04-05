import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ForumService, ForumPost } from "../../../core/services/forum.service";

type SortType = "hot" | "new" | "top";

interface ForumPostVM extends ForumPost {
	_score: number;
	_vote: number; // 1 | -1 | 0
}

interface SortOption {
	value: SortType;
	label: string;
}

@Component({
	selector: "app-forum-list",
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: "./forum-list.component.html",
	styleUrls: ["./forum-list.component.scss"],
})
export class ForumListComponent implements OnInit, OnDestroy {
	posts: ForumPostVM[] = [];
	loading = true;
	loadingMore = false;
	error = false;
	hasMore = false;
	private page = 0;
	private totalPages = 1;

	activeSort: SortType = "hot";
	showNewPost = false;
	submitting = false;

	newPost = {
		title: "",
		content: "",
		tagsRaw: "",
	};

	sorts: SortOption[] = [
		{ value: "hot", label: "🔥 Em Alta" },
		{ value: "new", label: "✦ Recentes" },
		{ value: "top", label: "↑ Top" },
	];

	rules = [
		{ num: "1.", text: "Caridade em tudo — corrija com amor fraterno" },
		{ num: "2.", text: "Fidelidade à Tradição e ao Magistério perene" },
		{ num: "3.", text: "Sem proselitismo de heresias ou modernismos" },
		{ num: "4.", text: "Respeite os membros — sem ataques pessoais" },
		{ num: "5.", text: "Português em primeiro lugar" },
	];

	popularTags = [
		"rosario",
		"doutrina",
		"santos-padres",
		"tradicional",
		"maria",
		"liturgia",
		"tomismo",
		"quaresma",
		"sao-miguel",
		"fatima",
	];

	communityStats = {
		members: "412",
		posts: "1.2k",
		online: "38",
	};

	constructor(private forumService: ForumService) {}

	ngOnInit(): void {
		this.load();
		window.addEventListener("scroll", this.onScroll);
	}

	ngOnDestroy(): void {
		window.removeEventListener("scroll", this.onScroll);
	}

	load(): void {
		this.loading = true;
		this.error = false;
		this.page = 0;
		this.posts = [];

		this.forumService.getAll(0, 15).subscribe({
			next: (page) => {
				this.posts = this.toVMs(page.content);
				this.totalPages = page.totalPages;
				this.hasMore = this.page < this.totalPages - 1;
				this.loading = false;
			},
			error: () => {
				this.error = true;
				this.loading = false;
			},
		});
	}

	setSort(sort: SortType): void {
		this.activeSort = sort;
		this.load();
	}

	vote(post: ForumPostVM, direction: 1 | -1): void {
		const prev = post._vote;
		post._vote = prev === direction ? 0 : direction;
		post._score = post._score - prev + post._vote;
		// TODO: this.forumService.vote(post.id, post._vote).subscribe()
	}

	openThread(id: string): void {
		// TODO: router.navigate(['/forum', id])
		console.log("Abrir thread:", id);
	}

	openNewPost(): void {
		this.showNewPost = true;
	}

	closeNewPost(): void {
		this.showNewPost = false;
		this.newPost = { title: "", content: "", tagsRaw: "" };
	}

	submitPost(): void {
		if (!this.newPost.title.trim() || this.submitting) return;

		this.submitting = true;
		const tagSlugs = this.newPost.tagsRaw
			.split(",")
			.map((t) => t.trim().toLowerCase().replace(/\s+/g, "-"))
			.filter(Boolean);

		this.forumService
			.create({
				title: this.newPost.title.trim(),
				content: this.newPost.content.trim(),
				tagSlugs,
			})
			.subscribe({
				next: (post) => {
					this.posts = [this.toVM(post), ...this.posts];
					this.submitting = false;
					this.closeNewPost();
				},
				error: () => {
					this.submitting = false;
					// TODO: toast de erro
				},
			});
	}

	share(post: ForumPostVM, event: MouseEvent): void {
		event.stopPropagation();
		const url = `${window.location.origin}/forum/${post.id}`;
		if (navigator.clipboard) {
			navigator.clipboard.writeText(url).then(() => {
				// TODO: toast "Link copiado!"
			});
		}
	}

	filterByTag(tag: string): void {
		console.log("Filtrar por tag:", tag);
		// TODO: aplicar filtro de tag
	}

	authorInitial(post: ForumPost): string {
		const name = post.author.globalName || post.author.username;
		return name.charAt(0).toUpperCase();
	}

	formatDate(iso: string): string {
		const now = new Date();
		const date = new Date(iso);
		const diffMs = now.getTime() - date.getTime();
		const diffMin = Math.floor(diffMs / 60000);
		const diffH = Math.floor(diffMin / 60);
		const diffD = Math.floor(diffH / 24);

		if (diffMin < 1) return "agora";
		if (diffMin < 60) return `${diffMin}m`;
		if (diffH < 24) return `${diffH}h`;
		if (diffD < 7) return `${diffD}d`;

		return new Intl.DateTimeFormat("pt-BR", {
			day: "numeric",
			month: "short",
		}).format(date);
	}

	excerpt(content: string, limit = 200): string {
		return content.length > limit ? content.slice(0, limit).trimEnd() + "…" : content;
	}

	private onScroll = (): void => {
		if (this.loadingMore || !this.hasMore || this.loading) return;
		const scrolled = window.scrollY + window.innerHeight;
		const total = document.documentElement.scrollHeight;
		if (scrolled >= total - 400) this.loadMorePosts();
	};

	private loadMorePosts(): void {
		this.loadingMore = true;
		this.forumService.getAll(this.page + 1, 15).subscribe({
			next: (page) => {
				this.posts = [...this.posts, ...this.toVMs(page.content)];
				this.page++;
				this.hasMore = this.page < this.totalPages - 1;
				this.loadingMore = false;
			},
			error: () => {
				this.loadingMore = false;
			},
		});
	}

	private toVMs(posts: ForumPost[]): ForumPostVM[] {
		return posts.map(this.toVM);
	}

	private toVM = (post: ForumPost): ForumPostVM => ({
		...post,
		_score: 0, // virá do backend como upvotes - downvotes
		_vote: 0,
	});
}
