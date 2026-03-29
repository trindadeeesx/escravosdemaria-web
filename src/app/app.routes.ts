import { Routes } from "@angular/router";
import { Callback } from "./features/auth/callback/callback";

export const routes: Routes = [
  { path: "auth/callback", component: Callback },
  {
    path: "",
    loadComponent: () => import("./layouts/main-layout/main-layout").then((m) => m.MainLayout),
    children: [
      { path: "", redirectTo: "blog", pathMatch: "full" },
      {
        path: "blog",
        loadComponent: () => import("./features/blog/blog-list/blog-list").then((m) => m.BlogList),
      },
      {
        path: "forum",
        loadComponent: () =>
          import("./features/forum/forum-list/forum-list").then((m) => m.ForumList),
      },
      {
        path: "questions",
        loadComponent: () =>
          import("./features/questions/questions-list/questions-list").then((m) => m.QuestionsList),
      },
      {
        path: "rosario",
        loadComponent: () => import("./features/rosario/rosario/rosario").then((m) => m.Rosario),
      },
    ],
  },
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
      { path: "bot", loadComponent: () => import("./features/admin/bot/bot").then((m) => m.Bot) },
    ],
  },
  { path: "**", redirectTo: "blog" },
];
