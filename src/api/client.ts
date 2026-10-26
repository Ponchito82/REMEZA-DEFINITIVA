import { getToken, isSessionExpired, remainingSessionMs, reportUnauthorized } from "./session";

// "localhost" + "adb reverse" funciona igual en el emulador que en un
// telefono fisico por USB; "10.0.2.2" solo existe dentro del emulador.
const DEV_HOST = "localhost";

// true: API de pruebas desplegado (dev.api.remeza.app); false: backend local por adb reverse.
const USE_REMOTE_DEV_API = true;

export const API_BASE_URL = USE_REMOTE_DEV_API ? "https://dev.api.remeza.app" : `http://${DEV_HOST}:8700`;

type ApiEnvelope<T> = {
  success: boolean;
  message: string | null;
  data: T | null;
};

export class ApiError extends Error {
  status: number;
  code?: string;
  /** Mensaje original del servidor (en ingles), para detectar casos concretos. */
  serverMessage?: string;

  constructor(message: string, status: number, code?: string, serverMessage?: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.serverMessage = serverMessage;
  }
}

// El API responde { message, status, timestamp } con mensajes en ingles y sin
// codigo; la unica excepcion es code "KYC_FAILED". Se traduce segun el status.
function localizedMessage(status: number, authenticated: boolean, json: any, fallback: string): string {
  if (json?.code === "KYC_FAILED") return json?.message ?? fallback;
  switch (status) {
    case 400:
      return "Los datos ingresados no son válidos.";
    case 401:
      return authenticated ? "Tu sesión expiró. Inicia sesión de nuevo." : "Código de acceso incorrecto.";
    case 404:
      return "No se encontró la información solicitada.";
    case 500:
      return "Ocurrió un error interno. Intenta de nuevo más tarde.";
    default:
      return json?.message ?? fallback;
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
    throw new ApiError(localizedMessage(401, authenticated, json, "Sesión no autorizada."), 401);
  }

  if (!response.ok) {
    trace(`${route} respondio HTTP ${response.status}`);
    throw new ApiError(
      localizedMessage(response.status, authenticated, json, "Ocurrió un error de conexión."),
      response.status,
      json?.code,
      json?.message,
    );
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

export function apiPut<T>(path: string, body: unknown, authenticated = true): Promise<T> {
  return apiRequest<T>(path, { method: "PUT", body, authenticated });
}

export function apiPatch<T>(path: string, body: unknown, authenticated = true): Promise<T> {
  return apiRequest<T>(path, { method: "PATCH", body, authenticated });
}

export function apiDelete<T>(path: string, authenticated = true): Promise<T> {
  return apiRequest<T>(path, { method: "DELETE", authenticated });
}
