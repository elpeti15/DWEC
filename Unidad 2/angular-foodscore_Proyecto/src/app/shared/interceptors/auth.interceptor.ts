import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  const platformId  = inject(PLATFORM_ID);
  const token = isPlatformBrowser(platformId) ? localStorage.getItem('token') : null;

  //const token = inject(SsrCookieService).getCookie('token');
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + token),
    });
    return next(authReq);
  }
  return next(req);
};
