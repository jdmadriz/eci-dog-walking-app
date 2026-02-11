  import { Routes } from '@angular/router';

  export const dogsRoutes: Routes = [
    {
      path: '',
      loadComponent: () =>
        import('./pages/dog-list/dog-list').then(m => m.DogListComponent),
    },
  ];