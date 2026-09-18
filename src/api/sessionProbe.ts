import { ApiError, apiGet } from "./client";

export const SESSION_PROBE_PATH = "/api/v1/cards";

export type SessionProbeResult = "valid" | "unauthorized" | "unreachable";

export async function verifySession(): Promise<SessionProbeResult> {
  try {
    await apiGet(SESSION_PROBE_PATH);
    return "valid";
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return "unauthorized";
    return "unreachable";
  }
}
