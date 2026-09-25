import React, { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { Mail } from "lucide-react-native";

import { OtpInput, StatusScreen } from "../../components/ui";
import { textStyles } from "../../theme/typography";

type Props = {
  t: any;
  email: string;
  verifying: boolean;
  onBack: () => void;
  onVerify: (code: string) => void;
  onResend: () => void;
};

const EMPTY = ["", "", "", "", "", ""];

/** Ingresa el codigo que llego al correo (pantalla 22). */
export default function EnterEmailCodeScreen({ t, email, verifying, onBack, onVerify, onResend }: Props) {
  const [digits, setDigits] = useState<string[]>(EMPTY);
  const code = digits.join("");

  return (
    <StatusScreen
      testID="enterEmailCode"
      keyboard
      showBack
      onBack={onBack}
      backTestID="enterEmailCode.backButton"
      backAccessibilityLabel={t.back}
      icon={Mail}
      title={t.enterCodeTitle}
      subtitle={t.enterCodeSubtitle}
      primary={{
        testID: "enterEmailCode.verifyButton",
        title: t.verifyCodeButton,
        showArrow: true,
        loading: verifying,
        disabled: code.length !== 6,
        onPress: () => onVerify(code),
      }}
      link={{
        testID: "enterEmailCode.resendLink",
        prompt: t.didntGetCode,
        title: t.resendCode,
        onPress: () => {
          setDigits(EMPTY);
          onResend();
        },
      }}
    >
      <Text style={[textStyles.rowTitle, styles.email]}>{email}</Text>
      <OtpInput testID="enterEmailCode.code" size="lg" value={digits} onChange={setDigits} />
      <Text style={[textStyles.caption, styles.center]}>{t.codeValidity}</Text>
    </StatusScreen>
  );
}

const styles = StyleSheet.create({
  email: {
    textAlign: "center",
    marginTop: -8,
    marginBottom: 12,
  },
  center: {
    textAlign: "center",
  },
});
