import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'confirm';
  onConfirm?: () => void;
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

  confirm(message: string, onConfirm: () => void): void {
    const id = this.nextId++;
    this.toasts.update((t) => [...t, { id, message, type: 'confirm', onConfirm }]);
  }

  dismiss(id: number): void {
    this.toasts.update((t) => t.filter((toast) => toast.id !== id));
  }

  accept(toast: Toast): void {
    toast.onConfirm?.();
    this.dismiss(toast.id);
  }
}
