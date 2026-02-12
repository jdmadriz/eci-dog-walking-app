import { Component, inject } from '@angular/core';
  import { ToastService } from './toast.service';

  @Component({
    selector: 'app-toast',
    standalone: true,
    template: `
      <div class="fixed top-4 right-4 z-50 space-y-2">
        @for (toast of toastService.toasts(); track toast.id) {
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
      </div>
    `,
  })
  export class ToastComponent {
    toastService = inject(ToastService);
  }