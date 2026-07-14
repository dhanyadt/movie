import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  // Placeholder stats
  stats = {
    totalMovies: 12,
    watchingCount: 2,
    watchedCount: 7,
    planToWatchCount: 3
  };

  // Placeholder lists
  recentMovies = [
    { id: 1, title: 'Inception', status: 'Watched', rating: 5 },
    { id: 2, title: 'Interstellar', status: 'Watching', rating: 4 },
    { id: 3, title: 'The Dark Knight', status: 'Plan to Watch', rating: null }
  ];
}
