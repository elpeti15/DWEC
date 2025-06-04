import { Routes } from '@angular/router';
import { roleGuard } from '../guards/role.guard';

export const patientsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./patients-page/patients.page').then(
        m => m.PatientsPage
    ),
    canActivate: [roleGuard],
    data: { roles: ['admin', 'physio'] }
  },
  {
    path: 'add',
    loadComponent: () => import('./patients-form/patients-form.page').then(
        m => m.PatientsFormPage
    ),
    canActivate: [roleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'profile/:id',
    loadComponent: () => import('./patient-detail/patient-detail.page').then(
        m => m.PatientDetailPage
    ),
    loadChildren: () => import('./patient-detail/patient-detail.routes').then(
        m => m.patientDetailRoutes
    ),
  }
];