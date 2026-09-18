import { Platform } from "react-native";
import { getToken, isSessionExpired, remainingSessionMs, reportUnauthorized } from "./session";

const DEV_HOST = Platform.select({ android: "10.0.2.2", default: "localhost" });

export const API_BASE_URL = `http://${DEV_HOST}:8700`;

type ApiEnvelope<T> = {
  success: boolean;
  message: string | null;
  data: T | null;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  authenticated?: boolean;
};

function pathWithoutQuery(path: string): string {
  const index = path.indexOf("?");
  return index === -1 ? path : `${path.slice(0, index)}?[oculto]`;
}

function trace(message: string): void {
  if (__DEV__) {
    console.log(`[api] ${message}`);
  }
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, authenticated = true } = options;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const route = `${method} ${pathWithoutQuery(path)}`;

  if (authenticated) {
    if (isSessionExpired()) {
      trace(`${route} BLOQUEADO: token vencido, no se envia la peticion -> cierre de sesion`);
      reportUnauthorized("expired");
      throw new ApiError("La sesión expiró.", 401);
    }
    headers.Authorization = `Bearer ${getToken()}`;
    trace(`${route} enviado CON token (quedan ${Math.round(remainingSessionMs() / 1000)}s de sesion)`);
  } else {
    trace(`${route} enviado SIN token (endpoint publico)`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    trace(`${route} SIN RESPUESTA: no se pudo conectar (la sesion NO se cierra)`);
    throw new ApiError("No se pudo conectar con el servidor.", 0);
  }

  const json = await response.json().catch(() => null);

  if (response.status === 401) {
    trace(`${route} respondio 401 -> cierre de sesion y regreso al Login`);
    if (authenticated) reportUnauthorized("rejected");
    throw new ApiError(json?.message ?? "Sesión no autorizada.", 401);
  }

  if (!response.ok) {
    trace(`${route} respondio HTTP ${response.status}`);
    throw new ApiError(json?.message ?? "Ocurrió un error de conexión.", response.status);
  }

  const envelope = json as ApiEnvelope<T>;

  if (envelope && envelope.success === false) {
    trace(`${route} respondio HTTP ${response.status} con success:false`);
    throw new ApiError(envelope.message ?? "La operación no se pudo completar.", response.status);
  }

  trace(`${route} OK (HTTP ${response.status})`);
  return envelope.data as T;
}

export function apiGet<T>(path: string, authenticated = true): Promise<T> {
  return apiRequest<T>(path, { method: "GET", authenticated });
}

export function apiPost<T>(path: string, body: unknown, authenticated = true): Promise<T> {
  return apiRequest<T>(path, { method: "POST", body, authenticated });
}

export function apiPatch<T>(path: string, body: unknown, authenticated = true): Promise<T> {
  return apiRequest<T>(path, { method: "PATCH", body, authenticated });
}

export function apiDelete<T>(path: string, authenticated = true): Promise<T> {
  return apiRequest<T>(path, { method: "DELETE", authenticated });
}
