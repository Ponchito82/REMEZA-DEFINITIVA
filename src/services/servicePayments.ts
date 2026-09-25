import { MOCK_SERVICE_PROVIDERS, ServiceProvider } from "../mocks/remeza";
import { mockDelay } from "./mockDelay";

export type ServicePaymentReceipt = {
  providerId: string;
  reference: string;
  amount: number;
  paidAt: number;
  folio: string;
};

// TODO API: catalogo de servicios pagables.
export async function getServiceProviders(): Promise<ServiceProvider[]> {
  await mockDelay(200);
  return MOCK_SERVICE_PROVIDERS;
}

// TODO API: pagar el servicio con el proveedor.
export async function payService(
  providerId: string,
  reference: string,
  amount: number,
): Promise<{ ok: true; receipt: ServicePaymentReceipt } | { ok: false }> {
  await mockDelay(1800);
  const paidAt = Date.now();
  const folio = paidAt.toString(36).toUpperCase().slice(-10);
  return { ok: true, receipt: { providerId, reference, amount, paidAt, folio } };
}
