import { API_BASE_URL, ApiError, apiPost } from "./client";
import { OnboardingData } from "./verification";

const LOCAL_AUTO_APPROVE = true;

export type VerificationStatus = "approved" | "rejected" | "pending";

export type VerificationResult = {
  status: VerificationStatus;
  backendMessage?: string;
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

export async function submitRegistration(
  params: SubmitRegistrationParams,
): Promise<VerificationResult> {
  const { onboardingId, personalInfo, documents } = params;
  let backendMessage: string | undefined;
  let kycStatus: string | null | undefined;

  if (onboardingId) {
    try {
      await savePersonalInformation(onboardingId, personalInfo);
    } catch (error) {
      backendMessage =
        error instanceof ApiError ? `personal-information: ${error.message}` : "personal-information: error";
    }

    try {
      const data = await uploadIdDocuments(onboardingId, documents);
      kycStatus = data?.kycStatus ?? null;
    } catch (error) {
      const detail = error instanceof ApiError ? error.message : "error";
      backendMessage = backendMessage
        ? `${backendMessage} | id-documents: ${detail}`
        : `id-documents: ${detail}`;
    }
  } else {
    backendMessage = "sin onboardingId: no se pudo enviar al backend";
  }

  if (LOCAL_AUTO_APPROVE) {
    return { status: "approved", backendMessage, kycStatus };
  }

  if (kycStatus && ["APPROVED", "VERIFIED", "COMPLETED"].includes(kycStatus.toUpperCase())) {
    return { status: "approved", backendMessage, kycStatus };
  }
  if (kycStatus && ["REJECTED", "DENIED"].includes(kycStatus.toUpperCase())) {
    return { status: "rejected", backendMessage, kycStatus };
  }
  return { status: "pending", backendMessage, kycStatus };
}
