import { Component } from "@angular/core";

@Component({
  selector: "app-question-list",
  standalone: true,
  template: `<p style="padding:2rem;color:var(--text-muted);font-style:italic">
    Questões — em breve.
  </p>`,
})
export class QuestionsList {}
