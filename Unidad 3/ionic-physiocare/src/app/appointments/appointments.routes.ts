import { Routes } from '@angular/router';
import { roleGuard } from '../guards/role.guard';

export const appointmentsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home.page').then(
        (m) => m.HomePage
      ),
  },
  {
    path: 'add/:physioId',
    canActivate: [roleGuard],
    data: { roles: ['patient'] },
    loadComponent: () =>
      import('./appointment-form/appointment-form.page').then(
        (m) => m.AppointmentFormPage
      ),
  }
];