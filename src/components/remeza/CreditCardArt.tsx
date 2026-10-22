import React from "react";
import RemezaCardBack from "./RemezaCardBack";

/** Datos de la tarjeta de credito simulada (aun no hay emision real). */
const CREDIT_NUMBER = "4532 1234 5678 1234";
const CREDIT_LAST4 = "1234";
const CREDIT_EXPIRY = "12/29";
const CREDIT_CVV = "123";

type Props = {
  t: any;
  /** Nombre completo del titular. */
  holderName?: string;
  /** Se conservan por compatibilidad con las pantallas; el arte ya indica "Credito". */
  label?: string;
  last4?: string;
};

/** Tarjeta de credito Remeza: mismo arte que la del dashboard, sin borde blanco y con sombra. */
export default function CreditCardArt({ t, holderName }: Props) {
  return (
    <RemezaCardBack
      t={t}
      variant="credit"
      holderName={holderName}
      number={CREDIT_NUMBER}
      last4={CREDIT_LAST4}
      expiry={CREDIT_EXPIRY}
      cvv={CREDIT_CVV}
      showData
      style={{ width: "75%", alignSelf: "center" }}
    />
  );
}
