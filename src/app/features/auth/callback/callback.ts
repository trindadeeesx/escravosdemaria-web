import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Auth } from '../../../core/auth/auth';

@Component({
  selector: 'app-callback',
  imports: [],
  templateUrl: './callback.html',
  styleUrl: './callback.scss',
  standalone: true,
})
export class Callback {
  constructor(
    private route: ActivatedRoute,
    private auth: Auth,
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.auth.logout();
      return;
    }

    this.auth.handleCallback(token);
  }
}
