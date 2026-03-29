import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BlogService, BlogPost } from "../../../core/services/blog";
import { PostCardComponent } from "../../shared/components/post-card/post-card";

@Component({
  selector: "app-blog-list",
  standalone: true,
  imports: [CommonModule, PostCardComponent],
  templateUrl: "./blog-list.html",
  styleUrls: ["./blog-list.scss"],
})
export class BlogList implements OnInit, OnDestroy {
  posts: BlogPost[] = [];
  loading = false;
  loadingMore = false;
  error = false;
  page = 0;
  hasMore = true;
  private readonly PAGE_SIZE = 10;

  constructor(private blogService: BlogService) {}

  ngOnInit() {
    this.load();
  }
  ngOnDestroy() {}

  load() {
    this.loading = true;
    this.error = false;
    this.blogService.getAll(0, this.PAGE_SIZE).subscribe({
      next: (data) => {
        this.posts = data.content;
        this.page = 0;
        this.hasMore = data.totalPages > 1;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }

  loadMore() {
    if (this.loadingMore || !this.hasMore) return;
    this.loadingMore = true;
    this.blogService.getAll(this.page + 1, this.PAGE_SIZE).subscribe({
      next: (data) => {
        this.posts = [...this.posts, ...data.content];
        this.page++;
        this.hasMore = this.page < data.totalPages - 1;
        this.loadingMore = false;
      },
      error: () => {
        this.loadingMore = false;
      },
    });
  }

  @HostListener("window:scroll")
  onScroll() {
    const position = window.innerHeight + window.scrollY;
    const height = document.body.offsetHeight;
    if (position >= height - 300) this.loadMore();
  }
}
