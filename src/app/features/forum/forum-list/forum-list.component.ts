import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { ForumService, ForumPost, ForumFilters, VoteType } from "../../../core/services/forum.service";

type SortType = "hot" | "new" | "top";

interface ForumPostVM extends ForumPost {
	_vote: VoteType | null;
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

	// Filtros
	searchQuery = "";
	activeTag = "";
	authorQuery = "";
	filtersOpen = false;
	private searchDebounce: ReturnType<typeof setTimeout> | null = null;

	sorts = [
		{ value: "hot" as SortType, label: "🔥 Em Alta" },
		{ value: "new" as SortType, label: "✦ Recentes" },
		{ value: "top" as SortType, label: "↑ Top" },
	];

	rules = [
		{ num: "1.", text: "Caridade em tudo — corrija com amor fraterno" },
		{ num: "2.", text: "Fidelidade à Tradição e ao Magistério perene" },
		{ num: "3.", text: "Sem proselitismo de heresias ou modernismos" },
		{ num: "4.", text: "Respeite os membros — sem ataques pessoais" },
		{ num: "5.", text: "Português em primeiro lugar" },
	];

	popularTags = [
		"rosario", "doutrina", "santos-padres", "tradicional",
		"maria", "liturgia", "tomismo", "quaresma", "sao-miguel", "fatima",
	];

	communityStats = { members: "412", posts: "1.2k", online: "38" };

	constructor(
		private forumService: ForumService,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.load();
		window.addEventListener("scroll", this.onScroll);
	}

	ngOnDestroy(): void {
		window.removeEventListener("scroll", this.onScroll);
		if (this.searchDebounce) clearTimeout(this.searchDebounce);
	}

	// ── Carregamento ────────────────────────────────────────────────────────────

	load(): void {
		this.loading = true;
		this.error = false;
		this.page = 0;
		this.posts = [];
		this.forumService.getAll(0, 15, this.buildFilters()).subscribe({
			next: (p) => {
				this.posts = this.toVMs(p.items);
				this.totalPages = p.totalPages;
				this.hasMore = this.page < this.totalPages - 1;
				this.loading = false;
			},
			error: () => { this.error = true; this.loading = false; },
		});
	}

	// ── Ordenação ────────────────────────────────────────────────────────────────

	setSort(sort: SortType): void {
		this.activeSort = sort;
		this.load();
	}

	// ── Filtros ──────────────────────────────────────────────────────────────────

	onSearchInput(): void {
		if (this.searchDebounce) clearTimeout(this.searchDebounce);
		this.searchDebounce = setTimeout(() => this.load(), 350);
	}

	filterByTag(tag: string): void {
		this.activeTag = this.activeTag === tag ? "" : tag;
		this.load();
	}

	clearFilters(): void {
		this.searchQuery = "";
		this.activeTag = "";
		this.authorQuery = "";
		this.load();
	}

	get hasActiveFilters(): boolean {
		return !!(this.searchQuery || this.activeTag || this.authorQuery);
	}

	private buildFilters(): ForumFilters {
		const f: ForumFilters = { sort: this.activeSort };
		if (this.searchQuery.trim()) f.q = this.searchQuery.trim();
		if (this.activeTag)          f.tag = this.activeTag;
		if (this.authorQuery.trim()) f.author = this.authorQuery.trim();
		return f;
	}

	// ── Votos ───────────────────────────────────────────────────────────────────

	vote(post: ForumPostVM, type: VoteType, event: MouseEvent): void {
		event.stopPropagation();
		const prevVote = post._vote;
		const prevUp   = post.upvotes;
		const prevDown = post.downvotes;
		// Optimistic: toggle se mesmo tipo
		post._vote = post._vote === type ? null : type;
		this.forumService.vote(post.id, type).subscribe({
			next: (res) => {
				post.upvotes   = res.upvotes;
				post.downvotes = res.downvotes;
				post._vote     = res.userVote;
			},
			error: () => {
				post._vote     = prevVote;
				post.upvotes   = prevUp;
				post.downvotes = prevDown;
			},
		});
	}

	// ── Navegação ────────────────────────────────────────────────────────────────

	openThread(id: string): void {
		this.router.navigate(["/forum", id]);
	}

	openNewPost(): void {
		this.router.navigate(["/forum/new"]);
	}

	// ── Helpers ──────────────────────────────────────────────────────────────────

	share(post: ForumPostVM, event: MouseEvent): void {
		event.stopPropagation();
		navigator.clipboard?.writeText(`${window.location.origin}/forum/${post.id}`);
	}

	authorInitial(post: ForumPost): string {
		return (post.author.globalName || post.author.username).charAt(0).toUpperCase();
	}

	formatDate(iso: string): string {
		const diffMs = Date.now() - new Date(iso).getTime();
		const m = Math.floor(diffMs / 60000);
		const h = Math.floor(m / 60);
		const d = Math.floor(h / 24);
		if (m < 1)  return "agora";
		if (m < 60) return `${m}m`;
		if (h < 24) return `${h}h`;
		if (d < 7)  return `${d}d`;
		return new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short" }).format(new Date(iso));
	}

	excerpt(content: string, limit = 200): string {
		return content.length > limit ? content.slice(0, limit).trimEnd() + "…" : content;
	}

	private onScroll = (): void => {
		if (this.loadingMore || !this.hasMore || this.loading) return;
		if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 400) {
			this.loadMorePosts();
		}
	};

	private loadMorePosts(): void {
		this.loadingMore = true;
		this.forumService.getAll(this.page + 1, 15, this.buildFilters()).subscribe({
			next: (p) => {
				this.posts = [...this.posts, ...this.toVMs(p.items)];
				this.page++;
				this.hasMore = this.page < this.totalPages - 1;
				this.loadingMore = false;
			},
			error: () => { this.loadingMore = false; },
		});
	}

	private toVMs(posts: ForumPost[]): ForumPostVM[] {
		return posts.map(this.toVM);
	}

	private toVM = (post: ForumPost): ForumPostVM => ({
		...post,
		_vote: post.userVote ?? null,
	});
}
