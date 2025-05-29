import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, from, map, Observable, of, switchMap } from 'rxjs';
import { Appointment } from '../interfaces/appointment';
import { Preferences } from '@capacitor/preferences';
import { AppointmentsResponse, SingleAppointmentResponse } from '../interfaces/responses';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  #http = inject(HttpClient);

  getAppointments(): Observable<Appointment[]> {
    return from(Preferences.get({ key: 'fs-rol' })).pipe(
      switchMap(({ value: rol }) => {
        console.log('ROL: ', rol); // <- para confirmar el rol
        if (rol === 'patient') {
          return this.#http
            .get<AppointmentsResponse>('records/appointments/patient/me')
            .pipe(map((resp) => {
              console.log('Citas obtenidas:', resp.result);
              return resp.result;
            }));
        }

        if (rol === 'physio') {
          return this.#http
            .get<AppointmentsResponse>('records/appointments/physio/me')
            .pipe(map((resp) => {
              console.log('Citas obtenidas:', resp.result);
              return resp.result;
            }));
        }

        return of([]); // Si no es ni paciente ni fisio
      })
    );
  }

  addAppointment(physioId: string, date: string): Observable<Appointment> {
    return this.#http
      .post<SingleAppointmentResponse>('records/appointments/new', {
        physio: physioId,
        date,
      })
      .pipe(map((resp) => resp.result));
  }

  updateAppointmentDetails(
    patientId: string,
    appointmentId: string,
    diagnosis: string,
    treatment: string,
    observations: string
  ): Observable<Appointment> {
    return this.#http
      .put<SingleAppointmentResponse>(
        `records/patient/${patientId}/appointments/${appointmentId}/add-details`,
        { diagnosis, treatment, observations }
      )
      .pipe(map((resp) => resp.result));
  }

  confirmAppointment(patientId: string, appointmentId: string): Observable<Appointment> {
    return this.#http
      .put<SingleAppointmentResponse>(
        `records/patient/${patientId}/appointments/${appointmentId}/confirm`,
        {}
      )
      .pipe(map((resp) => resp.result));
  }
}
