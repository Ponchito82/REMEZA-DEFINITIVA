import { CardSummary, MOCK_CARD } from "../mocks/remeza";
import { mockDelay } from "./mockDelay";

let card: CardSummary & { blocked: boolean; removed: boolean } = {
  ...MOCK_CARD,
  blocked: false,
  removed: false,
};

// TODO API: tarjeta del cliente con su limite de gasto.
export async function getCard() {
  await mockDelay(150);
  return card;
}

// TODO API: guardar el limite de gasto.
export async function saveSpendingLimit(amount: number): Promise<{ ok: boolean }> {
  await mockDelay(700);
  card = { ...card, spendingLimit: amount };
  return { ok: true };
}

// TODO API: bloquear la tarjeta.
export async function blockCard(): Promise<{ ok: boolean }> {
  await mockDelay(900);
  card = { ...card, blocked: true };
  return { ok: true };
}

// TODO API: eliminar la tarjeta de la app.
export async function removeCard(): Promise<{ ok: boolean }> {
  await mockDelay(900);
  card = { ...card, removed: true };
  return { ok: true };
}
