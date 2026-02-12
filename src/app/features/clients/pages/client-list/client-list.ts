import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppState } from '../../../../state/app.state';
import { ClientActions } from '../../../../state/clients/client.actions';
import {
  selectAllClients,
  selectClientsLoading,
  selectClientsError,
} from '../../../../state/clients/client.selectors';
import { ToastService } from '../../../../shared/components/toast/toast.service';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [RouterLink, DatePipe, FormsModule],
  template: `
    <div class="max-w-5xl mx-auto space-y-6 mt-8">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">Clients</h1>
        <a
          routerLink="/clients/new"
          class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
        >
          + Add Client
        </a>
      </div>

      <!-- Search -->
      <div>
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          [ngModel]="searchTerm()"
          (ngModelChange)="searchTerm.set($event)"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none
  transition text-sm"
        />
      </div>

      <!-- Loading -->
      @if (loading()) {
        <div class="text-center py-12 text-gray-500">Loading clients...</div>
      }

      <!-- Error -->
      @if (error()) {
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {{ error() }}
        </div>
      }

      <!-- Table -->
      @if (!loading() && filteredClients().length > 0) {
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
                  Email
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Phone
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Client Since
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (client of paginatedClients(); track client.id) {
                <tr class="hover:bg-gray-50 transition">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {{ client.firstName }} {{ client.lastName }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ client.email }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ client.phone }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {{ client.createdAt | date: 'mediumDate' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                    <a
                      [routerLink]="['/clients', client.id, 'edit']"
                      class="text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Edit
                    </a>
                    <button
                      (click)="onDelete(client.id)"
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
              Showing {{ startIndex() + 1 }}–{{ endIndex() }} of
              {{ filteredClients().length }} clients
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
      @if (!loading() && filteredClients().length === 0) {
        <div class="text-center py-12">
          <p class="text-gray-500 mb-4">
            @if (searchTerm()) {
              No clients match "{{ searchTerm() }}"
            } @else {
              No clients yet.
            }
          </p>
          @if (!searchTerm()) {
            <a routerLink="/clients/new" class="text-indigo-600 hover:text-indigo-700 font-medium">
              Add your first client
            </a>
          }
        </div>
      }
    </div>
  `,
})
export class ClientListComponent implements OnInit {
  private store = inject(Store<AppState>);
  private toast = inject(ToastService);

  clients = this.store.selectSignal(selectAllClients);
  loading = this.store.selectSignal(selectClientsLoading);
  error = this.store.selectSignal(selectClientsError);

  searchTerm = signal('');
  currentPage = signal(1);
  pageSize = signal(5);

  // Filter by search
  filteredClients = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.clients();

    return this.clients().filter(
      (client) =>
        client.firstName.toLowerCase().includes(term) ||
        client.lastName.toLowerCase().includes(term) ||
        client.email.toLowerCase().includes(term) ||
        client.phone.includes(term),
    );
  });

  // Pagination calculations
  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredClients().length / this.pageSize())),
  );

  pages = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  startIndex = computed(() => (this.currentPage() - 1) * this.pageSize());

  endIndex = computed(() =>
    Math.min(this.startIndex() + this.pageSize(), this.filteredClients().length),
  );

  // Slice for current page
  paginatedClients = computed(() => {
    // Reset to page 1 when search changes the result count
    if (this.currentPage() > this.totalPages()) {
      this.currentPage.set(1);
    }
    return this.filteredClients().slice(this.startIndex(), this.endIndex());
  });

  ngOnInit(): void {
    this.store.dispatch(ClientActions.loadClients());
  }

  onDelete(id: string): void {
    if (confirm('Are you sure you want to delete this client?')) {
      this.store.dispatch(ClientActions.deleteClient({ id }));
      this.toast.show('Client deleted successfully', 'success');
    }
  }
}
