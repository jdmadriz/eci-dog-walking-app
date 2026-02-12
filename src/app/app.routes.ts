import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then((m) => m.dashboardRoutes),
    canActivate: [authGuard],
  },
  {
    path: 'clients',
    loadChildren: () => import('./features/clients/clients.routes').then((m) => m.clientsRoutes),
    canActivate: [authGuard],
  },
  {
    path: 'dogs',
    loadChildren: () => import('./features/dogs/dogs.routes').then((m) => m.dogsRoutes),
    canActivate: [authGuard],
  },
  {
    path: 'walks',
    loadChildren: () => import('./features/walks/walks.routes').then((m) => m.walksRoutes),
    canActivate: [authGuard],
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' },
];
