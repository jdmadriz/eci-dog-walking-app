  import { Routes } from '@angular/router';

  export const dogsRoutes: Routes = [
    {
      path: '',
      loadComponent: () =>
        import('./pages/dog-list/dog-list').then(m => m.DogListComponent),
    },
    {
      path: 'new',
      loadComponent: () =>
        import('./pages/dog-form/dog-form').then(m => m.DogFormComponent),
    },
    {
      path: ':id/edit',
      loadComponent: () =>
        import('./pages/dog-form/dog-form').then(m => m.DogFormComponent),
    },
  ];