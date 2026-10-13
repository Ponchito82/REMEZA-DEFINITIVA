import {
  MOCK_NOTIFICATION_PREFERENCES,
  NotificationPreferences,
} from "../mocks/remeza";
import { MOCK_EMAIL_CODE } from "../mocks/remeza";
import { mockDelay } from "./mockDelay";
import { authenticateWithBiometrics, BiometricsResult, getDeviceId } from "./biometrics";
import { listDevices, setDeviceBiometric } from "../api/devices";
import { changeSecureCode } from "../api/secureCode";
import { getVerificationMethods, updateVerificationMethods } from "../api/settings";
import { getToken } from "../api/session";

export type TwoFactorMethod = "sms" | "email";

let biometricsEnabled = false;
let notificationPreferences: NotificationPreferences = { ...MOCK_NOTIFICATION_PREFERENCES };

function toMethods(data: { smsEnabled: boolean; emailEnabled: boolean }): Record<TwoFactorMethod, boolean> {
  return { sms: data.smsEnabled, email: data.emailEnabled };
}

/** Metodos activos de verificacion (SMS y correo, independientes entre si). */
export async function getTwoFactorMethods(): Promise<Record<TwoFactorMethod, boolean>> {
  return toMethods(await getVerificationMethods());
}

/** Si el cliente tiene correo registrado; sin el, el de correo no se puede prender. */
export async function isEmailMethodAvailable(): Promise<boolean> {
  return (await getVerificationMethods()).emailAvailable;
}

// TODO API: enviar el codigo de verificacion al telefono (SMS) o al correo.
export async function sendTwoFactorCode(
  _method: TwoFactorMethod,
  _destination: string,
): Promise<{ ok: boolean }> {
  await mockDelay(800);
  return { ok: true };
}

// TODO API: validar el codigo recibido. El mock acepta MOCK_EMAIL_CODE.
export async function verifyTwoFactorCode(
  _method: TwoFactorMethod,
  _destination: string,
  code: string,
): Promise<{ ok: boolean }> {
  await mockDelay(700);
  return { ok: code === MOCK_EMAIL_CODE };
}

/** Activa o desactiva un metodo; el backend devuelve como quedaron los dos. */
export async function setTwoFactorMethod(
  method: TwoFactorMethod,
  enabled: boolean,
): Promise<Record<TwoFactorMethod, boolean>> {
  const changes = method === "sms" ? { smsEnabled: enabled } : { emailEnabled: enabled };
  return toMethods(await updateVerificationMethods(changes));
}

/**
 * Cambia el codigo de acceso con la sesion abierta. Si el backend lo rechaza
 * (codigo actual incorrecto, formato invalido) lanza `ApiError` con su mensaje.
 */
export async function changeAccessCode(
  currentCode: string,
  newCode: string,
): Promise<{ ok: boolean }> {
  await changeSecureCode(currentCode, newCode);
  return { ok: true };
}

/**
 * Activa la biometria pidiendo la verificacion real al sistema: Face ID en
 * iOS y huella digital en Android. Solo se marca activa si el usuario la pasa.
 * Despues se guarda en el backend que este dispositivo la tiene activa. Eso es
 * solo la preferencia: para entrar se sigue pidiendo el codigo de acceso.
 */
export async function enableBiometrics(
  promptMessage: string,
  cancelButtonText: string,
): Promise<BiometricsResult> {
  const result = await authenticateWithBiometrics(promptMessage, cancelButtonText);
  if (result.ok) {
    biometricsEnabled = true;
    await saveBiometricPreference(true);
  }
  return result;
}

/** Guardar la preferencia no debe tirar la activacion local: si falla, se reintenta al volver a entrar. */
async function saveBiometricPreference(enabled: boolean): Promise<void> {
  if (!getToken()) return;
  try {
    await setDeviceBiometric(await getDeviceId(), enabled);
  } catch {
    // Sin conexion o sesion vencida: el backend se ponera al dia en el siguiente alta.
  }
}

/**
 * Lee del backend si este dispositivo ya tiene la biometria activa, para no
 * volver a ofrecerla en cada inicio de sesion. Si no hay respuesta se deja
 * el valor que ya habia.
 */
export async function syncBiometricsFromServer(): Promise<void> {
  if (!getToken()) return;
  try {
    const [deviceId, devices] = await Promise.all([getDeviceId(), listDevices()]);
    biometricsEnabled = devices.some((d) => d.deviceId === deviceId && d.biometricEnabled);
  } catch {
    // Se queda con el valor local.
  }
}

export function isBiometricsEnabled(): boolean {
  return biometricsEnabled;
}

// TODO API: preferencias de notificaciones.
export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  await mockDelay(150);
  return notificationPreferences;
}

// TODO API: guardar preferencias de notificaciones.
export async function saveNotificationPreferences(
  preferences: NotificationPreferences,
): Promise<{ ok: boolean }> {
  await mockDelay(400);
  notificationPreferences = { ...preferences };
  return { ok: true };
}
