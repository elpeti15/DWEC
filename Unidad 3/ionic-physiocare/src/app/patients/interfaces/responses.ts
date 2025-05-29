import { Patient } from "./patient";

export interface PatientsResponse {
    ok: boolean;
    result: Patient[];
}

export interface SinglePatientResponse {
    ok: boolean;
    result: Patient;
}