import React from "react";
import {
  ArrowLeftRight,
  CalendarDays,
  CircleCheck,
  CircleDollarSign,
  CreditCard,
  Landmark,
  User,
} from "lucide-react-native";

import { DetailRow } from "../../components/ui";
import type { DetailRowRight } from "../../components/ui";
import { formatClabe } from "../../utils/bank";
import { formatDateTime } from "../../utils/date";
import { Language } from "../../types/app";

/** Datos de una transferencia, tal como los muestran las pantallas 40 a 44. */
export type TransferSummary = {
  beneficiaryName: string;
  bankName?: string;
  clabe?: string;
  amountUsd: number;
  mxnAmount: number;
  exchangeRate: number;
  at: number;
  /** Folio: solo cuando ya se envio */
  reference?: string;
};

type Field = "beneficiary" | "bank" | "clabe" | "amount" | "rate" | "received" | "date" | "folio";

type Props = {
  t: any;
  language: Language;
  summary: TransferSummary;
  fields: Field[];
  /** Etiqueta del monto: "Monto a enviar", "Monto enviado", "Monto intentado" */
  amountLabel: string;
  /** Accion de editar en el monto (pantalla 40) */
  onEditAmount?: () => void;
  /** Prefijo de los testID de los valores */
  testIDPrefix: string;
};

const usd = (value: number) =>
  `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
const mxn = (value: number) =>
  `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`;

/** Filas de detalle de una transferencia. */
export default function TransferDetails({
  t,
  language,
  summary,
  fields,
  amountLabel,
  onEditAmount,
  testIDPrefix,
}: Props) {
  const rows: Record<
    Field,
    { icon: typeof User; label: string; value?: string; right?: DetailRowRight; onPress?: () => void }
  > = {
    beneficiary: { icon: User, label: t.beneficiary, value: summary.beneficiaryName },
    bank: { icon: Landmark, label: t.commonBank, value: summary.bankName },
    clabe: {
      icon: CreditCard,
      label: t.clabe,
      value: summary.clabe ? formatClabe(summary.clabe) : undefined,
      right: "copy",
    },
    amount: {
      icon: CircleDollarSign,
      label: amountLabel,
      value: usd(summary.amountUsd),
      right: onEditAmount ? "edit" : "none",
      onPress: onEditAmount,
    },
    rate: {
      icon: ArrowLeftRight,
      label: t.exchangeRate,
      value: `1 USD = $${summary.exchangeRate.toFixed(2)} MXN`,
    },
    received: { icon: Landmark, label: t.amountToReceiveMxn, value: mxn(summary.mxnAmount) },
    date: { icon: CalendarDays, label: t.dateTimeLabel, value: formatDateTime(summary.at, language) },
    folio: { icon: CircleCheck, label: t.transactionFolio, value: summary.reference },
  };

  return (
    <>
      {fields.map((field) => {
        const row = rows[field];
        if (!row.value) return null;
        return (
          <DetailRow
            key={field}
            icon={row.icon}
            label={row.label}
            value={row.value}
            right={row.right}
            onPress={row.onPress}
            copiedLabel={t.commonCopied}
            valueTestID={`${testIDPrefix}.${field}`}
          />
        );
      })}
    </>
  );
}
