import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserMovie {
  id?: string;
  userId?: string;
  tmdbId: number;
  status: 'Plan to Watch' | 'Watching' | 'Watched';
  rating?: number;
  review?: string;
  favorite?: boolean;
  collection?: string;
  watchedDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MovieResponse {
  success: boolean;
  message?: string;
  data?: UserMovie;
}

export interface MovieListResponse {
  success: boolean;
  data: UserMovie[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private readonly apiUrl = 'http://localhost:5000/api/movies';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  saveMovie(
    tmdbId: number,
    status: 'Plan to Watch' | 'Watching' | 'Watched',
    favorite: boolean = false,
    collection: string = ''
  ): Observable<MovieResponse> {
    const body = { tmdbId, status, favorite, collection };
    return this.http.post<MovieResponse>(this.apiUrl, body, { headers: this.getHeaders() });
  }

  getMovies(filters?: {
    status?: string;
    favorite?: boolean | string;
    collection?: string;
    page?: number;
    limit?: number;
    sort?: string;
  }): Observable<MovieListResponse> {
    let params = new HttpParams();

    if (filters) {
      Object.keys(filters).forEach((key) => {
        const value = (filters as any)[key];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<MovieListResponse>(this.apiUrl, {
      headers: this.getHeaders(),
      params
    });
  }

  getMovie(tmdbId: number): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(`${this.apiUrl}/${tmdbId}`, {
      headers: this.getHeaders()
    });
  }

  updateMovie(tmdbId: number, updateData: Partial<UserMovie>): Observable<MovieResponse> {
    return this.http.put<MovieResponse>(`${this.apiUrl}/${tmdbId}`, updateData, {
      headers: this.getHeaders()
    });
  }

  deleteMovie(tmdbId: number): Observable<MovieResponse> {
    return this.http.delete<MovieResponse>(`${this.apiUrl}/${tmdbId}`, {
      headers: this.getHeaders()
    });
  }
}
