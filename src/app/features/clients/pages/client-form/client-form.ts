import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../state/app.state';
import { ClientActions } from '../../../../state/clients/client.actions';
import { selectClientById } from '../../../../state/clients/client.selectors';
import { formatDate } from '@angular/common';
import { ToastService } from '../../../../shared/components/toast/toast.service';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">
          {{ isEditMode() ? 'Edit Client' : 'Add Client' }}
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          {{ isEditMode() ? 'Update client information.' : 'Register a new client.' }}
        </p>
      </div>

      <!-- Form -->
      <form
        [formGroup]="form"
        (ngSubmit)="onSubmit()"
        class="bg-white shadow-sm rounded-lg border border-gray-200 p-6 space-y-5"
      >
        <!-- First Name + Last Name -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              id="firstName"
              formControlName="firstName"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              [class.border-red-500]="showError('firstName')"
            />
            @if (showError('firstName')) {
              <p class="text-red-500 text-xs mt-1">First name is required.</p>
            }
          </div>

          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              id="lastName"
              formControlName="lastName"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              [class.border-red-500]="showError('lastName')"
            />
            @if (showError('lastName')) {
              <p class="text-red-500 text-xs mt-1">Last name is required.</p>
            }
          </div>
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1"> Email </label>
          <input
            id="email"
            formControlName="email"
            type="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            [class.border-red-500]="showError('email')"
          />
          @if (showError('email')) {
            <p class="text-red-500 text-xs mt-1">
              @if (form.get('email')?.errors?.['required']) {
                Email is required.
              } @else {
                Enter a valid email address.
              }
            </p>
          }
        </div>

        <!-- Phone -->
        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700 mb-1"> Phone </label>
          <input
            id="phone"
            formControlName="phone"
            type="tel"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            [class.border-red-500]="showError('phone')"
            (input)="onPhoneInput($event)"
          />
          @if (showError('phone')) {
            <p class="text-red-500 text-xs mt-1">
              @if (form.get('phone')?.errors?.['required']) {
                Phone number is required.
              } @else {
                Enter at least 7 digit phone number (digits only).
              }
            </p>
          }
        </div>

        <!-- Address -->
        <div>
          <label for="address" class="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            id="address"
            formControlName="address"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            [class.border-red-500]="showError('address')"
          />
          @if (showError('address')) {
            <p class="text-red-500 text-xs mt-1">Address is required.</p>
          }
        </div>
        @if (isEditMode()) {
          <div>
            <label for="createdAt" class="block text-sm font-medium text-gray-700 mb-1">
              Client Since
            </label>
            <input
              id="createdAt"
              formControlName="createdAt"
              type="text"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500"
            />
          </div>
        }

        <!-- Actions -->
        <div class="flex justify-between items-center pt-4 border-t border-gray-200">
          <a routerLink="/clients" class="text-sm text-gray-600 hover:text-gray-800 font-medium">
            Cancel
          </a>
          <div class="flex space-x-3">
            <button
              type="button"
              (click)="onReset()"
              class="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Reset
            </button>
            <button
              type="submit"
              [disabled]="form.invalid"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isEditMode() ? 'Update Client' : 'Add Client' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  `,
})
export class ClientFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store<AppState>);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);

  isEditMode = signal(false);
  private clientId: string | null = null;

  form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\d{3}-\d{4,7}$/)]],
    address: ['', Validators.required],
    createdAt: [{ value: '', disabled: true }],
  });

  ngOnInit(): void {
    this.clientId = this.route.snapshot.paramMap.get('id');

    if (this.clientId) {
      this.isEditMode.set(true);
      this.store.select(selectClientById(this.clientId)).subscribe((client) => {
        if (client) {
          this.form.patchValue({
            firstName: client.firstName,
            lastName: client.lastName,
            email: client.email,
            phone: client.phone,
            address: client.address,
            createdAt: formatDate(client.createdAt, 'mediumDate', 'en-US'),
          });
        }
      });
    }
  }

  showError(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && (control?.dirty || control?.touched));
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();

    if (this.isEditMode() && this.clientId) {
      this.store.dispatch(
        ClientActions.updateClient({
          client: {
            ...formValue,
            id: this.clientId,
          },
        }),
      );

      this.toast.show('Client updated successfully', 'success');
    } else {
      this.store.dispatch(ClientActions.addClient({ client: formValue }));
      this.toast.show('Client added successfully', 'success');
    }

    this.router.navigate(['/clients']);
  }

  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 10);

    if (digits.length > 3) {
      input.value = digits.slice(0, 3) + '-' + digits.slice(3);
    } else {
      input.value = digits;
    }

    this.form.get('phone')?.setValue(input.value, { emitEvent: false });
  }

  onReset(): void {
    this.form.reset();
  }
}
