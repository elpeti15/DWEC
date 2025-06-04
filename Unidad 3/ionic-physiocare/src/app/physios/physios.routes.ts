import { Routes } from '@angular/router';
import { roleGuard } from '../guards/role.guard';

export const physiosRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'add',
    loadComponent: () => import('./physio-form/physio-form.page').then((m) => m.PhysioFormPage),
    canActivate: [roleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'profile/:id',
    loadComponent: () => import('./physios-info/physios-info.page').then(
      m => m.PhysiosInfoPage
    ),
  }
];