import { Component, Input, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BlogPost } from "../../../../core/services/blog";

@Component({
  selector: "app-post-card",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./post-card.html",
  styleUrls: ["./post-card.scss"],
})
export class PostCardComponent implements OnInit {
  @Input({ required: true }) post!: BlogPost;

  upvoted = signal(false);
  voteCount = signal(0);

  ngOnInit() {
    this.voteCount.set(this.post.upvotes ?? 0);
  }

  toggleUpvote(event: Event) {
    event.stopPropagation();
    this.upvoted.update((v) => !v);
    this.voteCount.update((v) => (this.upvoted() ? v + 1 : v - 1));
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  readTime(content: string): number {
    return Math.max(1, Math.ceil(content.replace(/<[^>]*>/g, "").split(" ").length / 200));
  }

  excerpt(content: string, limit = 160): string {
    const plain = content.replace(/<[^>]*>/g, "");
    return plain.length > limit ? plain.slice(0, limit).trimEnd() + "…" : plain;
  }

  get authorInitial(): string {
    return this.post.author.username.charAt(0).toUpperCase();
  }
}
