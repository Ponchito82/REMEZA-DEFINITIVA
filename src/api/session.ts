
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

/** La sesion no vence por inactividad (antes: 30 * 60 * 1000). */
export const INACTIVITY_LIMIT_MS = Infinity;

function scheduleExpiry(): void {
  clearExpiryTimer();
  if (!currentSession) return;
  // Sin limite no hay temporizador (setTimeout(Infinity) dispararia de inmediato).
  if (!Number.isFinite(currentSession.expiresAt)) return;
  expiryTimer = setTimeout(() => {
    if (currentSession && Date.now() >= currentSession.expiresAt) reportUnauthorized("expired");
    else scheduleExpiry();
  }, Math.max(currentSession.expiresAt - Date.now(), 0) + 50);
}

/**
 * La sesion no se cierra por inactividad. `expiresInMs` del servidor se
 * ignora a proposito.
 */
export function startSession(customerId: string, token: string, _expiresInMs?: number): void {
  currentSession = {
    customerId,
    token,
    expiresAt: Date.now() + INACTIVITY_LIMIT_MS,
  };
  scheduleExpiry();
}

/** Marca actividad del usuario: reinicia la cuenta de los 30 minutos. */
export function touchSession(): void {
  if (!currentSession) return;
  currentSession.expiresAt = Date.now() + INACTIVITY_LIMIT_MS;
}

/** Cierra la sesion si ya paso el limite (p. ej. al volver de segundo plano). */
export function checkInactivity(): void {
  if (currentSession && Date.now() >= currentSession.expiresAt) reportUnauthorized("expired");
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
  return Date.now() >= currentSession.expiresAt;
}

export function remainingSessionMs(): number {
  if (!currentSession) return 0;
  return Math.max(currentSession.expiresAt - Date.now(), 0);
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
