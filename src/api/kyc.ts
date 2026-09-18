export type SubmitKycRequest = {
  customerId: string;
  publicToken: string;
  legalName: string;
  documentType: "passport" | "driver_license" | "national_id";
  documentNumber: string;
};

export type SubmitKycResponse = {
  kycId: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
};

export async function submitKyc(_request: SubmitKycRequest): Promise<SubmitKycResponse> {
  await new Promise((resolve) => setTimeout(() => resolve(undefined), 500));

  return {
    kycId: `local-kyc-${Date.now()}`,
    status: "pending",
    submittedAt: new Date().toISOString(),
  };
}
