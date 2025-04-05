import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { SingleUserResponse, User, UserLogin, UserLoginFacebook, UserLoginGoogle } from '../../profile/interfaces/user';
import { catchError, map, Observable, of } from 'rxjs';
import { TokenResponse } from '../../restaurants/interfaces/responses';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  #http = inject(HttpClient);
  #authUrl = 'auth';
  #logged = signal(false);

  getLogged() {
    return this.#logged.asReadonly();
  }

  login(data: UserLogin): Observable<void> {
    return this.#http.post<TokenResponse>(`${this.#authUrl}/login`, data).pipe(
      map((res) => {
        this.#logged.set(true);
        localStorage.setItem('token', res.accessToken);
        //this.cookieService.set('token', res.accessToken, 365, '/');
      })
    );
  }

  logout() {
    this.#logged.set(false);
    localStorage.removeItem('token');
  }

  isLogged(): Observable<boolean> {
    const token = localStorage.getItem('token');
    //const token = this.#ssrCookieService.getCookie('token');
    if (!this.#logged() && !token) {
      return of(false);

    } else if (!this.#logged() && token) {
      console.log("entrando a validar token");
      this.#http.get<Observable<boolean>>(`${this.#authUrl}/validate`).pipe(
        map(() => {
          this.#logged.set(true);
          return true;
        }),
        catchError(() => {
          console.log('token no valido', token);
          localStorage.removeItem('token');
          //this.cookieService.delete('token');
          return of(false);
        })
      );
    }
    this.#logged.set(true);
    return of(true);
  }

  register(user: User): Observable<User> {
    return this.#http
      .post<SingleUserResponse>(`${this.#authUrl}/register`, user)
      .pipe(map((res) => res.user));
  }

  postLoginGoogle(user: UserLoginGoogle): Observable<TokenResponse> {
    return this.#http.post<TokenResponse>(`${this.#authUrl}/google`, user).pipe(
      map((res) => {
        this.#logged.set(true);
        localStorage.setItem('token', res.accessToken);
        //this.cookieService.set('token', res.accessToken, 365, '/');
        return res;
      })
    );
  }

  postLoginFacebook(user: UserLoginFacebook): Observable<TokenResponse> {
    return this.#http
      .post<TokenResponse>(`${this.#authUrl}/facebook`, user)
      .pipe(
        map((res) => {
          this.#logged.set(true);
          localStorage.setItem('token', res.accessToken);
          //this.cookieService.set('token', res.accessToken, 365, '/');
          return res;
        })
      );
  }
}