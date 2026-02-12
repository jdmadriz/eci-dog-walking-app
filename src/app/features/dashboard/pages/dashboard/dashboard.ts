import { Component, computed, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { RouterLink } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { AppState } from '../../../../state/app.state';
import { ClientActions } from '../../../../state/clients/client.actions';
import { DogActions } from '../../../../state/dogs/dog.actions';
import { WalkActions } from '../../../../state/walks/walk.actions';
import { selectAllClients } from '../../../../state/clients/client.selectors';
import { selectAllDogs } from '../../../../state/dogs/dog.selectors';
import { selectAllWalks } from '../../../../state/walks/walk.selectors';
import { selectClientEntities } from '../../../../state/clients/client.selectors';
import { WalkStatus } from '../../../../models/walk.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, BaseChartDirective],
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>

      <!-- Stat Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <p class="text-xs sm:text-sm font-medium text-gray-500">Total Clients</p>
          <p class="text-2xl sm:text-3xl font-bold text-indigo-600 mt-1">{{ totalClients() }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <p class="text-xs sm:text-sm font-medium text-gray-500">Total Dogs</p>
          <p class="text-2xl sm:text-3xl font-bold text-green-600 mt-1">{{ totalDogs() }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <p class="text-xs sm:text-sm font-medium text-gray-500">Total Walks</p>
          <p class="text-2xl sm:text-3xl font-bold text-yellow-600 mt-1">{{ totalWalks() }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <p class="text-xs sm:text-sm font-medium text-gray-500">Scheduled</p>
          <p class="text-2xl sm:text-3xl font-bold text-blue-600 mt-1">{{ scheduledWalks() }}</p>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Walks by Status (Doughnut) -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Walks by Status</h2>
          @if (totalWalks() > 0) {
            <div class="relative h-64">
              <canvas baseChart [data]="doughnutData()" [options]="doughnutOptions" type="doughnut">
              </canvas>
            </div>
          } @else {
            <p class="text-gray-400 text-sm text-center py-12">No walk data yet</p>
          }
        </div>

        <!-- Dogs per Client (Bar) -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Dogs per Client</h2>
          @if (totalDogs() > 0) {
            <div class="relative h-64">
              <canvas baseChart [data]="dogsPerClientData()" [options]="barOptions" type="bar">
              </canvas>
            </div>
          } @else {
            <p class="text-gray-400 text-sm text-center py-12">No dog data yet</p>
          }
        </div>
      </div>

      <!-- Walk Duration Chart (full width) -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Recent Walk Durations</h2>
        @if (totalWalks() > 0) {
          <div class="relative h-64">
            <canvas baseChart [data]="walkDurationsData()" [options]="barOptions" type="bar">
            </canvas>
          </div>
        } @else {
          <p class="text-gray-400 text-sm text-center py-12">No walk data yet</p>
        }
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div class="flex flex-wrap gap-3">
          <a
            routerLink="/clients/new"
            class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
          >
            + New Client
          </a>
          <a
            routerLink="/dogs/new"
            class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium"
          >
            + New Dog
          </a>
          <a
            routerLink="/walks/new"
            class="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition text-sm font-medium"
          >
            + Schedule Walk
          </a>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  private store = inject(Store<AppState>);

  clients = this.store.selectSignal(selectAllClients);
  dogs = this.store.selectSignal(selectAllDogs);
  walks = this.store.selectSignal(selectAllWalks);
  clientEntities = this.store.selectSignal(selectClientEntities);

  // Stat counts
  totalClients = computed(() => this.clients().length);
  totalDogs = computed(() => this.dogs().length);
  totalWalks = computed(() => this.walks().length);
  scheduledWalks = computed(() => this.walks().filter((w) => w.status === 'scheduled').length);

  // Doughnut chart — walks by status
  doughnutData = computed<ChartConfiguration<'doughnut'>['data']>(() => {
    const statuses: WalkStatus[] = ['scheduled', 'in-progress', 'completed', 'cancelled'];
    const counts = statuses.map((s) => this.walks().filter((w) => w.status === s).length);
    return {
      labels: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
      datasets: [
        {
          data: counts,
          backgroundColor: ['#3B82F6', '#F59E0B', '#10B981', '#EF4444'],
        },
      ],
    };
  });

  doughnutOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
  };

  // Bar chart — dogs per client
  dogsPerClientData = computed<ChartConfiguration<'bar'>['data']>(() => {
    const clientMap = new Map<string, number>();
    this.dogs().forEach((dog) => {
      clientMap.set(dog.clientId, (clientMap.get(dog.clientId) || 0) + 1);
    });

    const labels: string[] = [];
    const data: number[] = [];
    clientMap.forEach((count, clientId) => {
      const client = this.clientEntities()[clientId];
      labels.push(client ? `${client.firstName} ${client.lastName}` : 'Unknown');
      data.push(count);
    });

    return {
      labels,
      datasets: [
        {
          label: 'Dogs',
          data,
          backgroundColor: '#6366F1',
        },
      ],
    };
  });

  // Bar chart — recent walk durations
  walkDurationsData = computed<ChartConfiguration<'bar'>['data']>(() => {
    const recent = this.walks().slice(-10); // last 10 walks
    return {
      labels: recent.map((w) => {
        const dog = this.dogs().find((d) => d.id === w.dogId);
        return dog ? dog.name : 'Unknown';
      }),
      datasets: [
        {
          label: 'Duration (min)',
          data: recent.map((w) => w.duration),
          backgroundColor: '#F59E0B',
        },
      ],
    };
  });

  barOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  ngOnInit(): void {
    this.store.dispatch(ClientActions.loadClients());
    this.store.dispatch(DogActions.loadDogs());
    this.store.dispatch(WalkActions.loadWalks());
  }
}
