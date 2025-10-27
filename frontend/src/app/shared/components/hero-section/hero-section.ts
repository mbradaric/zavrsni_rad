import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hero-section',
  imports: [MatIconModule, FormsModule],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.scss',
})
export class HeroSection {
  searchTerm = '';

  constructor(private router: Router) {}

  onSearch(): void {
    const keyword = this.searchTerm.trim();
    if (!keyword) {
      this.router.navigate(['/articles']);
      return;
    }

    this.router.navigate(['/articles'], {
      queryParams: { search: keyword },
    });
  }
}
