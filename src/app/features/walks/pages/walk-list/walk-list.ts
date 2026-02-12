import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Store } from '@ngrx/store';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppState } from '../../../../state/app.state';
import { WalkActions } from '../../../../state/walks/walk.actions';
import {
  selectAllWalks,
  selectWalksLoading,
  selectWalksError,
} from '../../../../state/walks/walk.selectors';
import { DogActions } from '../../../../state/dogs/dog.actions';
import { selectDogEntities } from '../../../../state/dogs/dog.selectors';
import { WalkStatus } from '../../../../models/walk.model';
import { ToastService } from '../../../../shared/components/toast/toast.service';

@Component({
  selector: 'app-walk-list',
  standalone: true,
  imports: [RouterLink, DatePipe, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">Walks</h1>
        <a
          routerLink="/walks/new"
          class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
        >
          + Schedule Walk
        </a>
      </div>

      <!-- Search + Filter -->
      <div class="flex gap-4">
        <input
          type="text"
          placeholder="Search by dog name or notes..."
          [ngModel]="searchTerm()"
          (ngModelChange)="searchTerm.set($event)"
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm" />
        <select
          [ngModel]="statusFilter()"
          (ngModelChange)="statusFilter.set($event)"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm">
          <option value="">All Statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <!-- Loading -->
      @if (loading()) {
        <div class="text-center py-12 text-gray-500">Loading walks...</div>
      }

      <!-- Error -->
      @if (error()) {
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {{ error() }}
        </div>
      }

      <!-- Table + Mobile Cards -->
      @if (!loading() && filteredWalks().length > 0) {
        <div class="bg-white shadow-sm rounded-lg border border-gray-200">
          <!-- Desktop table -->
          <table class="min-w-full divide-y divide-gray-200 hidden md:table">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dog</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (walk of paginatedWalks(); track walk.id) {
                <tr class="hover:bg-gray-50 transition">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ getDogName(walk.dogId) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ walk.date | date:'medium' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ walk.duration }} min</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [class]="getStatusClasses(walk.status)">{{ walk.status }}</span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{{ walk.notes || '—' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                    <a [routerLink]="['/walks', walk.id, 'edit']" class="text-indigo-600 hover:text-indigo-700 font-medium">Edit</a>
                    <button (click)="onDelete(walk.id)" class="text-red-600 hover:text-red-700 font-medium">Delete</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>

          <!-- Mobile cards -->
          <div class="md:hidden divide-y divide-gray-200">
            @for (walk of paginatedWalks(); track walk.id) {
              <div class="p-4 space-y-2">
                <div class="flex justify-between items-start">
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ getDogName(walk.dogId) }}</p>
                    <p class="text-xs text-gray-500 mt-1">{{ walk.date | date:'medium' }} · {{ walk.duration }} min</p>
                  </div>
                  <div class="flex space-x-3">
                    <a [routerLink]="['/walks', walk.id, 'edit']" class="text-xs text-indigo-600 font-medium">Edit</a>
                    <button (click)="onDelete(walk.id)" class="text-xs text-red-600 font-medium">Delete</button>
                  </div>
                </div>
                <div class="flex justify-between items-center">
                  <span [class]="getStatusClasses(walk.status)">{{ walk.status }}</span>
                  <span class="text-xs text-gray-400">{{ walk.notes || '—' }}</span>
                </div>
              </div>
            }
          </div>

          <!-- Pagination -->
          <div class="bg-gray-50 px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 gap-2">
            <div class="text-sm text-gray-500">
              Showing {{ startIndex() + 1 }}–{{ endIndex() }} of {{ filteredWalks().length }} walks
            </div>
            <div class="flex items-center space-x-2">
              <button
                (click)="currentPage.set(currentPage() - 1)"
                [disabled]="currentPage() === 1"
                class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              @for (page of pages(); track page) {
                <button
                  (click)="currentPage.set(page)"
                  [class]="page === currentPage()
                    ? 'px-3 py-1 text-sm border border-indigo-600 bg-indigo-600 text-white rounded-md'
                    : 'px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition'">
                  {{ page }}
                </button>
              }
              <button
                (click)="currentPage.set(currentPage() + 1)"
                [disabled]="currentPage() === totalPages()"
                class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed">
                Next
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Empty state -->
      @if (!loading() && filteredWalks().length === 0) {
        <div class="text-center py-12">
          <p class="text-gray-500 mb-4">
            @if (searchTerm() || statusFilter()) {
              No walks match your filters.
            } @else {
              No walks scheduled yet.
            }
          </p>
          @if (!searchTerm() && !statusFilter()) {
            <a routerLink="/walks/new" class="text-indigo-600 hover:text-indigo-700 font-medium">
              Schedule your first walk
            </a>
          }
        </div>
      }
    </div>
  `,
})
export class WalkListComponent implements OnInit {
  private store = inject(Store<AppState>);
  private toast = inject(ToastService);

  walks = this.store.selectSignal(selectAllWalks);
  loading = this.store.selectSignal(selectWalksLoading);
  error = this.store.selectSignal(selectWalksError);
  dogEntities = this.store.selectSignal(selectDogEntities);

  searchTerm = signal('');
  statusFilter = signal<WalkStatus | ''>('');
  currentPage = signal(1);
  pageSize = signal(5);

  filteredWalks = computed(() => {
    let walks = this.walks();
    const term = this.searchTerm().toLowerCase().trim();
    const status = this.statusFilter();

    if (status) {
      walks = walks.filter((w) => w.status === status);
    }

    if (term) {
      walks = walks.filter(
        (walk) =>
          this.getDogName(walk.dogId).toLowerCase().includes(term) ||
          walk.notes.toLowerCase().includes(term),
      );
    }

    return walks;
  });

  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredWalks().length / this.pageSize())),
  );

  pages = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  startIndex = computed(() => (this.currentPage() - 1) * this.pageSize());

  endIndex = computed(() =>
    Math.min(this.startIndex() + this.pageSize(), this.filteredWalks().length),
  );

  paginatedWalks = computed(() => {
    if (this.currentPage() > this.totalPages()) {
      this.currentPage.set(1);
    }
    return this.filteredWalks().slice(this.startIndex(), this.endIndex());
  });

  ngOnInit(): void {
    this.store.dispatch(WalkActions.loadWalks());
    this.store.dispatch(DogActions.loadDogs());
  }

  getDogName(dogId: string): string {
    const dog = this.dogEntities()[dogId];
    return dog ? dog.name : 'Unknown';
  }

  getStatusClasses(status: WalkStatus): string {
    const base = 'px-2 py-1 text-xs font-medium rounded-full';
    switch (status) {
      case 'scheduled':
        return `${base} bg-blue-100 text-blue-800`;
      case 'in-progress':
        return `${base} bg-yellow-100 text-yellow-800`;
      case 'completed':
        return `${base} bg-green-100 text-green-800`;
      case 'cancelled':
        return `${base} bg-red-100 text-red-800`;
    }
  }

  onDelete(id: string): void {
    this.toast.confirm('Are you sure you want to delete this walk?', () => {
      this.store.dispatch(WalkActions.deleteWalk({ id }));
      this.toast.show('Walk deleted successfully', 'success');
    });
  }
}
