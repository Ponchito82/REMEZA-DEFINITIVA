
export const DEFAULT_SESSION_TTL_MS = 30 * 60 * 1000;

const EXPIRY_SKEW_MS = 5000;

export type UnauthorizedReason = "expired" | "rejected";

type Session = {
  customerId: string;
  token: string;
  expiresAt: number;
};

let currentSession: Session | null = null;
let listener: ((reason: UnauthorizedReason) => void) | null = null;
let expiryTimer: ReturnType<typeof setTimeout> | null = null;

function clearExpiryTimer(): void {
  if (expiryTimer !== null) {
    clearTimeout(expiryTimer);
    expiryTimer = null;
  }
}

export function startSession(customerId: string, token: string, expiresInMs?: number): void {
  const ttl = expiresInMs && expiresInMs > 0 ? expiresInMs : DEFAULT_SESSION_TTL_MS;
  currentSession = {
    customerId,
    token,
    expiresAt: Date.now() + ttl,
  };

  clearExpiryTimer();
  expiryTimer = setTimeout(() => {
    expiryTimer = null;
    reportUnauthorized("expired");
  }, Math.max(0, ttl - EXPIRY_SKEW_MS));
}

export function clearSession(): void {
  currentSession = null;
  clearExpiryTimer();
}

export function getToken(): string | null {
  return currentSession?.token ?? null;
}

export function getCustomerId(): string | null {
  return currentSession?.customerId ?? null;
}

export function isSessionExpired(): boolean {
  if (!currentSession) return true;
  return Date.now() + EXPIRY_SKEW_MS >= currentSession.expiresAt;
}

export function remainingSessionMs(): number {
  if (!currentSession) return 0;
  return Math.max(0, currentSession.expiresAt - Date.now());
}

export function onUnauthorized(handler: (reason: UnauthorizedReason) => void): () => void {
  listener = handler;
  return () => {
    if (listener === handler) listener = null;
  };
}

export function reportUnauthorized(reason: UnauthorizedReason): void {
  clearSession();
  listener?.(reason);
}
