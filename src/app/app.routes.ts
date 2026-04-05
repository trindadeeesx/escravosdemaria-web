import { Routes } from "@angular/router";
import { Callback } from "./features/auth/callback/callback";

export const routes: Routes = [
	// Auth callback — sem layout
	{
		path: "auth/callback",
		component: Callback,
	},

	// Layout principal
	{
		path: "",
		loadComponent: () => import("./layouts/main-layout/main-layout").then((m) => m.MainLayout),
		children: [
			{ path: "", redirectTo: "home", pathMatch: "full" },
			{
				path: "home",
				loadComponent: () => import("./features/home/home.component").then((m) => m.HomeComponent),
			},
			{
				path: "blog",
				loadComponent: () =>
					import("./features/blog/blog-list/blog-list.component").then((m) => m.BlogListComponent),
			},
			{
				path: "forum",
				loadComponent: () =>
					import("./features/forum/forum-list/forum-list.component").then(
						(m) => m.ForumListComponent,
					),
			},
			{
				path: "questions",
				loadComponent: () =>
					import("./features/questions/questions-list/questions-list.component").then(
						(m) => m.QuestionsListComponent,
					),
			},
			{
				path: "rosario",
				loadComponent: () =>
					import("./features/rosario/rosario/rosario.component").then((m) => m.RosarioComponent),
			},
		],
	},

	// Layout admin
	{
		path: "admin",
		loadComponent: () => import("./layouts/admin-layout/admin-layout").then((m) => m.AdminLayout),
		children: [
			{ path: "", redirectTo: "moderation", pathMatch: "full" },
			{
				path: "moderation",
				loadComponent: () =>
					import("./features/admin/moderation/moderation").then((m) => m.Moderation),
			},
			{
				path: "bot",
				loadComponent: () => import("./features/admin/bot/bot").then((m) => m.Bot),
			},
		],
	},

	{ path: "**", redirectTo: "home" },
];
