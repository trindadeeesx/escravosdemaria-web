import { Component, Input, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BlogPost } from "../../../../core/models";
import { BlogService } from "../../../../core/services/blog.service";

type VoteType = "UPVOTE" | "DOWNVOTE";

@Component({
	selector: "app-post-card",
	standalone: true,
	imports: [CommonModule],
	templateUrl: "./post-card.component.html",
	styleUrls: ["./post-card.component.scss"],
})
export class PostCardComponent {
	@Input({ required: true }) post!: BlogPost;

	localVote = signal<VoteType | null>(null);

	constructor(private blogService: BlogService) {}

	ngOnChanges(): void {
		this.localVote.set(this.post.userVote);
	}

	get currentVote(): VoteType | null {
		return this.localVote();
	}

	get authorInitial(): string {
		const name = this.post.author.globalName || this.post.author.username;
		return name.charAt(0).toUpperCase();
	}

	vote(type: VoteType, event: MouseEvent): void {
		event.stopPropagation();
		const prev = this.localVote();
		const prevUp   = this.post.upvotes;
		const prevDown = this.post.downvotes;
		this.localVote.set(prev === type ? null : type);
		this.blogService.vote(this.post.id, type).subscribe({
			next: (res) => {
				this.post.upvotes   = res.upvotes;
				this.post.downvotes = res.downvotes;
				this.localVote.set(res.userVote);
			},
			error: () => {
				this.localVote.set(prev);
				this.post.upvotes   = prevUp;
				this.post.downvotes = prevDown;
			},
		});
	}

	formatDate(iso: string): string {
		return new Intl.DateTimeFormat("pt-BR", {
			day: "numeric",
			month: "short",
			year: "numeric",
		}).format(new Date(iso));
	}

	readTime(content: string): number {
		const words = content.trim().split(/\s+/).length;
		return Math.max(1, Math.round(words / 200));
	}

	excerpt(content: string, limit = 120): string {
		return content.length > limit ? content.slice(0, limit).trimEnd() + "…" : content;
	}
}
