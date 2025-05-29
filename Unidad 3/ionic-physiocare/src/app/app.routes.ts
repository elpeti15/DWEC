import { Routes } from '@angular/router';
import { logoutActivateGuard } from './guards/logout-activate.guard';
import { loginActivateGuard } from './guards/login-activate.guard';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [logoutActivateGuard],
    loadChildren: () =>
      import('./auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'appointments',
    canActivate: [loginActivateGuard],
    loadChildren: () =>
      import('./appointments/appointments.routes').then((m) => m.appointmentsRoutes),
  },
  {
    path: 'physios',
    canActivate: [loginActivateGuard],
    loadChildren: () => 
      import('./physios/physios.routes').then((m) => m.physiosRoutes)
  },
  {
    path: 'patients',
    canActivate: [loginActivateGuard],
    loadChildren: () => 
      import('./patients/patients.routes').then((m) => m.patientsRoutes)
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
  {
    path: 'patients',
    loadComponent: () => import('./patients/patients-page/patients.page').then( m => m.PatientsPage)
  },
  /*{
    path: 'home',
    loadComponent: () => import('./appointments/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'home',
    loadComponent: () => import('./physios/home/home.page').then( m => m.HomePage)
  },*/
];
