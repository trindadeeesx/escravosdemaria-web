import { Injectable, signal } from "@angular/core";

export interface Toast {
	message: string;
	type: "success" | "error" | "info";
	duration?: number;
}

@Injectable({ providedIn: "root" })
export class ToastService {
	private toasts = signal<Toast[]>([]);

	show(message: string, type: "success" | "error" | "info" = "info", duration = 3000) {
		const toast = { message, type, duration };
		this.toasts.update((t) => [...t, toast]);
		setTimeout(() => this.remove(toast), duration);
	}

	private remove(toast: Toast) {
		this.toasts.update((t) => t.filter((t) => t !== toast));
	}

	getToasts() {
		return this.toasts.asReadonly();
	}
}
