import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, catchError, throwError, of } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  favoriteGenres?: string[];
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:5000/api/auth';
  
  // Reactive signals for modern state management
  readonly currentUser = signal<User | null>(null);
  readonly isLoggedIn = computed(() => !!this.currentUser());

  constructor(private http: HttpClient) {
    // Attempt profile restore on initialization if token exists
    this.restoreSession();
  }

  private restoreSession(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.getMe().subscribe({
        next: (response) => {
          if (response.success && response.user) {
            this.currentUser.set(response.user);
          } else {
            this.logout();
          }
        },
        error: () => {
          this.logout();
        }
      });
    }
  }

  register(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { name, email, password }).pipe(
      tap((response) => {
        console.log('Register successful:', response.message);
      }),
      catchError(this.handleError)
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => {
        if (response.success && response.token && response.user) {
          localStorage.setItem('token', response.token);
          this.currentUser.set(response.user);
        }
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUser.set(null);
  }

  getMe(): Observable<AuthResponse> {
    const token = localStorage.getItem('token');
    if (!token) {
      return of({ success: false, message: 'No token found' });
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<AuthResponse>(`${this.apiUrl}/me`, { headers }).pipe(
      tap((response) => {
        if (response.success && response.user) {
          this.currentUser.set(response.user);
        }
      }),
      catchError(this.handleError)
    );
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  private handleError(error: any) {
    let errorMessage = 'An unknown error occurred';
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    return throwError(() => new Error(errorMessage));
  }
}
