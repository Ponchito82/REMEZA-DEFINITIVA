import { Fingerprint, ScanFace } from "lucide-react-native";

import type { BiometryKind } from "../../services/biometrics";

/** Icono de la biometria: rostro para Face ID, huella para Android. */
export const biometryIcon = (kind: BiometryKind) => (kind === "face" ? ScanFace : Fingerprint);

/**
 * Texto que cambia segun la biometria. Las claves llevan el tipo de sufijo
 * (`enableBioTitle_face`, `enableBioTitle_fingerprint`) en screenTranslations.
 */
export const bioText = (t: any, key: string, kind: BiometryKind): string => t[`${key}_${kind}`];
