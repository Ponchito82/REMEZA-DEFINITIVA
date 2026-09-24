import React, { useState } from "react";
import { CircleAlert, Lock } from "lucide-react-native";

import { InfoCard, StatusScreen, StrengthMeter, TextField } from "../../components/ui";
import { accessCodeChecks, isWeakPasscode } from "../../utils/validation";

type Props = {
  t: any;
  saving: boolean;
  onBack: () => void;
  onSubmit: (currentCode: string, newCode: string) => void;
};

const digitsOnly = (text: string) => text.replace(/\D/g, "").slice(0, 6);

/** Cambiar codigo de acceso (pantalla 58, "Cambiar contrasena" en el PDF). */
export default function ChangeAccessCodeScreen({ t, saving, onBack, onSubmit }: Props) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const checks = accessCodeChecks(next);

  const handleSubmit = () => {
    setError("");
    if (current.length !== 6) return setError(t.requiredCurrentCode);
    if (isWeakPasscode(next)) return setError(t.weakAccessCode);
    if (next === current) return setError(t.sameAsCurrentCode);
    if (next !== confirm) return setError(t.accessCodeMismatch);
    onSubmit(current, next);
  };

  return (
    <StatusScreen
      testID="changeAccessCode"
      keyboard
      showBack
      onBack={onBack}
      backTestID="changeAccessCode.backButton"
      backAccessibilityLabel={t.back}
      icon={Lock}
      title={t.changeCodeTitle}
      subtitle={t.changeCodeSubtitle}
      primary={{
        testID: "changeAccessCode.submitButton",
        title: t.updateAccessCode,
        loading: saving,
        onPress: handleSubmit,
      }}
    >
      <TextField
        testID="changeAccessCode.currentInput"
        leftIcon={Lock}
        placeholder={t.currentAccessCode}
        value={current}
        onChangeText={(text) => setCurrent(digitsOnly(text))}
        keyboardType="number-pad"
        maxLength={6}
        secureTextEntry
      />
      <TextField
        testID="changeAccessCode.newInput"
        leftIcon={Lock}
        placeholder={t.newAccessCode}
        value={next}
        onChangeText={(text) => setNext(digitsOnly(text))}
        keyboardType="number-pad"
        maxLength={6}
        secureTextEntry
        helperText={t.accessCodeHelper}
      />
      <StrengthMeter level={checks.level} />
      <TextField
        testID="changeAccessCode.confirmInput"
        leftIcon={Lock}
        placeholder={t.confirmNewAccessCode}
        value={confirm}
        onChangeText={(text) => setConfirm(digitsOnly(text))}
        keyboardType="number-pad"
        maxLength={6}
        secureTextEntry
      />

      {error ? (
        <InfoCard testID="changeAccessCode.errorCard" icon={CircleAlert} tone="danger" text={error} />
      ) : (
        <InfoCard text={t.accessCodeRulesInfo} />
      )}
    </StatusScreen>
  );
}
