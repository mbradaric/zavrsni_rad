import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../core/services/auth';
import { User } from '../../../core/models/user';

@Component({
  selector: 'app-navbar',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    RouterLink,
    CommonModule,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  isLoggedIn = false;
  user: User | null = null;

  constructor(private authService: Auth) {}

  ngOnInit() {
    this.authService.isLoggedIn().subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });

    this.authService.getUser().subscribe((user) => {
      this.user = user;
    });
  }

  logout() {
    this.authService.logout();
  }
}
