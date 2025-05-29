import { Routes } from '@angular/router';

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
    loadComponent: () =>
      import('./appointment-form/appointment-form.page').then(
        (m) => m.AppointmentFormPage
      ),
  }
];