export interface Patient {
  _id?: string;
  name: string;
  surname: string;
  email: string;
  birthDate: string;
  address?: string;
  insuranceNumber: string;
  avatar?: string;
  lat?: number;
  lng?: number;
}