import { apiGet } from "./client";

/** Saldo de la cuenta, leido de BlackPay por la primera tarjeta activa del cliente. */
export type BalanceData = {
  availableBalance: number;
  ledgerBalance: number;
  currency: string;
  cardId: string;
};

/**
 * Tipo de cambio USD -> MXN. `customerExchangeRate` ya trae la comision
 * descontada: es el que se le muestra y se le aplica al cliente.
 */
export type ExchangeRateData = {
  bitsoExchangeRate: number;
  customerExchangeRate: number;
};

export function getBalance(): Promise<BalanceData> {
  return apiGet<BalanceData>("/api/v1/balance");
}

export function getExchangeRate(): Promise<ExchangeRateData> {
  return apiGet<ExchangeRateData>("/api/v1/assets/exchange-rate");
}
