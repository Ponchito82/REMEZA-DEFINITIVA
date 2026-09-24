import { BankAccount, MOCK_BANK_ACCOUNT } from "../mocks/remeza";
import { mockDelay } from "./mockDelay";

/** Estado simulado del backend: si hay una cuenta vinculada. */
let linkedAccount: BankAccount | null = null;

// TODO API: GET de la cuenta bancaria vinculada del cliente.
export async function getLinkedBankAccount(): Promise<BankAccount | null> {
  await mockDelay(200);
  return linkedAccount;
}

// TODO API: iniciar la vinculacion con el agregador bancario.
export async function linkBankAccount(): Promise<{ ok: true; account: BankAccount } | { ok: false }> {
  await mockDelay(1200);
  linkedAccount = { ...MOCK_BANK_ACCOUNT, connectedAt: Date.now() };
  return { ok: true, account: linkedAccount };
}

// TODO API: desvincular la cuenta.
export async function unlinkBankAccount(): Promise<{ ok: boolean }> {
  await mockDelay();
  linkedAccount = null;
  return { ok: true };
}
