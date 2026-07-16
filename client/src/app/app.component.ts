import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from './services/auth/auth.service';
import { ToastService } from './services/toast/toast.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class App {
  protected readonly title = signal('CineVault');
  protected readonly authService = inject(AuthService);
  protected readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  logout(): void {
    this.authService.logout();
    this.toastService.showSuccess('Successfully logged out.');
    this.router.navigate(['/login']);
  }
}
