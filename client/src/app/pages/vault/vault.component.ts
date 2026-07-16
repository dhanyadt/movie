import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie/movie.service';
import { TMDbService } from '../../services/tmdb/tmdb.service';
import { ToastService } from '../../services/toast/toast.service';
import { forkJoin, map, of, catchError } from 'rxjs';

export interface VaultMovie {
  id: number;
  title: string;
  status: 'Plan to Watch' | 'Watching' | 'Watched';
  favorite: boolean;
  rating?: number | null;
  tmdbRating?: number | null;
  poster_path?: string | null;
  release_date?: string | null;
  createdAt?: string;
}

@Component({
  selector: 'app-vault',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './vault.component.html',
  styleUrl: './vault.component.css'
})
export class VaultComponent implements OnInit {
  private readonly movieService = inject(MovieService);
  private readonly tmdbService = inject(TMDbService);
  private readonly toastService = inject(ToastService);

  stats = {
    totalMovies: 0,
    watchingCount: 0,
    watchedCount: 0,
    planToWatchCount: 0
  };

  allMovies: VaultMovie[] = [];
  filteredMovies: VaultMovie[] = [];
  recentAdditions: VaultMovie[] = [];
  
  isLoading = true;

  // Search/Filter/Sort states
  searchQuery = '';
  activeFilter: 'All' | 'Watching' | 'Watched' | 'Plan to Watch' | 'Favorites' = 'All';
  activeSort: 'Recently Added' | 'Title' | 'Rating' | 'Release Year' = 'Recently Added';

  ngOnInit(): void {
    this.loadVaultData();
  }

  private loadVaultData(): void {
    this.isLoading = true;
    forkJoin({
      statsRes: this.movieService.getStats(),
      libraryRes: this.movieService.getMovies({ limit: 150, sort: '-createdAt' })
    }).subscribe({
      next: ({ statsRes, libraryRes }) => {
        if (statsRes.success) {
          this.stats = statsRes.stats;
        }

        const movies = libraryRes.data || [];
        if (movies.length === 0) {
          this.allMovies = [];
          this.filteredMovies = [];
          this.recentAdditions = [];
          this.isLoading = false;
          return;
        }

        // Fetch TMDb details for all library movies in parallel
        const tmdbCalls = movies.map(m => 
          this.tmdbService.getMovieDetails(m.tmdbId).pipe(
            map(detailRes => ({
              id: m.tmdbId,
              title: detailRes.data?.title || 'Unknown Title',
              status: m.status,
              favorite: m.favorite || false,
              rating: m.rating || null,
              tmdbRating: detailRes.data?.vote_average || null,
              poster_path: detailRes.data?.poster_path || null,
              release_date: detailRes.data?.release_date || null,
              createdAt: m.createdAt
            })),
            catchError(() => of({
              id: m.tmdbId,
              title: `Movie (ID: ${m.tmdbId})`,
              status: m.status,
              favorite: m.favorite || false,
              rating: m.rating || null,
              tmdbRating: null,
              poster_path: null,
              release_date: null,
              createdAt: m.createdAt
            }))
          )
        );

        forkJoin(tmdbCalls).subscribe({
          next: (resolvedMovies) => {
            this.allMovies = resolvedMovies;
            this.recentAdditions = resolvedMovies.slice(0, 6); // Latest 6 movies
            this.applyFiltersAndSort();
            this.isLoading = false;
          },
          error: () => {
            this.isLoading = false;
          }
        });
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  applyFiltersAndSort(): void {
    let result = [...this.allMovies];

    // 1. Filter by Chip
    if (this.activeFilter === 'Favorites') {
      result = result.filter(m => m.favorite);
    } else if (this.activeFilter !== 'All') {
      result = result.filter(m => m.status === this.activeFilter);
    }

    // 2. Search
    if (this.searchQuery && this.searchQuery.trim().length > 0) {
      const query = this.searchQuery.toLowerCase().trim();
      result = result.filter(m => m.title.toLowerCase().includes(query));
    }

    // 3. Sort
    if (this.activeSort === 'Recently Added') {
      result.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    } else if (this.activeSort === 'Title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (this.activeSort === 'Rating') {
      result.sort((a, b) => {
        const ratingA = a.rating || a.tmdbRating || 0;
        const ratingB = b.rating || b.tmdbRating || 0;
        return ratingB - ratingA;
      });
    } else if (this.activeSort === 'Release Year') {
      result.sort((a, b) => {
        const yearA = a.release_date ? new Date(a.release_date).getFullYear() : 0;
        const yearB = b.release_date ? new Date(b.release_date).getFullYear() : 0;
        return yearB - yearA;
      });
    }

    this.filteredMovies = result;
  }

  removeMovie(tmdbId: number, title: string, event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    if (confirm(`Are you sure you want to remove "${title}" from your library?`)) {
      this.movieService.deleteMovie(tmdbId).subscribe({
        next: (res) => {
          if (res.success) {
            this.toastService.showSuccess(`"${title}" was removed from your Vault.`);
            // Update local state
            this.allMovies = this.allMovies.filter(m => m.id !== tmdbId);
            this.recentAdditions = this.recentAdditions.filter(m => m.id !== tmdbId);
            this.applyFiltersAndSort();

            // Refresh stats
            this.movieService.getStats().subscribe(statsRes => {
              if (statsRes.success) this.stats = statsRes.stats;
            });
          } else {
            this.toastService.showError('Failed to remove movie.');
          }
        },
        error: (err) => {
          this.toastService.showError(err.message || 'An error occurred.');
        }
      });
    }
  }

  getPosterUrl(path: string | null | undefined): string {
    if (!path) return 'assets/movie-placeholder.png';
    return `https://image.tmdb.org/t/p/w300${path}`;
  }

  getReleaseYear(dateStr: string | null | undefined): string {
    if (!dateStr) return 'N/A';
    return dateStr.split('-')[0];
  }

  handleImageError(event: Event): void {
    const imgEl = event.target as HTMLImageElement;
    if (imgEl) {
      imgEl.src = 'assets/movie-placeholder.png';
    }
  }
}
