import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { catchError, firstValueFrom, map, Observable, of } from 'rxjs';
import { LoginResponse, UserResponse } from '../interfaces/responses';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  #logged = signal(false);

  #http = inject(HttpClient);

  #rol = signal<string | null>(null);
  #id = signal<string | null>(null);

  get logged() {
    return this.#logged.asReadonly();
  }

  get rol() {
    return this.#rol.asReadonly();
  }

  get id() {
    return this.#id.asReadonly();
  }

  async login(email: string, password: string): Promise<void> {
    const resp = await firstValueFrom(
      this.#http.post<LoginResponse>('auth/login', {
        email,
        password,
      })
    );
    try {
      await Preferences.set({ key: 'fs-token', value: resp.token });
      await Preferences.set({ key: 'fs-rol', value: resp.rol });
      await Preferences.set({ key: 'fs-id', value: resp.id! });

      this.#logged.set(true);
    } catch (e) {
      throw new Error("Can't save authentication token in storage!");
    }
  }

  async logout(): Promise<void> {
    await Preferences.remove({ key: 'fs-token' });
    await Preferences.remove({ key: 'fs-rol' });
    await Preferences.remove({ key: 'fs-id' });
    this.#logged.set(false);
    this.#rol.set(null);
    this.#id.set(null);
  }

  async isLogged(): Promise<boolean> {
    if (this.#logged()) {
      // Estamos logueados
      return true;
    }

    const token = await Preferences.get({ key: 'fs-token' });
    if (!token.value) {
      // No hay token
      return false;
    }

    return firstValueFrom(this.#http.get('auth/validate').pipe(
      map(() => {
        this.#logged.set(true);
        return true; // Todo correcto
      }),
      catchError(() => of(false)) // Token no válido
    ));
  }

  getProfile(): Observable<User> {
    return this.#http
      .get<UserResponse>('auth/profile')
      .pipe(map((r) => r.user));
  }
}