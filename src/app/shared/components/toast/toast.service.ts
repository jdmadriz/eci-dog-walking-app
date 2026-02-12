import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 0;
  toasts = signal<Toast[]>([]);

  show(message: string, type: 'success' | 'error' = 'success'): void {
    const id = this.nextId++;
    this.toasts.update((t) => [...t, { id, message, type }]);

    setTimeout(() => this.dismiss(id), 3000);
  }

  dismiss(id: number): void {
    this.toasts.update((t) => t.filter((toast) => toast.id !== id));
  }
}
