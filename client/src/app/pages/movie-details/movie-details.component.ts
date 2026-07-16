import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TMDbService, TMDbMovieDetail } from '../../services/tmdb/tmdb.service';
import { MovieService, UserMovie } from '../../services/movie/movie.service';
import { AuthService } from '../../services/auth/auth.service';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css'
})
export class MovieDetailsComponent implements OnInit {
  protected readonly authService = inject(AuthService);
  protected readonly toastService = inject(ToastService);
  movieId!: number;
  movie: TMDbMovieDetail | null = null;
  
  // Library State
  inVault = false;
  vaultMovieStatus: string | null = null;
  vaultMovieFavorite = false;

  // UI States
  isLoading = true;
  isSaving = false;
  showModal = false;
  errorMessage: string | null = null;
  modalErrorMessage: string | null = null;

  // Vault Form
  vaultForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private tmdbService: TMDbService,
    private movieService: MovieService
  ) {
    this.vaultForm = this.fb.group({
      status: ['Plan to Watch', Validators.required],
      favorite: [false],
      collection: ['']
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');
      if (idStr) {
        this.movieId = parseInt(idStr, 10);
        this.loadMovieDetails();
      }
    });
  }

  private loadMovieDetails(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.tmdbService.getMovieDetails(this.movieId).subscribe({
      next: (res) => {
        this.movie = res.data;
        if (this.authService.isLoggedIn()) {
          this.checkLibraryStatus();
        } else {
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Failed to fetch movie details from TMDb.';
      }
    });
  }

  private checkLibraryStatus(): void {
    this.movieService.getMovie(this.movieId).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.data) {
          this.inVault = true;
          this.vaultMovieStatus = res.data.status;
          this.vaultMovieFavorite = res.data.favorite || false;
        } else {
          this.inVault = false;
          this.vaultMovieFavorite = false;
        }
      },
      error: () => {
        this.inVault = false;
        this.vaultMovieFavorite = false;
        this.isLoading = false;
      }
    });
  }

  openVaultModal(): void {
    this.modalErrorMessage = null;
    this.showModal = true;

    if (this.inVault) {
      this.movieService.getMovie(this.movieId).subscribe({
        next: (res) => {
          if (res.success && res.data) {
            this.vaultForm.patchValue({
              status: res.data.status,
              favorite: res.data.favorite || false
            });
          }
        }
      });
    }
  }

  closeVaultModal(): void {
    this.showModal = false;
    this.vaultForm.reset({
      status: 'Plan to Watch',
      favorite: false,
      collection: ''
    });
  }

  saveToVault(): void {
    if (this.vaultForm.valid && this.movie) {
      this.isSaving = true;
      this.modalErrorMessage = null;
      const { status, favorite, collection } = this.vaultForm.value;

      const apiCall = this.inVault 
        ? this.movieService.updateMovie(this.movie.id, { status, favorite, collection })
        : this.movieService.saveMovie(this.movie.id, status, favorite, collection);

      apiCall.subscribe({
        next: (res) => {
          this.isSaving = false;
          if (res.success && res.data) {
            this.toastService.showSuccess(this.inVault ? 'Library status updated.' : 'Movie added to My Vault.');
            this.inVault = true;
            this.vaultMovieStatus = res.data.status;
            this.vaultMovieFavorite = res.data.favorite || false;
            this.closeVaultModal();
          } else {
            this.modalErrorMessage = res.message || 'Failed to save to vault';
          }
        },
        error: (err) => {
          this.isSaving = false;
          this.modalErrorMessage = err.message || 'An error occurred while saving. Please try again.';
        }
      });
    }
  }

  removeFromVault(): void {
    if (this.movie && confirm(`Are you sure you want to remove "${this.movie.title}" from your library?`)) {
      this.isSaving = true;
      this.movieService.deleteMovie(this.movieId).subscribe({
        next: (res) => {
          this.isSaving = false;
          if (res.success) {
            this.inVault = false;
            this.vaultMovieStatus = null;
            this.vaultMovieFavorite = false;
            this.toastService.showSuccess('Movie removed from your Vault.');
          } else {
            this.toastService.showError('Failed to remove movie.');
          }
        },
        error: (err) => {
          this.isSaving = false;
          this.toastService.showError(err.message || 'An error occurred.');
        }
      });
    }
  }

  // Template Helpers
  getBackdropUrl(path: string | null): string {
    if (!path) return '';
    return `https://image.tmdb.org/t/p/original${path}`;
  }

  getPosterUrl(path: string | null): string {
    if (!path) return 'assets/movie-placeholder.png';
    return `https://image.tmdb.org/t/p/w500${path}`;
  }

  handleImageError(event: Event): void {
    const imgEl = event.target as HTMLImageElement;
    if (imgEl) {
      imgEl.src = 'assets/movie-placeholder.png';
    }
  }
}
