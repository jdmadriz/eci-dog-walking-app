import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'clients',
    loadChildren: () => import('./features/clients/clients.routes').then((m) => m.clientsRoutes),
  },
  {
    path: 'dogs',
    loadChildren: () => import('./features/dogs/dogs.routes').then((m) => m.dogsRoutes),
  },
  {
    path: 'walks',
    loadChildren: () => import('./features/walks/walks.routes').then((m) => m.walksRoutes),
  },
];
