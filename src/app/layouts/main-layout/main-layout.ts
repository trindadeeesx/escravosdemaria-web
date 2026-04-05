import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavbarComponent } from "../../features/shared/components/navbar/navbar.component";

@Component({
	selector: "app-main-layout",
	standalone: true,
	imports: [RouterOutlet, NavbarComponent],
	template: `
		<app-navbar />
		<main class="layout-main">
			<router-outlet />
		</main>
	`,
	styles: [
		`
			.layout-main {
				min-height: 100vh;
			}
		`,
	],
})
export class MainLayout {}
