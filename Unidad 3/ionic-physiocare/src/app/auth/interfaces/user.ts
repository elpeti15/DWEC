import { Patient } from "src/app/patients/interfaces/patient";
import { Physio } from "src/app/physios/interfaces/physio";

export interface User {
  _id?: string; 
  login: string; // se usa como email
  password?: string; 
  rol: 'admin' | 'physio' | 'patient';
  patient?: Patient; // objeto patient (solo si es patient)
  physio?: Physio;  // objeto fisio (solo si es physio)
}