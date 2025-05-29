import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Patient } from '../interfaces/patient';
import { PatientsResponse, SinglePatientResponse } from '../interfaces/responses';


@Injectable({
  providedIn: 'root'
})
export class PatientsService {
#http = inject(HttpClient);

  getPatients(): Observable<Patient[]> {
    return this.#http
      .get<PatientsResponse>('patients')
      .pipe(map((resp) => resp.result));
  }

  getPatient(id: number): Observable<Patient> {
    return this.#http
      .get<SinglePatientResponse>(`patients/${id}`)
      .pipe(map((resp) => resp.result));
  }

  addPatient(pat: Patient): Observable<Patient> {
    return this.#http
      .post<SinglePatientResponse>('patients', pat)
      .pipe(map((resp) => resp.result));
  }

  deletePatient(idPat: string): Observable<void> {
    return this.#http.delete<void>(`patients/${idPat}`);
  }
}