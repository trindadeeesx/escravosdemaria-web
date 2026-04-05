import { Component } from "@angular/core";
import { RouterOutlet, RouterLink, RouterLinkActive } from "@angular/router";
import { NavbarComponent } from "../../features/shared/components/navbar/navbar.component";

@Component({
	selector: "app-admin-layout",
	standalone: true,
	imports: [RouterOutlet, RouterLink, RouterLinkActive, NavbarComponent],
	template: `
		<app-navbar />
		<div class="admin-wrap">
			<aside class="admin-sidebar">
				<div class="admin-sidebar__title">Administração</div>
				<nav>
					<a routerLink="/admin/moderation" routerLinkActive="active">Moderação</a>
					<a routerLink="/admin/bot" routerLinkActive="active">Bot</a>
				</nav>
			</aside>
			<main class="admin-main">
				<router-outlet />
			</main>
		</div>
	`,
	styles: [
		`
			@use "../../../styles/variables" as *;

			.admin-wrap {
				padding-top: 60px;
				display: flex;
				min-height: 100vh;
			}

			.admin-sidebar {
				width: 200px;
				flex-shrink: 0;
				border-right: 1px solid var(--border);
				padding: 1.5rem 1rem;
			}

			.admin-sidebar__title {
				font-family: "Cinzel", serif;
				font-size: 0.62rem;
				letter-spacing: 0.15em;
				text-transform: uppercase;
				color: var(--text-faint);
				margin-bottom: 1rem;
			}

			nav {
				display: flex;
				flex-direction: column;
				gap: 4px;
			}

			nav a {
				font-family: "Inter", sans-serif;
				font-size: 0.85rem;
				color: var(--text-muted);
				padding: 7px 10px;
				border-radius: 4px;
				text-decoration: none;
				transition: all 0.15s;
			}

			nav a:hover {
				color: var(--text);
				background: var(--bg-subtle);
			}

			nav a.active {
				color: var(--primary);
				background: var(--primary-bg);
			}

			.admin-main {
				flex: 1;
				padding: 2rem;
				max-width: 900px;
			}
		`,
	],
})
export class AdminLayout {}
