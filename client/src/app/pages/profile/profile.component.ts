import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { ToastService } from '../../services/toast/toast.service';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  protected readonly authService = inject(AuthService);
  protected readonly toastService = inject(ToastService);
  private readonly fb = inject(FormBuilder);
  
  profileForm: FormGroup;
  passwordForm: FormGroup;

  // Toggle show/hide password fields
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmNewPassword = false;

  // UI state messages
  profileSuccess: string | null = null;
  profileError: string | null = null;
  passwordSuccess: string | null = null;
  passwordError: string | null = null;

  isUpdatingProfile = false;
  isUpdatingPassword = false;

  constructor() {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.profileForm.patchValue({
        name: user.name,
        email: user.email
      });
    }
  }

  private passwordMatchValidator(form: FormGroup) {
    const newPass = form.get('newPassword')?.value;
    const confirmPass = form.get('confirmNewPassword')?.value;
    if (newPass !== confirmPass) {
      form.get('confirmNewPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSaveProfile(): void {
    if (this.profileForm.invalid) return;

    this.profileSuccess = null;
    this.profileError = null;
    this.isUpdatingProfile = true;

    const { name, email } = this.profileForm.value;
    this.authService.updateProfile(name, email).subscribe({
      next: (res) => {
        this.isUpdatingProfile = false;
        if (res.success) {
          this.profileSuccess = 'Account details updated successfully!';
          this.toastService.showSuccess('Profile updated successfully.');
        } else {
          this.profileError = res.message || 'Failed to update profile';
          this.toastService.showError(res.message || 'Failed to update profile');
        }
      },
      error: (err) => {
        this.isUpdatingProfile = false;
        this.profileError = err.message || 'An error occurred while updating profile';
        this.toastService.showError(err.message || 'Failed to update profile');
      }
    });
  }

  onUpdatePassword(): void {
    if (this.passwordForm.invalid) return;

    this.passwordSuccess = null;
    this.passwordError = null;
    this.isUpdatingPassword = true;

    const { currentPassword, newPassword } = this.passwordForm.value;
    this.authService.updatePassword(currentPassword, newPassword).subscribe({
      next: (res) => {
        this.isUpdatingPassword = false;
        if (res.success) {
          this.passwordSuccess = 'Password changed successfully!';
          this.toastService.showSuccess('Password updated successfully.');
          this.passwordForm.reset();
        } else {
          this.passwordError = res.message || 'Failed to update password';
          this.toastService.showError(res.message || 'Failed to update password');
        }
      },
      error: (err) => {
        this.isUpdatingPassword = false;
        this.passwordError = err.message || 'An error occurred while updating password';
        this.toastService.showError(err.message || 'Failed to update password');
      }
    });
  }

  getInitials(): string {
    const user = this.authService.currentUser();
    if (!user || !user.name) return 'U';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  getMemberSinceYear(): string {
    const user = this.authService.currentUser();
    if (!user) return 'July 2026';
    try {
      const dateStr = (user as any).createdAt;
      if (!dateStr) return 'July 2026';
      return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    } catch {
      return 'July 2026';
    }
  }
}
