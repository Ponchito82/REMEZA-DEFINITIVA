import { apiPost } from "./client";

export type AuthResponse = {
  customerId: string;
  token: string;
  expiresInMs: number;
};

export function login(phoneNumber: string, accessCode: string) {
  return apiPost<AuthResponse>(
    "/api/v1/auth",
    {
      phoneNumber,
      accessCode,
    },
    false,
  );
}
