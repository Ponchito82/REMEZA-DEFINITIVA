import React, { useState } from "react";
import { Lock, Mail } from "lucide-react-native";

import { StatusScreen, TextField } from "../../components/ui";
import { isValidEmail } from "../../utils/validation";

type Props = {
  t: any;
  sending: boolean;
  onBack: () => void;
  onSend: (email: string) => void;
  onSupport: () => void;
};

/** Recupera tu cuenta por correo (pantalla 20). */
export default function RecoverAccountScreen({ t, sending, onBack, onSend, onSupport }: Props) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSend = () => {
    const value = email.trim();
    if (!isValidEmail(value)) {
      setError(t.requiredEmail);
      return;
    }
    setError("");
    onSend(value);
  };

  return (
    <StatusScreen
      testID="recoverAccount"
      keyboard
      showBack
      onBack={onBack}
      backTestID="recoverAccount.backButton"
      backAccessibilityLabel={t.back}
      icon={Lock}
      title={t.recoverAccountTitle}
      subtitle={t.recoverAccountSubtitle}
      primary={{
        testID: "recoverAccount.sendButton",
        title: t.sendCode,
        showArrow: true,
        loading: sending,
        onPress: handleSend,
      }}
      link={{
        testID: "recoverAccount.supportLink",
        prompt: t.needHelp,
        title: t.contactSupportLink,
        onPress: onSupport,
      }}
    >
      <TextField
        testID="recoverAccount.emailInput"
        leftIcon={Mail}
        placeholder={t.recoverEmailPlaceholder}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        error={error || undefined}
      />
    </StatusScreen>
  );
}
