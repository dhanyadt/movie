import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  private counter = 0;

  showSuccess(message: string): void {
    this.addToast(message, 'success');
  }

  showError(message: string): void {
    this.addToast(message, 'error');
  }

  private addToast(message: string, type: 'success' | 'error'): void {
    const id = ++this.counter;
    this.toasts.update(current => [...current, { id, message, type }]);

    // Auto-remove after 3.5 seconds
    setTimeout(() => {
      this.removeToast(id);
    }, 3500);
  }

  removeToast(id: number): void {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }
}
