/**
 * Estados de cuenta de la tarjeta de credito (aun no hay backend de credito).
 * Salen de los movimientos reales de la app: cada corte (dia 10) agrupa los movimientos de su
 * periodo, y el saldo de cierre de un corte es el saldo anterior del siguiente.
 */
import { CREDIT_CUTOFF_DAY } from "./creditSimulation";
import type { CreditMovement } from "./creditSimulation";

export type CreditStatementLine = {
  id: string;
  at: number;
  /** Clave de traduccion del comercio. */
  nameKey: string;
  kind: "purchase" | "payment" | "fee";
  amountUsd: number;
};

export type CreditStatement = {
  id: string;
  /** Fecha de corte, en ms. */
  cutoffAt: number;
  periodStartAt: number;
  openingUsd: number;
  purchasesUsd: number;
  paymentsUsd: number;
  /** Comision por servicio del mes, cobrada al corte (una por mes, no por operacion). */
  feesUsd: number;
  closingUsd: number;
  minPaymentUsd: number;
  /** Compras y pagos del periodo (la comision se agrega en `buildStatementLines`). */
  movements: CreditStatementLine[];
};

/** Comision mensual por servicio de la tarjeta, en dolares. */
export const MONTHLY_SERVICE_FEE_USD = 10;

/** Maximo de cortes hacia atras que se revisan. */
const MAX_STATEMENTS = 6;

const cents = (value: number) => Math.round(value * 100) / 100;

/** Estados de cuenta ya cerrados, del mas reciente al mas antiguo. */
export function buildCreditStatements(
  movements: CreditMovement[],
  now: number = Date.now(),
): CreditStatement[] {
  if (movements.length === 0) return [];
  const earliestAt = Math.min(...movements.map((m) => m.at));
  const base = new Date(now);
  const lastMonth = base.getDate() > CREDIT_CUTOFF_DAY ? base.getMonth() : base.getMonth() - 1;

  // Cortes del mas antiguo al mas reciente, solo desde el que alcanza al primer movimiento.
  const cycles: { cutoffAt: number; periodStartAt: number }[] = [];
  for (let i = 0; i < MAX_STATEMENTS; i++) {
    const cutoffAt = new Date(base.getFullYear(), lastMonth - i, CREDIT_CUTOFF_DAY, 23, 59, 59).getTime();
    const periodStartAt = new Date(base.getFullYear(), lastMonth - i - 1, CREDIT_CUTOFF_DAY + 1).getTime();
    cycles.unshift({ cutoffAt, periodStartAt });
    if (periodStartAt <= earliestAt) break;
  }

  let opening = 0;
  const statements = cycles.map(({ cutoffAt, periodStartAt }) => {
    const lines: CreditStatementLine[] = movements
      .filter((m) => m.at >= periodStartAt && m.at <= cutoffAt)
      .map((m) => ({ id: m.id, at: m.at, nameKey: m.nameKey, kind: m.kind, amountUsd: m.amountUsd }))
      .sort((a, b) => a.at - b.at);
    const purchasesUsd = cents(lines.filter((l) => l.kind === "purchase").reduce((s, l) => s + l.amountUsd, 0));
    const paymentsUsd = cents(lines.filter((l) => l.kind === "payment").reduce((s, l) => s + l.amountUsd, 0));
    const feesUsd = MONTHLY_SERVICE_FEE_USD;
    const closingUsd = cents(opening + purchasesUsd - paymentsUsd + feesUsd);
    const statement: CreditStatement = {
      id: `stmt-${cutoffAt}`,
      cutoffAt,
      periodStartAt,
      openingUsd: opening,
      purchasesUsd,
      paymentsUsd,
      feesUsd,
      closingUsd,
      minPaymentUsd: cents(Math.max(0, closingUsd) * 0.1),
      movements: lines,
    };
    opening = closingUsd;
    return statement;
  });
  return statements.reverse();
}

/** Movimientos del periodo de un estado de cuenta, mas la comision mensual en la fecha de corte. */
export function buildStatementLines(statement: CreditStatement): CreditStatementLine[] {
  const fee: CreditStatementLine = {
    id: `${statement.id}-fee`,
    at: statement.cutoffAt,
    nameKey: "creditStmtServiceFee",
    kind: "fee",
    amountUsd: statement.feesUsd,
  };
  return [...statement.movements, fee].sort((a, b) => a.at - b.at);
}
