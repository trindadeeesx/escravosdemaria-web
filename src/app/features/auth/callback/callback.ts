import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "../../../core/auth/auth.service";

@Component({
  selector: "app-callback",
  standalone: true,
  imports: [],
  template: `
    <div
      style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:serif;color:var(--text-muted)"
    >
      Autenticando...
    </div>
  `,
})
export class Callback implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get("token");
    if (!token) {
      this.auth.logout();
      return;
    }
    this.auth.handleCallback(token);
  }
}
