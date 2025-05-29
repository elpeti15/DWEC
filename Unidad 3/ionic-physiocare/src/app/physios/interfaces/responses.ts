import { Physio } from "./physio";

export interface PhysiosResponse {
  ok: boolean;
  result: Physio[];
}

export interface SinglePhysioResponse {
  ok: boolean;
  result: Physio;
}