import React, { useEffect, useState } from "react";
import { CircleCheck, CreditCard } from "lucide-react-native";

import { AmountInput, InfoCard, StatusScreen } from "../../components/ui";

type Props = {
  t: any;
  initialLimit: number;
  minLimit: number;
  maxLimit: number;
  saving: boolean;
  saved: boolean;
  onBack: () => void;
  onSave: (amount: number) => void;
};

const money = (value: number) => `$${value.toLocaleString("en-US")}`;

/** Configurar limites de tarjeta (pantalla 47). */
export default function CardLimitsScreen({
  t,
  initialLimit,
  minLimit,
  maxLimit,
  saving,
  saved,
  onBack,
  onSave,
}: Props) {
  const [amount, setAmount] = useState(String(initialLimit));
  const [error, setError] = useState("");

  useEffect(() => setAmount(String(initialLimit)), [initialLimit]);

  const handleSave = () => {
    const value = Number(amount);
    if (!value || value < minLimit || value > maxLimit) {
      setError(t.limitOutOfRange.replace("{min}", money(minLimit)).replace("{max}", money(maxLimit)));
      return;
    }
    setError("");
    onSave(value);
  };

  return (
    <StatusScreen
      testID="cardLimits"
      keyboard
      showBack
      onBack={onBack}
      backTestID="cardLimits.backButton"
      backAccessibilityLabel={t.back}
      icon={CreditCard}
      title={t.cardLimitsTitle}
      subtitle={t.cardLimitsSubtitle}
      primary={{
        testID: "cardLimits.saveButton",
        title: t.saveLimit,
        loading: saving,
        onPress: handleSave,
      }}
    >
      <AmountInput
        testID="cardLimits.amountInput"
        label={t.spendingLimit}
        value={amount}
        onChangeText={setAmount}
        error={error || undefined}
        helper={t.limitRange.replace("{min}", money(minLimit)).replace("{max}", money(maxLimit))}
      />
      {saved ? (
        <InfoCard testID="cardLimits.savedCard" icon={CircleCheck} tone="success" text={t.limitSaved} />
      ) : null}
    </StatusScreen>
  );
}
