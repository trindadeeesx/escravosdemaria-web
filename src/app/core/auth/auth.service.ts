import { Injectable, signal, computed } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { tap } from "rxjs";
import { environment } from "../../../environments/environment";
import { MeResponse, ADMIN_ROLE_IDS, ROLE_PRIORITY } from "../models";

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly API = environment.apiUrl + "/auth";

  private _me = signal<MeResponse | null>(null);

  isLoggedIn = computed(() => !!this._me());
  currentUser = computed(() => this._me()?.user ?? null);
  permissions = computed(() => this._me()?.permissions ?? null);
  isAdmin = computed(() =>
    this._me()?.user.roles?.some((r) => ADMIN_ROLE_IDS.has(r.id)) ?? false,
  );

  // Role de maior hierarquia do usuário, pronta para exibir em qualquer lugar
  primaryRole = computed(() => {
    const roles = this._me()?.user.roles;
    if (!roles?.length) return null;
    return roles.reduce((best, current) => {
      const bi = ROLE_PRIORITY.indexOf(best.id);
      const ci = ROLE_PRIORITY.indexOf(current.id);
      const bestIdx  = bi  === -1 ? Infinity : bi;
      const currIdx  = ci  === -1 ? Infinity : ci;
      return currIdx < bestIdx ? current : best;
    });
  });

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  initiateLogin(redirect = "/auth/callback") {
    this.http
      .get<{ url: string }>(`${this.API}/discord`, { params: { redirect } })
      .subscribe(({ url }) => (window.location.href = url));
  }

  handleCallback(token: string) {
    localStorage.setItem("token", token);
    this.loadMe().subscribe(() => this.router.navigate(["/"]));
  }

  loadMe() {
    return this.http.get<MeResponse>(`${this.API}/me`).pipe(tap((data) => this._me.set(data)));
  }

  logout() {
    localStorage.removeItem("token");
    this._me.set(null);
    this.router.navigate(["/"]);
  }
}
