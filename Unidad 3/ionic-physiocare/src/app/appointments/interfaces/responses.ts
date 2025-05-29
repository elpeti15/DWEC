import { Appointment } from "./appointment";

export interface AppointmentsResponse {
    ok: boolean;
    result: Appointment[];
}

export interface SingleAppointmentResponse {
    ok: boolean;
    result: Appointment;
}