import { Component, OnInit, HostListener } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../../../core/auth/auth.service";

@Component({
	selector: "app-navbar",
	standalone: true,
	imports: [RouterLink, RouterLinkActive, CommonModule],
	templateUrl: "./navbar.component.html",
	styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
	isDark = false;
	menuOpen = false;
	userMenuOpen = false;
	scrolled = false;

	constructor(public auth: AuthService) {}

	ngOnInit(): void {
		const saved = localStorage.getItem("theme");
		this.isDark = saved === "dark";
		this.applyTheme();

		if (localStorage.getItem("token") && !this.auth.currentUser()) {
			this.auth.loadMe().subscribe();
		}
	}

	@HostListener("window:scroll")
	onScroll(): void {
		this.scrolled = window.scrollY > 20;
	}

	@HostListener("document:click", ["$event"])
	onDocumentClick(event: MouseEvent): void {
		const target = event.target as HTMLElement;
		if (!target.closest(".user-menu")) {
			this.userMenuOpen = false;
		}
	}

	toggleTheme(): void {
		this.isDark = !this.isDark;
		localStorage.setItem("theme", this.isDark ? "dark" : "light");
		this.applyTheme();
	}

	toggleMenu(): void {
		this.menuOpen = !this.menuOpen;
	}

	closeMenu(): void {
		this.menuOpen = false;
	}

	toggleUserMenu(): void {
		this.userMenuOpen = !this.userMenuOpen;
	}

	login(): void {
		this.auth.initiateLogin("/auth/callback");
	}

	logout(): void {
		this.userMenuOpen = false;
		this.auth.logout();
	}

	getAvatarUrl(avatar?: string): string {
		if (!avatar) return "";
		return avatar.startsWith("http") ? avatar : `https://cdn.discordapp.com/avatars/${avatar}`;
	}

	private applyTheme(): void {
		document.documentElement.setAttribute("data-theme", this.isDark ? "dark" : "light");
	}
}
