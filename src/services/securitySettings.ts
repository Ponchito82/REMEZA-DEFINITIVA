import {
  MOCK_NOTIFICATION_PREFERENCES,
  NotificationPreferences,
} from "../mocks/remeza";
import { mockDelay } from "./mockDelay";

let twoFactorEnabled = true;
let biometricsEnabled = false;
let notificationPreferences: NotificationPreferences = { ...MOCK_NOTIFICATION_PREFERENCES };

// TODO API: estado de la verificacion en dos pasos.
export async function getTwoFactorEnabled(): Promise<boolean> {
  await mockDelay(150);
  return twoFactorEnabled;
}

// TODO API: activar o desactivar la verificacion en dos pasos.
export async function setTwoFactorEnabled(value: boolean): Promise<boolean> {
  await mockDelay(300);
  twoFactorEnabled = value;
  return twoFactorEnabled;
}

// TODO API: cambiar el codigo de acceso con sesion iniciada.
export async function changeAccessCode(
  _currentCode: string,
  _newCode: string,
): Promise<{ ok: boolean }> {
  await mockDelay(900);
  return { ok: true };
}

/**
 * TODO API: la app no trae aun libreria biometrica (react-native-biometrics o
 * similar). El mock responde exito; la pantalla de fallo (26) se muestra con
 * `ok: false`.
 */
export async function enableBiometrics(): Promise<{ ok: boolean }> {
  await mockDelay(900);
  biometricsEnabled = true;
  return { ok: true };
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
