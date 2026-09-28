import React, { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { Mail, MessageSquareMore } from "lucide-react-native";

import { InfoCard, OtpInput, StatusScreen } from "../../components/ui";
import type { TwoFactorMethod } from "../../services/securitySettings";
import { textStyles } from "../../theme/typography";

type Props = {
  t: any;
  method: TwoFactorMethod;
  destination: string;
  verifying: boolean;
  wrongCode: boolean;
  onBack: () => void;
  onVerify: (code: string) => void;
  onResend: () => void;
};

const EMPTY = ["", "", "", "", "", ""];

/** Codigo de verificacion del metodo que se esta activando (SMS o correo). */
export default function TwoFactorCodeScreen({
  t,
  method,
  destination,
  verifying,
  wrongCode,
  onBack,
  onVerify,
  onResend,
}: Props) {
  const isSms = method === "sms";
  const [digits, setDigits] = useState<string[]>(EMPTY);
  const code = digits.join("");

  return (
    <StatusScreen
      testID={`twoFactorCode.${method}`}
      keyboard
      showBack
      onBack={onBack}
      backTestID={`twoFactorCode.${method}.backButton`}
      backAccessibilityLabel={t.back}
      icon={isSms ? MessageSquareMore : Mail}
      title={isSms ? t.twoFactorSms : t.twoFactorEmail}
      subtitle={isSms ? t.twoFactorCodeSubtitleSms : t.twoFactorCodeSubtitleEmail}
      primary={{
        testID: `twoFactorCode.${method}.verifyButton`,
        title: t.verifyCodeButton,
        showArrow: true,
        loading: verifying,
        disabled: code.length !== 6,
        onPress: () => onVerify(code),
      }}
      link={{
        testID: `twoFactorCode.${method}.resendLink`,
        prompt: t.didntGetCode,
        title: t.resendCode,
        onPress: () => {
          setDigits(EMPTY);
          onResend();
        },
      }}
    >
      <Text style={[textStyles.rowTitle, styles.destination]}>{destination}</Text>
      <OtpInput testID={`twoFactorCode.${method}.code`} size="lg" value={digits} onChange={setDigits} />
      {wrongCode ? (
        <InfoCard
          testID={`twoFactorCode.${method}.errorCard`}
          tone="danger"
          text={t.invalidAccessCode}
        />
      ) : null}
    </StatusScreen>
  );
}

const styles = StyleSheet.create({
  destination: {
    textAlign: "center",
    marginTop: -8,
    marginBottom: 12,
  },
});
