import { API_BASE_URL, ApiError, apiPost } from "./client";
import { OnboardingData } from "./verification";

export type VerificationStatus = "approved" | "rejected" | "pending";

export type VerificationResult = {
  status: VerificationStatus;
  kycStatus?: string | null;
};

export type RegistrationPersonalInfo = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  foreignIdType: string;
  foreignId: string;
  gender: string;
  ssn: string;
  email: string;
  addressLine1: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
};

export type RegistrationDocuments = {
  frontFilePath: string;
  backFilePath: string;
};

export type SubmitRegistrationParams = {
  onboardingId: string | null;
  accessCode: string;
  personalInfo: RegistrationPersonalInfo;
  documents: RegistrationDocuments;
};

function fileNameOf(path: string): string {
  const parts = path.split(/[\\/]/);
  return parts[parts.length - 1] || "document.jpg";
}

function mimeTypeOf(path: string): string {
  const name = fileNameOf(path).toLowerCase();
  if (name.endsWith(".png")) return "image/png";
  if (name.endsWith(".webp")) return "image/webp";
  if (name.endsWith(".pdf")) return "application/pdf";
  return "image/jpeg";
}

function toUploadUri(path: string): string {
  return path.startsWith("file://") || path.startsWith("content://") ? path : `file://${path}`;
}

async function saveAccessCode(onboardingId: string, pin: string): Promise<OnboardingData> {
  return apiPost<OnboardingData>(
    `/api/v1/onboarding/${encodeURIComponent(onboardingId)}/pin/save`,
    { pin },
    false,
  );
}

async function savePersonalInformation(
  onboardingId: string,
  info: RegistrationPersonalInfo,
): Promise<OnboardingData> {
  return apiPost<OnboardingData>(
    `/api/v1/onboarding/${encodeURIComponent(onboardingId)}/personal-information/save`,
    info,
    false,
  );
}

async function uploadIdDocuments(
  onboardingId: string,
  documents: RegistrationDocuments,
): Promise<OnboardingData> {
  const form = new FormData();

  form.append("frontFile", {
    uri: toUploadUri(documents.frontFilePath),
    name: fileNameOf(documents.frontFilePath),
    type: mimeTypeOf(documents.frontFilePath),
  } as unknown as Blob);

  form.append("backFile", {
    uri: toUploadUri(documents.backFilePath),
    name: fileNameOf(documents.backFilePath),
    type: mimeTypeOf(documents.backFilePath),
  } as unknown as Blob);

  const response = await fetch(
    `${API_BASE_URL}/api/v1/onboarding/${encodeURIComponent(onboardingId)}/id-documents/upload`,
    {
      method: "POST",
      headers: { Accept: "application/json" },
      body: form,
    },
  );

  const json = await response.json().catch(() => null);

  if (!response.ok || json?.success === false) {
    throw new ApiError(json?.message ?? "No se pudieron enviar los documentos.", response.status);
  }

  return json?.data as OnboardingData;
}

type RegistrationStep = "accessCode" | "personalInfo";

/** Pasos del envio final ya aceptados por el backend, por proceso de registro. */
const completedSteps = new Map<string, Set<RegistrationStep>>();

/**
 * El backend exige este orden: PIN -> datos personales (crea el KYC) -> documentos.
 * El PIN se manda aqui y no al crearlo en el paso 3, porque el backend solo lo
 * acepta con el correo ya verificado. Cada paso depende del anterior, asi que
 * el primer error detiene el envio y sube como ApiError.
 */
export async function submitRegistration(
  params: SubmitRegistrationParams,
): Promise<VerificationResult> {
  const { onboardingId, accessCode, personalInfo, documents } = params;

  if (!onboardingId) {
    throw new ApiError("No se encontró el proceso de registro. Vuelve a empezar.", 0);
  }

  // Cada paso solo se acepta una vez y en su turno: si el KYC o las fotos fallan
  // y la persona reintenta, volver a mandar el PIN lo rechaza el backend con
  // "Email has not been verified" y tapa el error verdadero. Se recuerda hasta
  // donde llego este registro y el reintento retoma desde el paso que fallo.
  const done = (completedSteps.get(onboardingId) ?? new Set<RegistrationStep>());
  completedSteps.set(onboardingId, done);

  if (!done.has("accessCode")) {
    await saveAccessCode(onboardingId, accessCode);
    done.add("accessCode");
  }
  if (!done.has("personalInfo")) {
    await savePersonalInformation(onboardingId, personalInfo);
    done.add("personalInfo");
  }
  const data = await uploadIdDocuments(onboardingId, documents);
  completedSteps.delete(onboardingId);
  const kycStatus = data?.kycStatus ?? null;

  if (kycStatus && ["APPROVED", "VERIFIED", "COMPLETED"].includes(kycStatus.toUpperCase())) {
    return { status: "approved", kycStatus };
  }
  if (kycStatus && ["REJECTED", "DENIED"].includes(kycStatus.toUpperCase())) {
    return { status: "rejected", kycStatus };
  }
  return { status: "pending", kycStatus };
}
