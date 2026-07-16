import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TMDbService, TMDbMovie } from '../../services/tmdb/tmdb.service';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.css'
})
export class MoviesComponent implements OnInit, OnDestroy {
  searchQuery = '';
  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  // Data lists
  trendingMovies: TMDbMovie[] = [];
  popularMovies: TMDbMovie[] = [];
  topRatedMovies: TMDbMovie[] = [];
  upcomingMovies: TMDbMovie[] = [];
  searchResults: TMDbMovie[] = [];

  // Loading States
  isLoadingTrending = false;
  isLoadingPopular = false;
  isLoadingTopRated = false;
  isLoadingUpcoming = false;
  isLoadingSearch = false;

  // Errors
  errorMessage: string | null = null;

  // Static list for skeleton placeholders
  skeletons = [1, 2, 3, 4, 5, 6];

  constructor(private tmdbService: TMDbService) {}

  ngOnInit(): void {
    // Load default sections
    this.loadDefaultSections();

    // Debounce search input by 450ms
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(450),
      distinctUntilChanged()
    ).subscribe(query => {
      this.executeSearch(query);
    });
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchQuery);
  }

  private loadDefaultSections(): void {
    this.errorMessage = null;

    // Load Trending
    this.isLoadingTrending = true;
    this.tmdbService.getTrending().subscribe({
      next: (res) => {
  console.log("TRENDING RESPONSE:", res);
  console.log("TRENDING DATA:", res.data);
  console.log("TRENDING LENGTH:", res.data?.length);

  this.trendingMovies = res.data;
  this.isLoadingTrending = false;

  console.log("Loading:", this.isLoadingTrending);
},
      error: (err) => {
        this.isLoadingTrending = false;
        this.errorMessage = err.message || 'Error loading trending movies';
      }
    });

    // Load Popular
    this.isLoadingPopular = true;
    this.tmdbService.getPopular().subscribe({
      next: (res) => {
        this.popularMovies = res.data;
        this.isLoadingPopular = false;
      },
      error: () => {
        this.isLoadingPopular = false;
      }
    });

    // Load Top Rated
    this.isLoadingTopRated = true;
    this.tmdbService.getTopRated().subscribe({
      next: (res) => {
        this.topRatedMovies = res.data;
        this.isLoadingTopRated = false;
      },
      error: () => {
        this.isLoadingTopRated = false;
      }
    });

    // Load Upcoming
    this.isLoadingUpcoming = true;
    this.tmdbService.getUpcoming().subscribe({
      next: (res) => {
        this.upcomingMovies = res.data;
        this.isLoadingUpcoming = false;
      },
      error: () => {
        this.isLoadingUpcoming = false;
      }
    });
  }

  private executeSearch(query: string): void {
    const trimmed = query.trim();
    if (!trimmed) {
      this.searchResults = [];
      this.isLoadingSearch = false;
      return;
    }

    this.isLoadingSearch = true;
    this.errorMessage = null;

    this.tmdbService.searchMovies(trimmed).subscribe({
      next: (res) => {
        this.searchResults = res.data;
        this.isLoadingSearch = false;
      },
      error: (err) => {
        this.isLoadingSearch = false;
        this.errorMessage = err.message || 'Error executing search';
      }
    });
  }

  // Helpers for templates
  getReleaseYear(dateStr: string | null): string {
    if (!dateStr) return 'N/A';
    return dateStr.split('-')[0];
  }

  getPosterUrl(path: string | null): string {
    if (!path) {
      return 'assets/movie-placeholder.png'; // Fallback path
    }
    return `https://image.tmdb.org/t/p/w500${path}`;
  }

  handleImageError(event: Event): void {
    const imgEl = event.target as HTMLImageElement;
    if (imgEl) {
      imgEl.src = 'assets/movie-placeholder.png';
    }
  }
}
