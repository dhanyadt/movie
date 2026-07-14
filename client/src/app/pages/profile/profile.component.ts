import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  profileForm: FormGroup;
  isEditing: boolean = false;

  // Mock User
  user = {
    username: 'movie_buff_99',
    email: 'buff@example.com',
    joinedDate: 'July 15, 2026'
  };

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      username: [this.user.username, [Validators.required, Validators.minLength(3)]],
      email: [this.user.email, [Validators.required, Validators.email]]
    });
    this.profileForm.disable();
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.profileForm.enable();
    } else {
      this.profileForm.disable();
      // Revert values
      this.profileForm.patchValue({
        username: this.user.username,
        email: this.user.email
      });
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.user.username = this.profileForm.value.username;
      this.user.email = this.profileForm.value.email;
      console.log('Profile updated:', this.user);
      this.toggleEdit();
    }
  }
}
