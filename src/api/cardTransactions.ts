import { apiGet } from "./client";

/**
 * Un movimiento de la tarjeta tal como lo entrega BlackPay (compras, retiros,
 * recargas). Todavia no trae `direction`: no se sabe si el signo viene en
 * `amount` o en `transactionType`, asi que la app los muestra tal cual y no
 * adivina si el dinero entra o sale.
 */
type CardTransactionData = {
  transId: string | null;
  date: string | number[] | null;
  businessDate: string | number[] | null;
  amount: number | null;
  description: string | null;
  acceptorName: string | null;
  transactionType: string | null;
};

type CardStatementData = {
  from: string | number[];
  to: string | number[];
  currentBalance: number | null;
  /** Tarjeta de la que salieron los movimientos (la primera activa). */
  cardId?: string | null;
  transactions: CardTransactionData[] | null;
};

/** Resumen de una tarjeta del cliente, de GET /api/v1/cards. */
type CardSummary = {
  id: string;
  /** Ya viene enmascarado por el backend, solo con los ultimos 4 */
  cardNumber: string | null;
  type: string | null;
  active: boolean;
};

export type CardMovement = {
  id: string;
  title: string;
  /** Fecha ya formateada */
  date: string;
  /** Monto tal como lo manda BlackPay, sin signo inventado */
  amount: string;
  transactionType: string;
};

export type CardStatement = {
  from: string;
  to: string;
  currentBalance: number | null;
  /** De cual tarjeta son los movimientos, si el backend ya lo manda */
  card: { last4: string | null; type: "physical" | "virtual" | null } | null;
  movements: CardMovement[];
};

/** Estado de la consulta, compartido por la pantalla y la vista previa de Actividad. */
export type CardMovementsState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; statement: CardStatement };

/** Jackson puede mandar la fecha como texto ISO o como [anio, mes, dia, ...]. */
function toEpoch(value: string | number[] | null): number {
  if (Array.isArray(value)) {
    const [y, mo, d, h = 0, mi = 0, s = 0] = value;
    return new Date(y, mo - 1, d, h, mi, s).getTime();
  }
  if (!value) return 0;
  // "yyyy-MM-dd" solo se lee como hora local, no como UTC (que en Mexico lo
  // correria al dia anterior).
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00`).getTime()
    : new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

function formatDate(epoch: number): string {
  if (!epoch) return "";
  return new Date(epoch)
    .toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
    .toUpperCase();
}

/** Fecha local en yyyy-MM-dd, el formato que pide el endpoint. */
function isoDay(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function toMovement(tx: CardTransactionData, index: number): CardMovement {
  const epoch = toEpoch(tx.date) || toEpoch(tx.businessDate);
  const amount = tx.amount === null ? "" : `$${Number(tx.amount).toFixed(2)}`;
  return {
    id: tx.transId ?? `${epoch}-${index}`,
    title: tx.acceptorName?.trim() || tx.description?.trim() || tx.transactionType || "",
    date: formatDate(epoch),
    amount,
    transactionType: tx.transactionType ?? "",
  };
}

function cardLabel(card: CardSummary | undefined): CardStatement["card"] {
  if (!card) return null;
  const digits = (card.cardNumber ?? "").replace(/\D/g, "");
  const type = (card.type ?? "").toUpperCase();
  return {
    last4: digits.length >= 4 ? digits.slice(-4) : null,
    type: type.includes("PHYS") ? "physical" : type.includes("VIRT") ? "virtual" : null,
  };
}

/** Periodo por defecto acordado con backend: los ultimos 30 dias, hoy incluido. */
export const DEFAULT_PERIOD_DAYS = 30;

/**
 * Movimientos de la tarjeta en un periodo, leidos de BlackPay por el backend.
 * Si BlackPay no contesta, el backend responde 503 y aqui se lanza el
 * ApiError: la pantalla lo muestra como error, nunca como lista vacia.
 */
export async function getCardStatement(days = DEFAULT_PERIOD_DAYS): Promise<CardStatement> {
  const to = new Date();
  const from = new Date(to);
  from.setDate(to.getDate() - (days - 1));

  const data = await apiGet<CardStatementData>(
    `/api/v1/transactions/card?from=${isoDay(from)}&to=${isoDay(to)}`,
  );

  // Solo para etiquetar la pantalla; si falla, se muestran los movimientos sin etiqueta.
  let card: CardStatement["card"] = null;
  if (data.cardId) {
    const cards = await apiGet<CardSummary[]>("/api/v1/cards").catch(() => null);
    card = cardLabel(cards?.find((c) => c.id === data.cardId));
  }

  return {
    from: formatDate(toEpoch(data.from)),
    to: formatDate(toEpoch(data.to)),
    currentBalance: data.currentBalance === null ? null : Number(data.currentBalance),
    card,
    movements: (data.transactions ?? [])
      .map((tx, index) => ({ tx, index, epoch: toEpoch(tx.date) || toEpoch(tx.businessDate) }))
      .sort((a, b) => b.epoch - a.epoch)
      .map(({ tx, index }) => toMovement(tx, index)),
  };
}
