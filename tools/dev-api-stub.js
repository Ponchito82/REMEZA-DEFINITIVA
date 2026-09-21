/**
 * Stub de desarrollo del API de Remeza.
 *
 * ESTO NO ES remeza-api. Es un servidor mínimo que habla el mismo protocolo
 * para poder usar la app en el emulador mientras el backend de verdad no esté
 * disponible. No hay base de datos, no hay reglas de negocio y las credenciales
 * están escritas aquí abajo.
 *
 * Por eso los endpoints que no estén implementados responden un error explícito
 * en vez de inventarse una respuesta: si un spec de Appium pasa contra esto, lo
 * que ha pasado es que ha pasado contra el stub, no contra el backend.
 *
 *   node tools/dev-api-stub.js
 *
 * La app lo busca en http://localhost:8700 (10.0.2.2:8700 desde el emulador
 * Android, ver src/api/client.ts).
 */

const http = require("node:http");
const crypto = require("node:crypto");

const PORT = 8700;

/** El usuario de prueba que usan los specs de Appium (appium_tests/README.md). */
const TEST_USER = {
  phoneNumber: "+525538068807",
  accessCode: "123456",
  customerId: "stub-customer-0001",
};

/** Cuánto dura la sesión que entrega el stub. */
const SESSION_MS = 30 * 60 * 1000;

/** Tokens emitidos en esta ejecución. Se pierden al reiniciar, a propósito. */
const issued = new Map();

/** El sobre que espera src/api/client.ts */
function send(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(payload),
  });
  res.end(payload);
}

const ok = (res, data, message = null) => send(res, 200, { success: true, message, data });
const fail = (res, status, message) => send(res, status, { success: false, message, data: null });

function bearer(req) {
  const header = req.headers.authorization ?? "";
  return header.startsWith("Bearer ") ? header.slice(7) : null;
}

function requireSession(req, res) {
  const token = bearer(req);
  const expiresAt = token ? issued.get(token) : undefined;

  if (!expiresAt) {
    fail(res, 401, "Sesión no autorizada.");
    return false;
  }
  if (Date.now() > expiresAt) {
    issued.delete(token);
    fail(res, 401, "La sesión expiró.");
    return false;
  }
  return true;
}

function readBody(req) {
  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (chunk) => (raw += chunk));
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const { pathname, searchParams } = new URL(req.url, `http://${req.headers.host}`);
  const route = `${req.method} ${pathname}`;
  const body = req.method === "POST" || req.method === "PATCH" ? await readBody(req) : {};

  console.log(`[stub] ${route}`);

  // --- Inicio de sesión ---
  if (route === "POST /api/v1/auth") {
    const { phoneNumber, accessCode } = body;

    if (phoneNumber !== TEST_USER.phoneNumber || accessCode !== TEST_USER.accessCode) {
      // 401 es lo que la app traduce a "credenciales inválidas".
      return fail(res, 401, "Teléfono o código de acceso incorrectos.");
    }

    const token = crypto.randomUUID();
    issued.set(token, Date.now() + SESSION_MS);

    return ok(res, {
      customerId: TEST_USER.customerId,
      token,
      expiresInMs: SESSION_MS,
    });
  }

  // --- Sonda de sesión: la app pide las tarjetas para saber si el token vale ---
  if (route === "GET /api/v1/cards") {
    if (!requireSession(req, res)) return;
    return ok(res, []);
  }

  // --- Verificación por SMS ---
  if (pathname === "/api/verification/send" && req.method === "POST") {
    console.log(`[stub]   código de verificación para ${searchParams.get("phoneNumber")}: 123456`);
    return ok(res, "pending");
  }
  if (pathname === "/api/verification/check" && req.method === "POST") {
    const code = searchParams.get("code");
    return code === "123456"
      ? ok(res, "approved")
      : fail(res, 400, "El código de verificación no es válido.");
  }

  // Cualquier otra cosa: se dice, no se finge.
  console.log(`[stub]   sin implementar`);
  return fail(res, 501, `El stub no implementa ${route}. No es el backend real.`);
});

server.listen(PORT, () => {
  console.log(`[stub] API de desarrollo escuchando en http://localhost:${PORT}`);
  console.log(`[stub] NO es remeza-api: sólo login, sonda de sesión y verificación.`);
  console.log(`[stub] usuario: ${TEST_USER.phoneNumber} / ${TEST_USER.accessCode}`);
});
