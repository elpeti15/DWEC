import { Patient } from "./patient";
import { Record } from "./record";

export interface PatientsResponse {
    ok: boolean;
    result: Patient[];
}

export interface SinglePatientResponse {
    ok: boolean;
    result: Patient;
}

export interface RecordsResponse {
    ok: boolean;
    result: Record[];
}
export interface SingleRecordResponse {
    ok: boolean;
    result: Record;
}