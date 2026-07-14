import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.css'
})
export class MoviesComponent {
  searchQuery: string = '';

  // Mock list of popular movies for layout check
  movies = [
    { id: 1, title: 'Inception', releaseYear: 2010, rating: 8.8, genre: 'Sci-Fi' },
    { id: 2, title: 'Interstellar', releaseYear: 2014, rating: 8.6, genre: 'Sci-Fi' },
    { id: 3, title: 'The Dark Knight', releaseYear: 2008, rating: 9.0, genre: 'Action' },
    { id: 4, title: 'Pulp Fiction', releaseYear: 1994, rating: 8.9, genre: 'Crime' },
    { id: 5, title: 'The Matrix', releaseYear: 1999, rating: 8.7, genre: 'Sci-Fi' },
    { id: 6, title: 'Fight Club', releaseYear: 1999, rating: 8.8, genre: 'Drama' }
  ];

  filteredMovies = [...this.movies];

  onSearch(): void {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      this.filteredMovies = [...this.movies];
    } else {
      this.filteredMovies = this.movies.filter(movie => 
        movie.title.toLowerCase().includes(query) || 
        movie.genre.toLowerCase().includes(query)
      );
    }
  }
}
