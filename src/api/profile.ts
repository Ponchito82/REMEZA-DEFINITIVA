import { apiGet } from "./client";

/** Los datos del cliente que inicio sesion. Solo lectura. */
export type ProfileData = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phoneNumber: string | null;
  dateOfBirth: string | null;
  addressLine1: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  status: string | null;
};

export function getProfile(): Promise<ProfileData> {
  return apiGet<ProfileData>("/api/v1/profile");
}
