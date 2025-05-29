import { Patient } from "./patient";

export interface PatientsResponse {
    result: Patient[];
}

export interface SinglePatientResponse {
    result: Patient;
}