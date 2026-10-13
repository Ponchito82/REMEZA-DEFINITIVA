import { Transaction, TransactionStatus } from "../types/app";
import { apiGet, apiPost } from "./client";

/** Un envio (remesa) del cliente. */
type OrderData = {
  id: string;
  folio: string | null;
  createdOn: string | number[] | null;
  /** Nulo mientras siga en pie; el estatus conserva hasta donde llego. */
  cancelledOn: string | number[] | null;
  status: string;
  beneficiaryName: string;
  maskedClabe: string;
  usdAmount: number;
  mxnAmount: number;
  fee: number;
  exchangeRate: number;
};

/** Jackson puede mandar la fecha como texto ISO o como [anio, mes, dia, ...]. */
function toEpoch(value: string | number[] | null): number {
  if (Array.isArray(value)) {
    const [y, mo, d, h = 0, mi = 0, s = 0] = value;
    return new Date(y, mo - 1, d, h, mi, s).getTime();
  }
  const parsed = value ? new Date(value).getTime() : NaN;
  return Number.isNaN(parsed) ? 0 : parsed;
}

function formatDate(epoch: number): string {
  if (!epoch) return "";
  return new Date(epoch)
    .toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
    .toUpperCase();
}

function toStatus(status: string): TransactionStatus {
  const value = status.toUpperCase();
  if (value === "COMPLETED" || value === "SENT") return "completed";
  if (value === "CREATED" || value === "BOOKED" || value === "IN PROCESS") return "pending";
  return "cancelled";
}

function money(value: number): string {
  return Number(value).toFixed(2);
}

export function fromOrder(order: OrderData): Transaction {
  const createdAt = toEpoch(order.createdOn);
  const mxnAmount = Number(order.mxnAmount);
  return {
    id: `order-${order.id}`,
    type: "remittance",
    label: `${order.beneficiaryName} / ${mxnAmount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} MXN`,
    amount: `-$${money(order.usdAmount)}`,
    amountUsd: Number(order.usdAmount),
    date: formatDate(createdAt),
    status: order.cancelledOn ? "cancelled" : toStatus(order.status),
    provider: "remeza",
    reference: order.folio ?? `RMZ-${order.id.replace(/-/g, "").slice(0, 6).toUpperCase()}`,
    createdAt,
    mxnAmount,
    exchangeRate: Number(order.exchangeRate),
    beneficiary: order.beneficiaryName,
  };
}

/**
 * Envios (remesas) del cliente, del mas reciente al mas viejo. Salen de
 * /api/v1/orders, que trae beneficiario, CLABE, montos, tipo de cambio y estado.
 * /api/v1/transactions (tabla local) no se usa en pantallas: repite las ordenes
 * con menos datos y se queda para soporte. Los movimientos de la tarjeta van
 * aparte, en cardTransactions.ts.
 */
export async function getHistory(limit = 50): Promise<Transaction[]> {
  const orders = await apiGet<OrderData[]>(`/api/v1/orders?limit=${limit}`);

  return (orders ?? []).map(fromOrder).sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
}

/** Lo que el backend guardo al registrar la orden. */
export type CreatedOrder = {
  id: string;
  folio: string;
  status: string;
  usdAmount: number;
  mxnAmount: number;
  fee: number;
  bitsoExchangeRate: number;
  customerExchangeRate: number;
};

/**
 * Registra el envio. Solo se manda a quien y cuanto: el tipo de cambio, la
 * comision y los pesos los calcula el backend, y la app muestra los que regresa.
 * Registrar no mueve el dinero ni descuenta el saldo.
 */
export function createOrder(beneficiaryId: string, usdAmount: number): Promise<CreatedOrder> {
  return apiPost<CreatedOrder>("/api/v1/orders", { beneficiaryId, usdAmount });
}

/** Cancela el envio mientras siga dentro de los 30 minutos; el backend lo decide. */
export async function cancelOrder(orderId: string): Promise<Transaction> {
  return fromOrder(await apiPost<OrderData>(`/api/v1/orders/${orderId}/cancel`, undefined));
}
