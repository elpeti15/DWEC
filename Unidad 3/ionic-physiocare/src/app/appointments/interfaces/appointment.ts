import { Patient } from "src/app/patients/interfaces/patient";
import { Physio } from "src/app/physios/interfaces/physio";

export interface Appointment {
  _id?: string;
  date: string; // Fecha y hora de la cita
  physio: Physio;
  diagnosis?: string;
  treatment?: string;
  observations?: string;
  confirmed?: boolean;
  patient?: Patient; // Solo si lo recibe el fisio
}