import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { VaultComponent } from './pages/vault/vault.component';
import { MoviesComponent } from './pages/movies/movies.component';
import { MovieDetailsComponent } from './pages/movie-details/movie-details.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'vault', component: VaultComponent, canActivate: [authGuard] },
  { path: 'discover', component: MoviesComponent, canActivate: [authGuard] },
  { path: 'discover/:id', component: MovieDetailsComponent, canActivate: [authGuard] },
  { path: 'movies', redirectTo: 'discover', pathMatch: 'full' },
  { path: 'movies/:id', redirectTo: 'discover/:id', pathMatch: 'full' },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: '**', component: NotFoundComponent }
];

