import { Component, OnInit } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../../../core/auth/auth";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: "./navbar.html",
  styleUrls: ["./navbar.scss"],
})
export class NavbarComponent implements OnInit {
  isDark = false;

  constructor(public auth: AuthService) {}

  ngOnInit() {
    const saved = localStorage.getItem("theme");
    this.isDark = saved === "dark";
    this.applyTheme();

    if (localStorage.getItem("token") && !this.auth.currentUser()) {
      this.auth.loadMe().subscribe();
    }
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    localStorage.setItem("theme", this.isDark ? "dark" : "light");
    this.applyTheme();
  }

  private applyTheme() {
    document.documentElement.setAttribute("data-theme", this.isDark ? "dark" : "light");
  }

  login() {
    this.auth.initiateLogin("/auth/callback");
  }
  logout() {
    this.auth.logout();
  }

  getAvatarUrl(avatar?: string): string {
    if (!avatar) return "";
    return avatar.startsWith("http") ? avatar : `https://cdn.discordapp.com/avatars/${avatar}`;
  }
}
