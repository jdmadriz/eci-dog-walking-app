import { Component, inject, OnInit, signal } from '@angular/core';
  import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
  import { ActivatedRoute, Router, RouterLink } from '@angular/router';
  import { Store } from '@ngrx/store';
  import { formatDate } from '@angular/common';
  import { AppState } from '../../../../state/app.state';
  import { DogActions } from '../../../../state/dogs/dog.actions';
  import { selectDogById } from '../../../../state/dogs/dog.selectors';
  import { selectAllClients } from '../../../../state/clients/client.selectors';
  import { ClientActions } from '../../../../state/clients/client.actions';
  import { ToastService } from '../../../../shared/components/toast/toast.service';

  @Component({
    selector: 'app-dog-form',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink],
    template: `
      <div class="max-w-2xl mx-auto">
        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-gray-900">
            {{ isEditMode() ? 'Edit Dog' : 'Add Dog' }}
          </h1>
          <p class="text-sm text-gray-500 mt-1">
            {{ isEditMode() ? 'Update dog information.' : 'Register a new dog.' }}
          </p>
        </div>

        <!-- Form -->
        <form
          [formGroup]="form"
          (ngSubmit)="onSubmit()"
          class="bg-white shadow-sm rounded-lg border border-gray-200 p-6 space-y-5"
        >
          <!-- Name + Breed -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                id="name"
                formControlName="name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                [class.border-red-500]="showError('name')"
              />
              @if (showError('name')) {
                <p class="text-red-500 text-xs mt-1">Dog name is required.</p>
              }
            </div>

            <div>
              <label for="breed" class="block text-sm font-medium text-gray-700 mb-1">
                Breed
              </label>
              <input
                id="breed"
                formControlName="breed"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                [class.border-red-500]="showError('breed')"
              />
              @if (showError('breed')) {
                <p class="text-red-500 text-xs mt-1">Breed is required.</p>
              }
            </div>
          </div>

          <!-- Age + Weight -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="age" class="block text-sm font-medium text-gray-700 mb-1">
                Age (years)
              </label>
              <input
                id="age"
                formControlName="age"
                type="number"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                [class.border-red-500]="showError('age')"
              />
              @if (showError('age')) {
                <p class="text-red-500 text-xs mt-1">
                  @if (form.get('age')?.errors?.['required']) {
                    Age is required.
                  } @else {
                    Age must be 0 or greater.
                  }
                </p>
              }
            </div>

            <div>
              <label for="weight" class="block text-sm font-medium text-gray-700 mb-1">
                Weight (lbs)
              </label>
              <input
                id="weight"
                formControlName="weight"
                type="number"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                [class.border-red-500]="showError('weight')"
              />
              @if (showError('weight')) {
                <p class="text-red-500 text-xs mt-1">
                  @if (form.get('weight')?.errors?.['required']) {
                    Weight is required.
                  } @else {
                    Weight must be greater than 0.
                  }
                </p>
              }
            </div>
          </div>

          <!-- Owner -->
          <div>
            <label for="clientId" class="block text-sm font-medium text-gray-700 mb-1">
              Owner
            </label>
            <select
              id="clientId"
              formControlName="clientId"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              [class.border-red-500]="showError('clientId')">
              <option value="" disabled>Select an owner</option>
              @for (client of clients(); track client.id) {
                <option [value]="client.id">
                  {{ client.firstName }} {{ client.lastName }}
                </option>
              }
            </select>
            @if (showError('clientId')) {
              <p class="text-red-500 text-xs mt-1">Owner is required.</p>
            }
          </div>

          <!-- Notes -->
          <div>
            <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              formControlName="notes"
              rows="3"
              placeholder="Special needs, temperament, etc."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none">
            </textarea>
          </div>

          <!-- Created At (edit mode only) -->
          @if (isEditMode()) {
            <div>
              <label for="createdAt" class="block text-sm font-medium text-gray-700 mb-1">
                Registered Since
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
            <a routerLink="/dogs" class="text-sm text-gray-600 hover:text-gray-800 font-medium">
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
                class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                {{ isEditMode() ? 'Update Dog' : 'Add Dog' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    `,
  })
    
  export class DogFormComponent implements OnInit {
    private fb = inject(FormBuilder);
    private store = inject(Store<AppState>);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private toast = inject(ToastService);

    isEditMode = signal(false);
    private dogId: string | null = null;

    clients = this.store.selectSignal(selectAllClients);

    form = this.fb.nonNullable.group({
      name: ['', Validators.required],
      breed: ['', Validators.required],
      age: [0, [Validators.required, Validators.min(0)]],
      weight: [0, [Validators.required, Validators.min(1)]],
      clientId: ['', Validators.required],
      notes: [''],
      createdAt: [{ value: '', disabled: true }],
    });

    ngOnInit(): void {
      this.store.dispatch(ClientActions.loadClients());
      this.store.dispatch(DogActions.loadDogs()); 
      this.dogId = this.route.snapshot.paramMap.get('id');

      if (this.dogId) {
        this.isEditMode.set(true);
        this.store.select(selectDogById(this.dogId)).subscribe((dog) => {
          if (dog) {
            this.form.patchValue({
              name: dog.name,
              breed: dog.breed,
              age: dog.age,
              weight: dog.weight,
              clientId: dog.clientId,
              notes: dog.notes,
              createdAt: formatDate(dog.createdAt, 'mediumDate', 'en-US'),
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

      if (this.isEditMode() && this.dogId) {
        this.store.dispatch(
          DogActions.updateDog({
            dog: {
              ...formValue,
              id: this.dogId,
            } as any,
          }),
        );
        this.toast.show('Dog updated successfully', 'success');
      } else {
        this.store.dispatch(DogActions.addDog({ dog: formValue }));
        this.toast.show('Dog added successfully', 'success');
      }

      this.router.navigate(['/dogs']);
    }

    onReset(): void {
      this.form.reset();
    }
  }