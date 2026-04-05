import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
	selector: "app-rosario",
	standalone: true,
	imports: [CommonModule],
	template: `
		<div
			style="padding: 3rem 1rem; text-align: center; color: var(--text-muted); font-style: italic;"
		>
			<h2>O Santo Rosário</h2>
			<p>Em breve — guia completo de orações, mistérios e ladainhas.</p>
		</div>
	`,
})
export class RosarioComponent {}
