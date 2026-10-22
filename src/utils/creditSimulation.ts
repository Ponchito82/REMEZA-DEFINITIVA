/**
 * Movimientos simulados de la tarjeta de credito (aun no hay backend de credito).
 * Todo sale del limite elegido, asi que siempre cuadra:
 *   utilizado = compras - pagos = 70% del limite,  pago = 40% del limite.
 * Con limite $500: utilizado $350, un pago de $200 y compras por $550.
 */

export type CreditMovementKind = "purchase" | "payment";

export type CreditMovementIcon =
  | "bag"
  | "food"
  | "payment"
  | "cart"
  | "fuel"
  | "shirt"
  | "pharmacy"
  | "electronics";

export type CreditMovement = {
  id: string;
  kind: CreditMovementKind;
  /** Clave de traduccion del nombre del comercio */
  nameKey: string;
  icon: CreditMovementIcon;
  /** Monto en dolares, siempre positivo; el signo lo da `kind` */
  amountUsd: number;
  at: number;
};

const DAY_MS = 24 * 60 * 60 * 1000;
const round5 = (value: number) => Math.round(value / 5) * 5;

/** Compras: peso relativo (sobre $550) y hace cuantos dias; el pago va entre ellas. */
const PURCHASES: { nameKey: string; icon: CreditMovementIcon; weight: number; daysAgo: number }[] = [
  { nameKey: "creditMerchantAmazon", icon: "bag", weight: 120, daysAgo: 1 },
  { nameKey: "creditMerchantRestaurant", icon: "food", weight: 85, daysAgo: 3 },
  { nameKey: "creditMerchantSupermarket", icon: "cart", weight: 45, daysAgo: 8 },
  { nameKey: "creditMerchantGas", icon: "fuel", weight: 60, daysAgo: 11 },
  { nameKey: "creditMerchantClothing", icon: "shirt", weight: 95, daysAgo: 16 },
  { nameKey: "creditMerchantPharmacy", icon: "pharmacy", weight: 70, daysAgo: 19 },
  { nameKey: "creditMerchantElectronics", icon: "electronics", weight: 75, daysAgo: 22 },
];
const WEIGHT_TOTAL = PURCHASES.reduce((sum, item) => sum + item.weight, 0);

export function buildCreditSimulation(
  limitUsd: number,
  now: number = Date.now(),
): { movements: CreditMovement[]; usedUsd: number } {
  const usedUsd = round5(limitUsd * 0.7);
  const paymentUsd = round5(limitUsd * 0.4);
  const purchasesTotal = usedUsd + paymentUsd;

  let assigned = 0;
  const purchases: CreditMovement[] = PURCHASES.map((item, index) => {
    const isLast = index === PURCHASES.length - 1;
    const amountUsd = isLast
      ? purchasesTotal - assigned
      : round5((item.weight / WEIGHT_TOTAL) * purchasesTotal);
    assigned += amountUsd;
    return {
      id: `purchase-${index}`,
      kind: "purchase",
      nameKey: item.nameKey,
      icon: item.icon,
      amountUsd,
      at: now - item.daysAgo * DAY_MS,
    };
  });

  const payment: CreditMovement = {
    id: "payment-0",
    kind: "payment",
    nameKey: "creditMerchantPayment",
    icon: "payment",
    amountUsd: paymentUsd,
    at: now - 5 * DAY_MS,
  };

  return {
    movements: [...purchases, payment].sort((a, b) => b.at - a.at),
    usedUsd,
  };
}

/** Dia del mes en que corta el estado de cuenta. */
export const CREDIT_CUTOFF_DAY = 10;

/** Proxima fecha de corte (dia 10): este mes si aun no pasa, si no el siguiente. */
export function nextCreditCutoff(now: number = Date.now()): number {
  const base = new Date(now);
  const thisMonth = new Date(base.getFullYear(), base.getMonth(), CREDIT_CUTOFF_DAY, 23, 59, 59);
  if (thisMonth.getTime() >= now) return thisMonth.getTime();
  return new Date(base.getFullYear(), base.getMonth() + 1, CREDIT_CUTOFF_DAY, 23, 59, 59).getTime();
}

/** Fecha de pago: ultimo dia del mes en curso (dia 0 del mes siguiente). */
export function creditPaymentDue(now: number = Date.now()): number {
  const base = new Date(now);
  return new Date(base.getFullYear(), base.getMonth() + 1, 0, 23, 59, 59).getTime();
}
