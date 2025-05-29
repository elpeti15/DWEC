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
  {
    path: 'profile/:id',
    loadComponent: () => import('./physios-info/physios-info.page').then(
      m => m.PhysiosInfoPage
    ),
  }
];