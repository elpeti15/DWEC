import { Routes } from '@angular/router';

export const physiosRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'add',
    loadComponent: () => import('./physio-form/physio-form.page').then((m) => m.PhysioFormPage),
  },
];