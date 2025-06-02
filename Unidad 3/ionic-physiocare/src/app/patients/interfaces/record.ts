import { Appointment } from "src/app/appointments/interfaces/appointment";
import { Patient } from "./patient";

export interface Record {
    _id?: string;
    patient: Patient;
    medicalRecord?: string;
    appointments: Appointment[];
}