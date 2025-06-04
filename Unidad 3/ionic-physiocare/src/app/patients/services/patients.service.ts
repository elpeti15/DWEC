import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Patient } from '../interfaces/patient';
import { Record } from '../interfaces/record';
import { PatientsResponse, SinglePatientResponse, SingleRecordResponse } from '../interfaces/responses';


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

  getRecordProfile(id?: string): Observable<Record> {
    if (id) {
      return this.#http
        .get<SingleRecordResponse>(`records/profile/${id}`)
        .pipe(map((resp) => resp.result));
    } else {
      return this.#http
        .get<SingleRecordResponse>(`records/profile/me`)
        .pipe(map((resp) => resp.result));
    }
  }

  updateMedicalRecord(id: string, record: string): Observable<Record> {
    return this.#http
      .put<SingleRecordResponse>(`records/${id}/medical-record`, { medicalRecord: record })
      .pipe(map((resp) => resp.result));
  }

  updateAvatar(id: string, avatar: string): Observable<Patient> {
    return this.#http
      .post<SinglePatientResponse>(`patients/avatar/${id}`, { avatar })
      .pipe(map((resp) => resp.result));
  }
}