import React, { useState } from "react";

import ServicePaymentsScreen from "../screens/services/ServicePaymentsScreen";
import ServiceReferenceScreen from "../screens/services/ServiceReferenceScreen";
import ServiceAmountScreen from "../screens/services/ServiceAmountScreen";
import {
  ServicePaidScreen,
  ServicePaymentFailedScreen,
  ServiceProcessingScreen,
  ServiceReceiptScreen,
} from "../screens/services/ServiceResultScreens";
import { ServiceProvider } from "../mocks/remeza";
import { payService, ServicePaymentReceipt } from "../services/servicePayments";
import { useStepStack } from "../hooks/useStepStack";
import { formatDateTime, formatReceiptDate } from "../utils/date";
import type { ReceiptData } from "../components/ui";
import { Language } from "../types/app";

type Step = "providers" | "reference" | "amount" | "processing" | "paid" | "receipt" | "failed";

type Props = {
  t: any;
  language: Language;
  availableUsdBalance: number;
  /** Descuenta el saldo y registra el movimiento en `App` */
  onPaid: (amount: number, concept: string, folio: string) => void;
  onExit: () => void;
};

const money = (value: number) =>
  `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** Pago de servicios: 17 -> 51 -> 52 -> 53 -> 54 (-> 55) o 56. */
export default function ServicePaymentFlow({ t, language, availableUsdBalance, onPaid, onExit }: Props) {
  const { step, push, replace, reset, pop } = useStepStack<Step>(
    "providers",
    onExit,
    (current) => current === "processing",
  );
  const [provider, setProvider] = useState<ServiceProvider | null>(null);
  const [reference, setReference] = useState("");
  const [amountRaw, setAmountRaw] = useState("");
  const [amount, setAmount] = useState(0);
  const [receipt, setReceipt] = useState<ServicePaymentReceipt | null>(null);

  const providerName = provider ? `${t[provider.nameKey]} (${provider.company})` : "";

  const pay = async (value: number) => {
    if (!provider) return;
    replace("processing");
    const result = await payService(provider.id, reference, value);
    if (result.ok) {
      setReceipt(result.receipt);
      onPaid(value, `${providerName} · ${reference}`, result.receipt.folio);
      reset("paid");
    } else {
      replace("failed");
    }
  };

  const summary = receipt
    ? [
        { key: "service", label: t.commonService, value: providerName },
        { key: "reference", label: t.referenceLabel, value: receipt.reference },
        { key: "amount", label: t.amountLabel, value: money(receipt.amount) },
        { key: "date", label: t.dateLabel, value: formatDateTime(receipt.paidAt, language) },
      ]
    : [];

  const receiptData: ReceiptData | null = receipt
    ? {
        operationLabel: t.receiptOperationType,
        operation: t.receiptServiceOperation,
        dateText: formatReceiptDate(receipt.paidAt, language),
        amountLabel: t.receiptAmount,
        amount: receipt.amount.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        currency: "USD",
        groups: [
          [
            { label: t.commonService, value: providerName },
            { label: t.referenceLabel, value: receipt.reference },
          ],
          [
            { label: t.receiptDate, value: formatReceiptDate(receipt.paidAt, language) },
            { label: t.commonFolio, value: receipt.folio },
          ],
        ],
      }
    : null;

  switch (step) {
    case "reference":
      return (
        <ServiceReferenceScreen
          t={t}
          initialReference={reference}
          onBack={pop}
          onContinue={(value) => {
            setReference(value);
            push("amount");
          }}
        />
      );
    case "amount":
      return (
        <ServiceAmountScreen
          t={t}
          availableBalance={availableUsdBalance}
          initialAmount={amountRaw}
          onBack={pop}
          onContinue={(value, raw) => {
            setAmount(value);
            setAmountRaw(raw);
            pay(value);
          }}
        />
      );
    case "processing":
      return <ServiceProcessingScreen t={t} />;
    case "paid":
      return (
        <ServicePaidScreen
          t={t}
          summary={summary}
          onDone={onExit}
          onViewReceipt={() => push("receipt")}
        />
      );
    case "receipt":
      return receiptData ? <ServiceReceiptScreen t={t} data={receiptData} onBack={pop} /> : null;
    case "failed":
      return (
        <ServicePaymentFailedScreen
          t={t}
          onRetry={() => pay(amount)}
          onBack={() => replace("amount")}
        />
      );
    default:
      return (
        <ServicePaymentsScreen
          t={t}
          onBack={pop}
          onSelect={(selected) => {
            setProvider(selected);
            setReference("");
            setAmountRaw("");
            push("reference");
          }}
        />
      );
  }
}
