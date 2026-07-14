import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

interface MovieDetail {
  id: number;
  title: string;
  releaseYear: number;
  rating: number;
  genre: string;
  description: string;
  runtime: string;
  director: string;
  cast: string[];
}

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css'
})
export class MovieDetailsComponent implements OnInit {
  movieId!: number;
  movie: MovieDetail | null = null;

  // Mock database
  moviesDb: MovieDetail[] = [
    {
      id: 1,
      title: 'Inception',
      releaseYear: 2010,
      rating: 8.8,
      genre: 'Sci-Fi / Thriller',
      description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project.',
      runtime: '2h 28m',
      director: 'Christopher Nolan',
      cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page', 'Tom Hardy']
    },
    {
      id: 2,
      title: 'Interstellar',
      releaseYear: 2014,
      rating: 8.6,
      genre: 'Sci-Fi / Adventure / Drama',
      description: 'When Earth becomes uninhabitable, a team of explorers travels through a wormhole in space in an attempt to ensure humanity\'s survival.',
      runtime: '2h 49m',
      director: 'Christopher Nolan',
      cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Mackenzie Foy']
    },
    {
      id: 3,
      title: 'The Dark Knight',
      releaseYear: 2008,
      rating: 9.0,
      genre: 'Action / Crime / Drama',
      description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
      runtime: '2h 32m',
      director: 'Christopher Nolan',
      cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Maggie Gyllenhaal']
    }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');
      if (idStr) {
        this.movieId = parseInt(idStr, 10);
        this.movie = this.moviesDb.find(m => m.id === this.movieId) || null;
      }
    });
  }
}
