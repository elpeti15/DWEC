import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const rolesPermitidos = route.data?.['roles'] as string[] | undefined;
  const rolUsuario = authService.rol();

  // Si no hay restricción de roles, permite el acceso
  if (!rolesPermitidos || rolesPermitidos.length === 0) return true;

  // Permite el acceso solo si el rol del usuario está en los roles permitidos
  return rolUsuario !== null && rolesPermitidos.includes(rolUsuario);
};
