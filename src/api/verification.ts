import { ApiError, apiPost } from "./client";


const REAL_VERIFICATION_ENABLED = false;

function simulatedDelay(): Promise<void> {
  return new Promise((resolve) => setTimeout(() => resolve(), 400));
}

export type OnboardingData = {
  id: string;
  status: string;
  currentStep: string;
  kycStatus: string | null;
};

export type OtpSource = "onboarding" | "standalone";

export const RESEND_COOLDOWN_MS = 60_000;

export class SendThrottledError extends Error {
  remainingMs: number;

  constructor(remainingMs: number) {
    super("Espera antes de volver a enviar el código.");
    this.remainingMs = remainingMs;
  }
}

const inFlight = new Set<string>();
const lastSentAt = new Map<string, number>();

async function guardedSend<T>(key: string, send: () => Promise<T>): Promise<T> {
  if (inFlight.has(key)) {
    throw new SendThrottledError(RESEND_COOLDOWN_MS);
  }

  const previous = lastSentAt.get(key);
  if (previous !== undefined) {
    const elapsed = Date.now() - previous;
    if (elapsed < RESEND_COOLDOWN_MS) {
      throw new SendThrottledError(RESEND_COOLDOWN_MS - elapsed);
    }
  }

  inFlight.add(key);
  try {
    const result = await send();
    lastSentAt.set(key, Date.now());
    return result;
  } finally {
    inFlight.delete(key);
  }
}

export function remainingCooldownMs(key: string): number {
  const previous = lastSentAt.get(key);
  if (previous === undefined) return 0;
  return Math.max(0, RESEND_COOLDOWN_MS - (Date.now() - previous));
}

export function sendKeyForPhone(phoneNumber: string): string {
  return `sms:${phoneNumber}`;
}

export function sendKeyForEmail(email: string): string {
  return `email:${email}`;
}

export function startOnboarding(phoneNumberE164: string): Promise<OnboardingData> {
  if (!REAL_VERIFICATION_ENABLED) {
    return simulatedDelay().then(() => ({
      id: `local-onboarding-${Date.now()}`,
      status: "STARTED",
      currentStep: "PHONE_NUMBER_REGISTERED",
      kycStatus: null,
    }));
  }

  return guardedSend(sendKeyForPhone(phoneNumberE164), () =>
    apiPost<OnboardingData>("/api/v1/onboarding/start", { phoneNumber: phoneNumberE164 }, false),
  );
}

export function verifyOnboardingPhone(
  onboardingId: string,
  confirmationCode: string,
): Promise<OnboardingData> {
  if (!REAL_VERIFICATION_ENABLED) {
    return simulatedDelay().then(() => ({
      id: onboardingId,
      status: "STARTED",
      currentStep: "PHONE_NUMBER_VERIFIED",
      kycStatus: null,
    }));
  }

  return apiPost<OnboardingData>(
    `/api/v1/onboarding/${encodeURIComponent(onboardingId)}/phone/verify`,
    { confirmationCode },
    false,
  );
}

export function resendCodeBySms(phoneNumberE164: string, email = ""): Promise<string> {
  if (!REAL_VERIFICATION_ENABLED) {
    return simulatedDelay().then(() => "Code verification send");
  }

  const query = `phoneNumber=${encodeURIComponent(phoneNumberE164)}&email=${encodeURIComponent(email)}`;
  return guardedSend(sendKeyForPhone(phoneNumberE164), () =>
    apiPost<string>(`/api/verification/send?${query}`, undefined, false),
  );
}

export function checkVerificationCode(
  phoneNumberE164: string,
  code: string,
): Promise<string> {
  if (!REAL_VERIFICATION_ENABLED) {
    return simulatedDelay().then(() => "Valid verification code");
  }

  const query = `phoneNumber=${encodeURIComponent(phoneNumberE164)}&code=${encodeURIComponent(code)}`;
  return apiPost<string>(`/api/verification/check?${query}`, undefined, false);
}

export function saveOnboardingEmail(
  onboardingId: string,
  email: string,
): Promise<OnboardingData> {
  if (!REAL_VERIFICATION_ENABLED) {
    return simulatedDelay().then(() => ({
      id: onboardingId,
      status: "STARTED",
      currentStep: "EMAIL_REGISTERED",
      kycStatus: null,
    }));
  }

  return guardedSend(sendKeyForEmail(email), () =>
    apiPost<OnboardingData>(
      `/api/v1/onboarding/${encodeURIComponent(onboardingId)}/email/save`,
      { email },
      false,
    ),
  );
}

export function verifyOnboardingEmail(
  onboardingId: string,
  confirmationCode: string,
): Promise<OnboardingData> {
  if (!REAL_VERIFICATION_ENABLED) {
    return simulatedDelay().then(() => ({
      id: onboardingId,
      status: "STARTED",
      currentStep: "EMAIL_VERIFIED",
      kycStatus: null,
    }));
  }

  return apiPost<OnboardingData>(
    `/api/v1/onboarding/${encodeURIComponent(onboardingId)}/email/verify`,
    { confirmationCode },
    false,
  );
}

export function verificationErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof SendThrottledError) {
    const seconds = Math.ceil(error.remainingMs / 1000);
    return `${error.message} (${seconds}s)`;
  }
  if (error instanceof ApiError && error.message) return error.message;
  return fallback;
}
