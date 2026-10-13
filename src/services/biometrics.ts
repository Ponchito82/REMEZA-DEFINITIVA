import { Platform } from "react-native";
import ReactNativeBiometrics from "react-native-biometrics";

/** Que biometria se le presenta al usuario: rostro (iOS) o huella (Android). */
export type BiometryKind = "face" | "fingerprint";

/** Por que no se pudo activar: sin sensor/enrolamiento, cancelado o no reconocido. */
export type BiometricsFailure = "unavailable" | "cancelled" | "failed";

export type BiometricsResult = { ok: true } | { ok: false; reason: BiometricsFailure };

const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: false });

/** iOS trabaja con Face ID y Android con huella digital. */
export function defaultBiometryKind(): BiometryKind {
  return Platform.OS === "ios" ? "face" : "fingerprint";
}

/**
 * Tipo real del sensor. En iOS un equipo con boton de inicio usa Touch ID
 * (huella), asi que se respeta lo que reporte el sistema; en Android, o si la
 * consulta falla, se usa el valor por plataforma.
 */
export async function getBiometryKind(): Promise<BiometryKind> {
  try {
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();
    if (available && biometryType === "FaceID") return "face";
    if (available && biometryType === "TouchID") return "fingerprint";
  } catch {
    // Sin modulo nativo o sin sensor: se cae al valor por plataforma.
  }
  return defaultBiometryKind();
}

/**
 * Pide al sistema la autenticacion biometrica (Face ID en iOS, huella en
 * Android). Los datos biometricos nunca salen del dispositivo: solo se
 * recibe si el usuario paso o no la verificacion.
 */
export async function authenticateWithBiometrics(
  promptMessage: string,
  cancelButtonText: string,
): Promise<BiometricsResult> {
  try {
    const { available } = await rnBiometrics.isSensorAvailable();
    if (!available) return { ok: false, reason: "unavailable" };

    const { success } = await rnBiometrics.simplePrompt({ promptMessage, cancelButtonText });
    return success ? { ok: true } : { ok: false, reason: "cancelled" };
  } catch {
    return { ok: false, reason: "failed" };
  }
}

/** Hash corto y estable (djb2) para que el identificador no sea largo. */
function shortHash(value: string): string {
  let hash = 5381;
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) + hash + value.charCodeAt(i)) | 0;
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

/**
 * Identificador de este dispositivo para el backend, armado con lo que el
 * sistema ya expone (marca, modelo y huella de la build en Android). Es estable
 * entre sesiones, pero dos telefonos del mismo modelo y build comparten id.
 * Para uno unico por equipo habria que agregar `react-native-device-info`.
 */
export function getDeviceId(): Promise<string> {
  const constants = Platform.constants as Record<string, unknown>;
  const parts = [
    Platform.OS,
    constants.Brand ?? constants.systemName,
    constants.Model ?? constants.interfaceIdiom,
    constants.Fingerprint ?? constants.osVersion ?? Platform.Version,
  ].map((part) => String(part ?? ""));
  const label = parts.slice(0, 3).join("-").replace(/\s+/g, "_");
  return Promise.resolve(`${label}-${shortHash(parts.join("|"))}`.slice(0, 190));
}
