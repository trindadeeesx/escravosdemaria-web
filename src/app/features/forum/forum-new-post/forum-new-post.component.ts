import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { marked } from "marked";
import { ForumService } from "../../../core/services/forum.service";

interface MediaItem {
	id: string;
	type: "image" | "video" | "link";
	url: string;
	name: string;
	preview?: string;
	dragging?: boolean;
}

type EditorTab = "write" | "preview";

@Component({
	selector: "app-forum-new-post",
	standalone: true,
	imports: [CommonModule, FormsModule, RouterLink],
	templateUrl: "./forum-new-post.component.html",
	styleUrls: ["./forum-new-post.component.scss"],
})
export class ForumNewPostComponent implements OnInit {
	@ViewChild("textarea") textareaRef!: ElementRef<HTMLTextAreaElement>;
	@ViewChild("fileInput") fileInputRef!: ElementRef<HTMLInputElement>;

	title = "";
	content = "";
	tags: string[] = [];
	tagInput = "";
	mediaItems: MediaItem[] = [];
	linkInput = "";
	showLinkInput = false;

	activeTab: EditorTab = "write";
	previewHtml: SafeHtml = "";

	submitting = false;
	savingDraft = false;
	dragOver = false;
	draggedIndex: number | null = null;

	popularTags = [
		"rosario", "doutrina", "santos-padres", "tradicional",
		"maria", "liturgia", "tomismo", "quaresma", "sao-miguel", "fatima",
	];

	constructor(
		private forumService: ForumService,
		private router: Router,
		private sanitizer: DomSanitizer,
	) {}

	ngOnInit(): void {
		marked.setOptions({ breaks: true, gfm: true } as any);
	}

	// ── Tabs ────────────────────────────────────────────────────────────────────

	setTab(tab: EditorTab): void {
		this.activeTab = tab;
		if (tab === "preview") this.renderPreview();
	}

	private async renderPreview(): Promise<void> {
		const html = await marked.parse(this.content || "*Nada a pré-visualizar ainda.*");
		this.previewHtml = this.sanitizer.bypassSecurityTrustHtml(html as string);
	}

	// ── Toolbar markdown ────────────────────────────────────────────────────────

	insertMarkdown(before: string, after = "", placeholder = ""): void {
		const ta = this.textareaRef?.nativeElement;
		if (!ta) return;
		const start = ta.selectionStart;
		const end   = ta.selectionEnd;
		const sel   = ta.value.slice(start, end) || placeholder;
		const insert = before + sel + after;
		this.content = ta.value.slice(0, start) + insert + ta.value.slice(end);
		setTimeout(() => {
			ta.focus();
			const cursor = start + before.length + sel.length;
			ta.setSelectionRange(cursor, cursor);
		});
	}

	bold()        { this.insertMarkdown("**", "**", "texto em negrito"); }
	italic()      { this.insertMarkdown("*", "*", "texto em itálico"); }
	heading()     { this.insertMarkdown("\n## ", "", "Título"); }
	blockquote()  { this.insertMarkdown("\n> ", "", "citação"); }
	code()        { this.insertMarkdown("`", "`", "código"); }
	codeBlock()   { this.insertMarkdown("\n```\n", "\n```", "código"); }
	listItem()    { this.insertMarkdown("\n- ", "", "item"); }
	insertLink(url: string, text = "link") { this.insertMarkdown(`[${text}](`, ")", url); }

	// ── Tags ────────────────────────────────────────────────────────────────────

	onTagKeydown(event: KeyboardEvent): void {
		if (event.key === "Enter" || event.key === ",") {
			event.preventDefault();
			this.addTag(this.tagInput);
		}
		if (event.key === "Backspace" && !this.tagInput && this.tags.length) {
			this.tags = this.tags.slice(0, -1);
		}
	}

	addTag(raw: string): void {
		const tag = raw.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-áéíóúãõâêô]/g, "");
		if (tag && !this.tags.includes(tag) && this.tags.length < 5) {
			this.tags.push(tag);
		}
		this.tagInput = "";
	}

	addPopularTag(tag: string): void {
		if (!this.tags.includes(tag) && this.tags.length < 5) this.tags.push(tag);
	}

	removeTag(tag: string): void {
		this.tags = this.tags.filter((t) => t !== tag);
	}

	// ── Mídia ───────────────────────────────────────────────────────────────────

	onFilesDrop(event: DragEvent): void {
		event.preventDefault();
		this.dragOver = false;
		const files = Array.from(event.dataTransfer?.files ?? []);
		this.addFiles(files);
	}

	onFilesSelected(event: Event): void {
		const files = Array.from((event.target as HTMLInputElement).files ?? []);
		this.addFiles(files);
		(event.target as HTMLInputElement).value = "";
	}

	private addFiles(files: File[]): void {
		files.slice(0, 10 - this.mediaItems.length).forEach((file) => {
			if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) return;
			const reader = new FileReader();
			reader.onload = (e) => {
				this.mediaItems.push({
					id: crypto.randomUUID(),
					type: file.type.startsWith("video/") ? "video" : "image",
					url: e.target?.result as string,
					name: file.name,
					preview: file.type.startsWith("image/") ? (e.target?.result as string) : undefined,
				});
			};
			reader.readAsDataURL(file);
		});
	}

	addLink(): void {
		const url = this.linkInput.trim();
		if (!url) return;
		this.mediaItems.push({
			id: crypto.randomUUID(),
			type: "link",
			url,
			name: url,
		});
		this.linkInput = "";
		this.showLinkInput = false;
	}

	removeMedia(id: string): void {
		this.mediaItems = this.mediaItems.filter((m) => m.id !== id);
	}

	// Drag-and-drop reorder
	onDragStart(index: number): void { this.draggedIndex = index; }

	onDragOverItem(event: DragEvent, index: number): void {
		event.preventDefault();
		if (this.draggedIndex === null || this.draggedIndex === index) return;
		const items = [...this.mediaItems];
		const dragged = items.splice(this.draggedIndex, 1)[0];
		items.splice(index, 0, dragged);
		this.mediaItems = items;
		this.draggedIndex = index;
	}

	onDragEnd(): void { this.draggedIndex = null; }

	// ── Submit ──────────────────────────────────────────────────────────────────

	get canSubmit(): boolean {
		return this.title.trim().length > 0 && !this.submitting && !this.savingDraft;
	}

	submit(): void {
		if (!this.canSubmit) return;
		this.submitting = true;
		this.forumService.create({
			title: this.title.trim(),
			content: this.content.trim(),
			tagSlugs: this.tags,
			isDraft: false,
		}).subscribe({
			next: () => this.router.navigate(["/forum"]),
			error: () => { this.submitting = false; },
		});
	}

	saveDraft(): void {
		if (!this.title.trim() || this.savingDraft) return;
		this.savingDraft = true;
		this.forumService.saveDraft({
			title: this.title.trim(),
			content: this.content.trim(),
			tagSlugs: this.tags,
		}).subscribe({
			next: () => { this.savingDraft = false; this.router.navigate(["/forum"]); },
			error: () => { this.savingDraft = false; },
		});
	}
}
