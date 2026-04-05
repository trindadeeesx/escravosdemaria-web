import { Component, OnInit, OnDestroy, computed, signal, HostListener } from "@angular/core";
import { BlogService } from "../../../core/services/blog.service";
import { BlogPost } from "../../../core/models";
import { PostCardComponent } from "../../shared/components/post-card/post-card.component";

interface Category {
	slug: string;
	label: string;
	count: number;
}

@Component({
	selector: "app-blog-list",
	standalone: true,
	imports: [PostCardComponent],
	templateUrl: "./blog-list.component.html",
	styleUrls: ["./blog-list.component.scss"],
})
export class BlogListComponent implements OnInit, OnDestroy {
	private allPosts: BlogPost[] = [];
	private currentPage = 0;
	private totalPages = 1;

	loading = true;
	loadingMore = false;
	error = false;
	activeCategory: string | null = null;

	// Posts filtrados pela categoria ativa
	get filteredPosts(): BlogPost[] {
		if (!this.activeCategory) return this.allPosts;
		return this.allPosts.filter((p) => p.category.slug === this.activeCategory);
	}

	get hasMore(): boolean {
		return this.currentPage < this.totalPages - 1;
	}

	// Top 5 por upvotes para a sidebar
	topPosts = computed(() => [...this.allPosts].sort((a, b) => b.upvotes - a.upvotes).slice(0, 5));

	// Categorias dedupliacadas
	get categories(): Category[] {
		const map: Record<string, Category> = {};
		this.allPosts.forEach((p) => {
			const { slug, name } = p.category;
			if (!map[slug]) map[slug] = { slug, label: name, count: 0 };
			map[slug].count++;
		});
		return Object.values(map).sort((a, b) => b.count - a.count);
	}

	constructor(private blogService: BlogService) {}

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
		this.currentPage = 0;
		this.allPosts = [];

		this.blogService.getAll(0, 10).subscribe({
			next: (page) => {
				this.allPosts = page.content;
				this.totalPages = page.totalPages;
				this.loading = false;
			},
			error: () => {
				this.error = true;
				this.loading = false;
			},
		});
	}

	setCategory(slug: string | null): void {
		this.activeCategory = this.activeCategory === slug ? null : slug;
	}

	private onScroll = (): void => {
		if (this.loadingMore || !this.hasMore || this.loading) return;
		const scrolled = window.scrollY + window.innerHeight;
		const total = document.documentElement.scrollHeight;
		if (scrolled >= total - 400) {
			this.loadMore();
		}
	};

	private loadMore(): void {
		this.loadingMore = true;
		this.blogService.getAll(this.currentPage + 1, 10).subscribe({
			next: (page) => {
				this.allPosts = [...this.allPosts, ...page.content];
				this.currentPage++;
				this.loadingMore = false;
			},
			error: () => {
				this.loadingMore = false;
			},
		});
	}
}
