import { Component, inject, OnInit, signal } from '@angular/core';
  import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
  import { ActivatedRoute, Router, RouterLink } from '@angular/router';
  import { Store } from '@ngrx/store';
  import { formatDate } from '@angular/common';
  import { AppState } from '../../../../state/app.state';
  import { WalkActions } from '../../../../state/walks/walk.actions';
  import { selectWalkById } from '../../../../state/walks/walk.selectors';
  import { selectAllDogs } from '../../../../state/dogs/dog.selectors';
  import { DogActions } from '../../../../state/dogs/dog.actions';
  import { ToastService } from '../../../../shared/components/toast/toast.service';
import { WalkStatus } from '../../../../models/walk.model';

  @Component({
    selector: 'app-walk-form',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink],
    template: `
      <div class="max-w-2xl mx-auto">
        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-gray-900">
            {{ isEditMode() ? 'Edit Walk' : 'Schedule Walk' }}
          </h1>
          <p class="text-sm text-gray-500 mt-1">
            {{ isEditMode() ? 'Update walk details.' : 'Schedule a new walk.' }}
          </p>
        </div>

        <!-- Form -->
        <form
          [formGroup]="form"
          (ngSubmit)="onSubmit()"
          class="bg-white shadow-sm rounded-lg border border-gray-200 p-6 space-y-5"
        >
          <!-- Dog -->
          <div>
            <label for="dogId" class="block text-sm font-medium text-gray-700 mb-1">
              Dog
            </label>
            <select
              id="dogId"
              formControlName="dogId"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none
   transition"
              [class.border-red-500]="showError('dogId')"
            >
              <option value="" disabled>Select a dog</option>
              @for (dog of dogs(); track dog.id) {
                <option [value]="dog.id">{{ dog.name }} ({{ dog.breed }})</option>
              }
            </select>
            @if (showError('dogId')) {
              <p class="text-red-500 text-xs mt-1">Dog is required.</p>
            }
          </div>

          <!-- Date + Duration -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="date" class="block text-sm font-medium text-gray-700 mb-1">
                Date & Time
              </label>
              <input
                id="date"
                formControlName="date"
                type="datetime-local"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
  outline-none transition"
                [class.border-red-500]="showError('date')"
              />
              @if (showError('date')) {
                <p class="text-red-500 text-xs mt-1">Date is required.</p>
              }
            </div>

            <div>
              <label for="duration" class="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <input
                id="duration"
                formControlName="duration"
                type="number"
                min="5"
                step="5"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
  outline-none transition"
                [class.border-red-500]="showError('duration')"
              />
              @if (showError('duration')) {
                <p class="text-red-500 text-xs mt-1">
                  @if (form.get('duration')?.errors?.['required']) {
                    Duration is required.
                  } @else {
                    Minimum 5 minutes.
                  }
                </p>
              }
            </div>
          </div>

          <!-- Status -->
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              formControlName="status"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none
   transition"
            >
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
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
              placeholder="Walk details, observations, etc."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none
   transition resize-none"
            ></textarea>
          </div>

          <!-- Created At (edit mode only) -->
          @if (isEditMode()) {
            <div>
              <label for="createdAt" class="block text-sm font-medium text-gray-700 mb-1">
                Scheduled Since
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
            <a routerLink="/walks" class="text-sm text-gray-600 hover:text-gray-800 font-medium">
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
                class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50
  disabled:cursor-not-allowed"
              >
                {{ isEditMode() ? 'Update Walk' : 'Schedule Walk' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    `,
  })
  export class WalkFormComponent implements OnInit {
    private fb = inject(FormBuilder);
    private store = inject(Store<AppState>);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private toast = inject(ToastService);

    isEditMode = signal(false);
    private walkId: string | null = null;

    dogs = this.store.selectSignal(selectAllDogs);

    form = this.fb.nonNullable.group({
      dogId: ['', Validators.required],
      date: ['', Validators.required],
      duration: [30, [Validators.required, Validators.min(5)]],
      status: ['scheduled'],
      notes: [''],
      createdAt: [{ value: '', disabled: true }],
    });

    ngOnInit(): void {
      this.store.dispatch(DogActions.loadDogs());
      this.walkId = this.route.snapshot.paramMap.get('id');

      if (this.walkId) {
        this.isEditMode.set(true);
        this.store.select(selectWalkById(this.walkId)).subscribe((walk) => {
          if (walk) {
            this.form.patchValue({
              dogId: walk.dogId,
              date: this.toDatetimeLocal(walk.date),
              duration: walk.duration,
              status: walk.status,
              notes: walk.notes,
              createdAt: formatDate(walk.createdAt, 'mediumDate', 'en-US'),
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
      const walkData = {
        ...formValue,
        date: new Date(formValue.date).toISOString(),
        status: formValue.status as WalkStatus,
      };

      if (this.isEditMode() && this.walkId) {
        this.store.dispatch(
          WalkActions.updateWalk({
            walk: { ...walkData, id: this.walkId } as any,
          }),
        );
        this.toast.show('Walk updated successfully', 'success');
      } else {
        this.store.dispatch(WalkActions.createWalk({ walk: walkData }));
        this.toast.show('Walk scheduled successfully', 'success');
      }

      this.router.navigate(['/walks']);
    }

    onReset(): void {
      this.form.reset({ status: 'scheduled', duration: 30 });
    }

    private toDatetimeLocal(isoDate: string): string {
      const date = new Date(isoDate);
      return date.toISOString().slice(0, 16);
    }
  }