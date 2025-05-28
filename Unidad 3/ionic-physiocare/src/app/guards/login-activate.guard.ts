import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';

export const loginActivateGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  return (await inject(AuthService).isLogged()) || router.createUrlTree(['/auth/login']);
};
