import React, { useState } from "react";
import { Banknote } from "lucide-react-native";

import { AmountInput, InfoCard, StatusScreen } from "../../components/ui";

type Props = {
  t: any;
  availableBalance: number;
  initialAmount: string;
  onBack: () => void;
  onContinue: (amount: number, raw: string) => void;
};

const money = (value: number) =>
  `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** Ingresar monto del servicio (pantalla 52). Se valida contra el saldo disponible. */
export default function ServiceAmountScreen({
  t,
  availableBalance,
  initialAmount,
  onBack,
  onContinue,
}: Props) {
  const [amount, setAmount] = useState(initialAmount);
  const [error, setError] = useState("");

  const handleContinue = () => {
    const value = Number(amount);
    if (!value || value <= 0 || value > availableBalance) {
      setError(t.serviceAmountInvalid);
      return;
    }
    setError("");
    onContinue(value, amount);
  };

  return (
    <StatusScreen
      testID="serviceAmount"
      keyboard
      showBack
      onBack={onBack}
      backTestID="serviceAmount.backButton"
      backAccessibilityLabel={t.back}
      icon={Banknote}
      title={t.serviceAmountTitle}
      subtitle={t.serviceAmountSubtitle}
      primary={{
        testID: "serviceAmount.continueButton",
        title: t.commonContinue,
        disabled: !Number(amount),
        onPress: handleContinue,
      }}
    >
      <AmountInput
        testID="serviceAmount.input"
        label={t.serviceAmountLabel}
        value={amount}
        onChangeText={setAmount}
        error={error || undefined}
        helper={t.serviceAmountAvailable.replace("{amount}", money(availableBalance))}
      />
      <InfoCard text={t.serviceAmountInfo} />
    </StatusScreen>
  );
}
