import { Routes } from '@angular/router';

export const appointmentsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home.page').then(
        (m) => m.HomePage
      ),
  },
];