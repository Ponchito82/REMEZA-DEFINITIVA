import React, { useState } from "react";
import { CircleAlert, Clock } from "lucide-react-native";

import { InfoCard, OtpInput, StatusScreen } from "../../components/ui";

type Props = {
  t: any;
  verifying: boolean;
  onBack: () => void;
  onRetry: (code: string) => void;
  onResend: () => void;
};

const EMPTY = ["", "", "", "", "", ""];

/**
 * Codigo incorrecto (pantalla 25). Se puede escribir el codigo de nuevo aqui
 * mismo; "Intentar de nuevo" lo vuelve a validar.
 */
export default function WrongCodeScreen({ t, verifying, onBack, onRetry, onResend }: Props) {
  const [digits, setDigits] = useState<string[]>(EMPTY);
  const code = digits.join("");

  return (
    <StatusScreen
      testID="wrongCode"
      keyboard
      showBack
      onBack={onBack}
      backTestID="wrongCode.backButton"
      backAccessibilityLabel={t.back}
      icon={CircleAlert}
      iconVariant="ring"
      iconTone="danger"
      title={t.wrongCodeTitle}
      subtitle={t.wrongCodeSubtitle}
      primary={{
        testID: "wrongCode.retryButton",
        title: t.commonRetry,
        loading: verifying,
        disabled: code.length !== 6,
        onPress: () => onRetry(code),
      }}
      link={{
        testID: "wrongCode.resendLink",
        prompt: t.didntGetCode,
        title: t.resendCode,
        onPress: () => {
          setDigits(EMPTY);
          onResend();
        },
      }}
    >
      <OtpInput testID="wrongCode.code" size="lg" value={digits} onChange={setDigits} error={!code} />
      <InfoCard icon={Clock} title={t.codeValidity} text={t.codeValidityText} />
    </StatusScreen>
  );
}
