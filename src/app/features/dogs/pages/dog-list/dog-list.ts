import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Store } from '@ngrx/store';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppState } from '../../../../state/app.state';
import { DogActions } from '../../../../state/dogs/dog.actions';
import {
  selectAllDogs,
  selectDogsLoading,
  selectDogsError,
} from '../../../../state/dogs/dog.selectors';
import { ClientActions } from '../../../../state/clients/client.actions';
import { selectClientEntities } from '../../../../state/clients/client.selectors';
import { ToastService } from '../../../../shared/components/toast/toast.service';

@Component({
  selector: 'app-dog-list',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="max-w-5xl mx-auto space-y-6 mt-8">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">Dogs</h1>
        <a
          routerLink="/dogs/new"
          class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
        >
          + Add Dog
        </a>
      </div>

      <!-- Search -->
      <div>
        <input
          type="text"
          placeholder="Search by name, breed, or owner..."
          [ngModel]="searchTerm()"
          (ngModelChange)="searchTerm.set($event)"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none
  transition text-sm"
        />
      </div>

      <!-- Loading -->
      @if (loading()) {
        <div class="text-center py-12 text-gray-500">Loading dogs...</div>
      }

      <!-- Error -->
      @if (error()) {
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {{ error() }}
        </div>
      }

      <!-- Table -->
      @if (!loading() && filteredDogs().length > 0) {
        <div class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Breed
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Age
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Weight
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Owner
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Notes
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (dog of paginatedDogs(); track dog.id) {
                <tr class="hover:bg-gray-50 transition">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ dog.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ dog.breed }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ dog.age }} yrs
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ dog.weight }} lbs
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ getOwnerName(dog.clientId) }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {{ dog.notes || '—' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                    <a
                      [routerLink]="['/dogs', dog.id, 'edit']"
                      class="text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Edit
                    </a>
                    <button
                      (click)="onDelete(dog.id)"
                      class="text-red-600 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>

          <!-- Pagination -->
          <div
            class="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200"
          >
            <div class="text-sm text-gray-500">
              Showing {{ startIndex() + 1 }}–{{ endIndex() }} of {{ filteredDogs().length }} dogs
            </div>
            <div class="flex items-center space-x-2">
              <button
                (click)="currentPage.set(currentPage() - 1)"
                [disabled]="currentPage() === 1"
                class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition disabled:opacity-50
  disabled:cursor-not-allowed"
              >
                Previous
              </button>
              @for (page of pages(); track page) {
                <button
                  (click)="currentPage.set(page)"
                  [class]="
                    page === currentPage()
                      ? 'px-3 py-1 text-sm border border-indigo-600 bg-indigo-600 text-white rounded-md'
                      : 'px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition'
                  "
                >
                  {{ page }}
                </button>
              }
              <button
                (click)="currentPage.set(currentPage() + 1)"
                [disabled]="currentPage() === totalPages()"
                class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition disabled:opacity-50
  disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Empty state -->
      @if (!loading() && filteredDogs().length === 0) {
        <div class="text-center py-12">
          <p class="text-gray-500 mb-4">
            @if (searchTerm()) {
              No dogs match "{{ searchTerm() }}"
            } @else {
              No dogs yet.
            }
          </p>
          @if (!searchTerm()) {
            <a routerLink="/dogs/new" class="text-indigo-600 hover:text-indigo-700 font-medium">
              Add your first dog
            </a>
          }
        </div>
      }
    </div>
  `,
})

export class DogListComponent implements OnInit {
  private store = inject(Store<AppState>);
  private toast = inject(ToastService);
  

  dogs = this.store.selectSignal(selectAllDogs);
  loading = this.store.selectSignal(selectDogsLoading);
  error = this.store.selectSignal(selectDogsError);
  clientEntities = this.store.selectSignal(selectClientEntities);

  searchTerm = signal('');
  currentPage = signal(1);
  pageSize = signal(5);

  filteredDogs = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.dogs();

    return this.dogs().filter(
      (dog) =>
        dog.name.toLowerCase().includes(term) ||
        dog.breed.toLowerCase().includes(term) ||
        this.getOwnerName(dog.clientId).toLowerCase().includes(term),
    );
  });

  totalPages = computed(() => Math.max(1, Math.ceil(this.filteredDogs().length / this.pageSize())));

  pages = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  startIndex = computed(() => (this.currentPage() - 1) * this.pageSize());

  endIndex = computed(() =>
    Math.min(this.startIndex() + this.pageSize(), this.filteredDogs().length),
  );

  paginatedDogs = computed(() => {
    if (this.currentPage() > this.totalPages()) {
      this.currentPage.set(1);
    }
    return this.filteredDogs().slice(this.startIndex(), this.endIndex());
  });

  ngOnInit(): void {
    this.store.dispatch(DogActions.loadDogs());
    this.store.dispatch(ClientActions.loadClients());
  }

  getOwnerName(clientId: string): string {
    const client = this.clientEntities()[clientId];
    return client ? `${client.firstName} ${client.lastName}` : 'Unknown';
  }

  onDelete(id: string): void {
    if (confirm('Are you sure you want to delete this dog?')) {
      this.store.dispatch(DogActions.deleteDog({ id }));
      this.toast.show('Dog deleted successfully', 'success');
    }
  }
}
