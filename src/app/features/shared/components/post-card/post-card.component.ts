import { Component, Input, signal, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BlogPost } from "../../../../core/models";

@Component({
	selector: "app-post-card",
	standalone: true,
	imports: [CommonModule],
	templateUrl: "./post-card.component.html",
	styleUrls: ["./post-card.component.scss"],
})
export class PostCardComponent {
	@Input({ required: true }) post!: BlogPost;

	// Voto local: 1 = upvote, -1 = downvote, 0 = neutro
	private _vote = signal<number>(0);

	userVote = computed(() => {
		// Inicializa com o voto que veio do backend se ainda não foi modificado
		if (this._vote() === 0 && this.post.userVote !== null) {
			return this.post.userVote ?? 0;
		}
		return this._vote();
	});

	voteCount = computed(() => {
		const base = this.post.upvotes - (this.post.downvotes ?? 0);
		const prev = this.post.userVote ?? 0;
		const curr = this.userVote();
		// Ajusta o contador otimisticamente
		return base - prev + curr;
	});

	get authorInitial(): string {
		const name = this.post.author.globalName || this.post.author.username;
		return name.charAt(0).toUpperCase();
	}

	vote(direction: 1 | -1, event: MouseEvent): void {
		event.stopPropagation();
		// Toggle: clicar no mesmo voto desfaz
		if (this.userVote() === direction) {
			this._vote.set(0);
		} else {
			this._vote.set(direction);
		}
		// TODO: this.blogService.vote(this.post.id, this._vote()).subscribe()
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
