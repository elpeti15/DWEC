import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const loginActivateGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isLogged().pipe(
    map((r) => {
      console.log("guard login-activate", r);
      if (r)
        return true;
      else
        return router.createUrlTree(['/auth/login']);
    })
  );
};
