import { Injectable, signal, computed } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { tap } from "rxjs";
import { environment } from "../../../environments/environment";

export interface User {
  id: string;
  username: string;
  globalName?: string;
  avatar?: string;
  email?: string;
  displayColor?: string;
}

export interface Permissions {
  blog: { canPost: boolean; canComment: boolean };
  forum: { canPost: boolean; canComment: boolean };
  duvidas: { canPost: boolean; canAnswer: boolean };
}

export interface MeResponse {
  user: User;
  permissions: Permissions;
}

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly API = environment.apiUrl + "/auth";

  private _me = signal<MeResponse | null>(null);

  isLoggedIn = computed(() => !!this._me());
  currentUser = computed(() => this._me()?.user ?? null);
  permissions = computed(() => this._me()?.permissions ?? null);

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
