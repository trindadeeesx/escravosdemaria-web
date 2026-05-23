# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm start          # dev server on localhost:4200
pnpm build          # production build
pnpm test           # run unit tests with Vitest
pnpm run watch      # incremental dev build
```

No lint script is configured. Use `npx ng generate` for scaffolding.

## Stack

- **Angular 21** — standalone components only, no NgModules anywhere
- **TypeScript 5.9** — strict mode + `strictTemplates: true`; all types must be explicit
- **SCSS** — custom design system in `src/styles/_variables.scss` (Playfair Display/EB Garamond/Cinzel fonts, cream/ink/navy/gold palette, spacing/shadow tokens); no Tailwind or utility-class framework
- **Angular Signals** (`signal`, `computed`, `asReadonly`) — state management; no NgRx
- **RxJS Observables** — all HTTP responses
- **Vitest + jsdom** — instead of Karma/Jasmine
- **pnpm** — package manager

## Architecture

### Route hierarchy

```
/auth/callback          → Callback (eagerly loaded, OAuth return)
/ (MainLayout)
  /home                 → HomeComponent
  /blog                 → BlogListComponent
  /forum                → ForumListComponent
  /questions            → QuestionsListComponent
  /rosario              → RosarioComponent
/admin (AdminLayout)
  /admin/moderation
  /admin/bot
```

All feature components are lazy-loaded via `loadComponent`. Layout components (`MainLayout`, `AdminLayout`) are the route parents — they render `<router-outlet>` with navbar/chrome around it.

### Data layer

`ApiService` (`src/app/core/services/api.service.ts`) is the HTTP base — it prepends `environment.apiUrl` (`http://localhost:8080`) and wraps `HttpClient`. Feature services (`BlogService`, `ForumService`, etc.) call it and return `Observable<T>`.

`authInterceptor` (functional) reads `localStorage.getItem("token")` and adds `Authorization: Bearer <token>` to every request.

Auth flow: `AuthService.initiateLogin()` → `GET /auth/discord` → Discord OAuth redirect → `/auth/callback?token=...` → token stored in `localStorage`, user populated via `GET /auth/me`.

The home page uses a BFF endpoint: `GET /bff/home` aggregates data server-side.

### State pattern

Services own `signal<T>` state and expose it as readonly. Components call signals in templates with `()`. `HomeService` is the canonical example — it manages `data`, `loading`, and `error` signals internally.

### Note on mock data

`BlogService.getAll()` currently returns hardcoded mock data via `of(MOCK)` instead of hitting the API. This is intentional/in-progress.
