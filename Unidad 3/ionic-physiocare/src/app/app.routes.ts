import { Routes } from '@angular/router';
import { logoutActivateGuard } from './guards/logout-activate.guard';
import { loginActivateGuard } from './guards/login-activate.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [logoutActivateGuard],
    loadChildren: () =>
      import('./auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'appointments',
    canActivate: [loginActivateGuard, roleGuard],
    data: { roles: ['physio', 'patient'] },
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
  }
];
