import { Routes } from '@angular/router';

export const patientDetailRoutes: Routes = [
  {
    path: 'info',
    loadComponent: () =>
      import('./patient-info/patient-info.page').then(
        (m) => m.PatientInfoPage
      ),
  },
  {
    path: 'location',
    loadComponent: () => import('./patient-location/patient-location.page').then(
        m => m.PatientLocationPage
    ),
  },
  {
    path: 'record',
    loadComponent: () => import('./patient-record/patient-record.page').then(
        m => m.PatientRecordPage
    ),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'info',
  },
];