import { Routes } from '@angular/router';

  export const walksRoutes: Routes = [
    {
      path: '',
      loadComponent: () =>
        import('./pages/walk-list/walk-list').then(m => m.WalkListComponent),
    },
  ];