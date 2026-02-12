import { Routes } from '@angular/router';

  export const walksRoutes: Routes = [
    {
      path: '',
      loadComponent: () =>
        import('./pages/walk-list/walk-list').then(m => m.WalkListComponent),
    },
    {
      path: 'new',
      loadComponent: () =>
        import('./pages/walk-form/walk-form').then(m => m.WalkFormComponent),
    },
    {
      path: ':id/edit',
      loadComponent: () =>
        import('./pages/walk-form/walk-form').then(m => m.WalkFormComponent),
    },
  ];