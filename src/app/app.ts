import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Auth } from './core/auth/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor(public auth: Auth) {}

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.auth.loadMe().subscribe();
      console.log(this.auth.currentUser()?.user);
    }
  }

  login() {
    this.auth.initiateLogin('/auth/callback');
  }
}
