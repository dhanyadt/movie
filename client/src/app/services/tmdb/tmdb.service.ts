import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TMDbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids?: number[];
}

export interface TMDbMovieDetail extends TMDbMovie {
  tagline: string | null;
  genres: { id: number; name: string }[];
  runtime: number | null;
  status: string;
}

export interface TMDbListResponse {
  success: boolean;
  data: TMDbMovie[];
}

export interface TMDbDetailResponse {
  success: boolean;
  data: TMDbMovieDetail;
}

@Injectable({
  providedIn: 'root'
})
export class TMDbService {
  private readonly apiUrl = 'http://localhost:5000/api/tmdb';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getTrending(): Observable<TMDbListResponse> {
    return this.http.get<TMDbListResponse>(`${this.apiUrl}/trending`, { headers: this.getHeaders() });
  }

  getPopular(): Observable<TMDbListResponse> {
    return this.http.get<TMDbListResponse>(`${this.apiUrl}/popular`, { headers: this.getHeaders() });
  }

  getTopRated(): Observable<TMDbListResponse> {
    return this.http.get<TMDbListResponse>(`${this.apiUrl}/top-rated`, { headers: this.getHeaders() });
  }

  getUpcoming(): Observable<TMDbListResponse> {
    return this.http.get<TMDbListResponse>(`${this.apiUrl}/upcoming`, { headers: this.getHeaders() });
  }

  searchMovies(query: string): Observable<TMDbListResponse> {
    return this.http.get<TMDbListResponse>(`${this.apiUrl}/search`, {
      headers: this.getHeaders(),
      params: { q: query }
    });
  }

  getMovieDetails(id: number): Observable<TMDbDetailResponse> {
    return this.http.get<TMDbDetailResponse>(`${this.apiUrl}/movie/${id}`, { headers: this.getHeaders() });
  }
}
