import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Route, Router } from '@angular/router';
import { tap } from 'rxjs';

export interface User {
  id: string;
  username: string;
  avatar: string;
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

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly API = 'http://localhost:8080/auth';

  isLoggedIn = signal(!!localStorage.getItem('token'));
  currentUser = signal<MeResponse | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  initiateLogin(redirect = '/auth/callback') {
    this.http
      .get<{ url: string }>(`${this.API}/discord`, {
        params: {
          redirect,
        },
      })
      .subscribe(({ url }) => {
        window.location.href = url;
      });
  }

  handleCallback(token: string) {
    localStorage.setItem('token', token);
    this.isLoggedIn.set(true);
    this.loadMe().subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  loadMe() {
    return this.http
      .get<MeResponse>(`${this.API}/me`)
      .pipe(tap((data) => this.currentUser.set(data)));
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedIn.set(false);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
