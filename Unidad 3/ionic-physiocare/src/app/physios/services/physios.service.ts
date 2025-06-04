import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Physio } from '../interfaces/physio';
import { PhysiosResponse, SinglePhysioResponse } from '../interfaces/responses';

@Injectable({
  providedIn: 'root'
})
export class PhysiosService {
  #http = inject(HttpClient);

  getPhysios(): Observable<Physio[]> {
    return this.#http.get<PhysiosResponse>('physios').pipe(
      map((resp) => resp.result)
    );
  }

  getPhysioById(id: string): Observable<Physio> {
    return this.#http.get<SinglePhysioResponse>(`physios/${id}`).pipe(
      map(resp => resp.result)
    );
  }

  addPhysio(physio: Physio): Observable<Physio> {
    return this.#http.post<SinglePhysioResponse>('physios', physio).pipe(
      map(resp => resp.result)
    );
  }

  deletePhysio(id: string): Observable<void> {
    return this.#http.delete<void>(`physios/${id}`);
  }

  updateAvatar(id: string, avatar: string): Observable<Physio> {
    return this.#http.post<SinglePhysioResponse>(`physios/avatar/${id}`, { avatar }).pipe(
      map(resp => resp.result)
    );
  }
}
