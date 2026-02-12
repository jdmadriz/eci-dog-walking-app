  import { Routes } from '@angular/router';

  export const clientsRoutes: Routes = [
    {
      path: '',
      loadComponent: () =>
        import('./pages/client-list/client-list').then(m => m.ClientListComponent),
    },
    {
      path: 'new',
      loadComponent: () =>
        import('./pages/client-form/client-form').then(m => m.ClientFormComponent),
    },
    {
      path: ':id/edit',
      loadComponent: () =>
        import('./pages/client-form/client-form').then(m => m.ClientFormComponent),
    },
  ];