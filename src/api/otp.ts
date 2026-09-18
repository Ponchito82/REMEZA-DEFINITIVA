export type ResendOtpRequest = {
  phoneNumber: string;
};

export type ResendOtpResponse = {
  otpId: string;
  expiresInMs: number;
};

export type VerifyOtpRequest = {
  otpId: string;
  code: string;
};

export type VerifyOtpResponse = {
  verified: boolean;
};

export async function resendOtp(_request: ResendOtpRequest): Promise<ResendOtpResponse> {
  await new Promise((resolve) => setTimeout(() => resolve(undefined), 500));

  return {
    otpId: `local-otp-${Date.now()}`,
    expiresInMs: 5 * 60 * 1000,
  };
}

export async function verifyOtp(request: VerifyOtpRequest): Promise<VerifyOtpResponse> {
  await new Promise((resolve) => setTimeout(() => resolve(undefined), 500));

  return {
    verified: request.code === "123456",
  };
}
