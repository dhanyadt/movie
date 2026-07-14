import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = (_route, _state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Synchronous checks: either user is loaded in state or a token is stored in localStorage
  if (authService.isLoggedIn() || !!localStorage.getItem('token')) {
    return true;
  }

  // Redirect to login page
  router.navigate(['/login']);
  return false;
};
