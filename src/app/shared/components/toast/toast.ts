import { Component, inject } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-2">
      @for (toast of toastService.toasts(); track toast.id) {
        @if (toast.type === 'confirm') {
          <div class="bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-4 min-w-[300px] animate-slide-in">
            <p class="text-sm text-gray-800 mb-3">{{ toast.message }}</p>
            <div class="flex justify-end space-x-2">
              <button
                (click)="toastService.dismiss(toast.id)"
                class="px-3 py-1 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition">
                Cancel
              </button>
              <button
                (click)="toastService.accept(toast)"
                class="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition">
                Delete
              </button>
            </div>
          </div>
        } @else {
          <div
            class="flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium min-w-[280px] animate-slide-in"
            [class]="toast.type === 'success'
              ? 'bg-green-600 text-white'
              : 'bg-red-600 text-white'">
            <span class="flex-1">{{ toast.message }}</span>
            <button (click)="toastService.dismiss(toast.id)"
                    class="text-white/80 hover:text-white text-lg leading-none">
              &times;
            </button>
          </div>
        }
      }
    </div>
  `,
})
export class ToastComponent {
  toastService = inject(ToastService);
}
