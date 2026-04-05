import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
	selector: "app-questions-list",
	standalone: true,
	imports: [CommonModule],
	template: `
		<div
			style="padding: 3rem 1rem; text-align: center; color: var(--text-muted); font-style: italic;"
		>
			<h2>Dúvidas e Respostas</h2>
			<p>Em breve — espaço para tirar dúvidas sobre fé, liturgia e vida cristã.</p>
		</div>
	`,
})
export class QuestionsListComponent {}
