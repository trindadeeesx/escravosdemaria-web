import { Component, OnInit, signal, HostListener } from "@angular/core";
import { RouterOutlet, RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from "../../core/auth/auth.service";

@Component({
	selector: "app-admin-layout",
	standalone: true,
	imports: [RouterOutlet, RouterLink, RouterLinkActive],
	templateUrl: "./admin-layout.html",
	styleUrl: "./admin-layout.scss",
})
export class AdminLayout implements OnInit {
	sidebarCollapsed = signal(false);

	constructor(public auth: AuthService) {}

	@HostListener("window:resize")
	onResize(): void {
		if (window.innerWidth < 900) this.sidebarCollapsed.set(true);
	}

	ngOnInit(): void {
		if (window.innerWidth < 900) this.sidebarCollapsed.set(true);
	}

	toggleSidebar(): void {
		this.sidebarCollapsed.update((v) => !v);
	}

	logout(): void {
		this.auth.logout();
	}

	getAvatarUrl(avatar?: string | null): string {
		if (!avatar) return "";
		return avatar.startsWith("http") ? avatar : `https://cdn.discordapp.com/avatars/${avatar}`;
	}

	getInitial(): string {
		const user = this.auth.currentUser();
		return (user?.globalName ?? user?.username ?? "A").charAt(0).toUpperCase();
	}

	getUserRoleLabel(): string {
		return this.auth.primaryRole()?.name ?? "Administrador";
	}
}
