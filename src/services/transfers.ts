import { mockDelay } from "./mockDelay";

/**
 * TODO API: enviar la remesa al procesador. El saldo y el registro del
 * movimiento los sigue llevando `App`; esto solo simula la espera de la
 * pantalla "Procesando transferencia" (41).
 */
export async function submitTransfer(_amountUsd: number): Promise<{ ok: boolean }> {
  await mockDelay(1600);
  return { ok: true };
}
