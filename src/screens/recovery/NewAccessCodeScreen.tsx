import React, { useState } from "react";
import { Lock } from "lucide-react-native";

import { RequirementList, StatusScreen, StrengthMeter, TextField } from "../../components/ui";
import { accessCodeChecks } from "../../utils/validation";

type Props = {
  t: any;
  saving: boolean;
  onSubmit: (code: string) => void;
};

const digitsOnly = (text: string) => text.replace(/\D/g, "").slice(0, 6);

/**
 * Crea un nuevo codigo de acceso (pantalla 23, "Crea una nueva contrasena" en
 * el PDF). Las reglas son las del codigo de 6 digitos de la app.
 */
export default function NewAccessCodeScreen({ t, saving, onSubmit }: Props) {
  const [code, setCode] = useState("");
  const [confirm, setConfirm] = useState("");

  const checks = accessCodeChecks(code);
  const matches = code.length === 6 && code === confirm;
  const valid = checks.sixDigits && checks.notRepeated && checks.notSequential && matches;

  const levelLabel =
    checks.level >= 4 ? t.strengthStrong : checks.level >= 2 ? t.strengthMedium : t.strengthWeak;

  return (
    <StatusScreen
      testID="newAccessCode"
      keyboard
      icon={Lock}
      title={t.newCodeTitle}
      subtitle={t.newCodeSubtitle}
      primary={{
        testID: "newAccessCode.submitButton",
        title: t.updateAccessCode,
        loading: saving,
        disabled: !valid,
        onPress: () => onSubmit(code),
      }}
    >
      <TextField
        testID="newAccessCode.newInput"
        leftIcon={Lock}
        placeholder={t.newAccessCode}
        value={code}
        onChangeText={(text) => setCode(digitsOnly(text))}
        keyboardType="number-pad"
        maxLength={6}
        secureTextEntry
      />
      <TextField
        testID="newAccessCode.confirmInput"
        leftIcon={Lock}
        placeholder={t.confirmNewAccessCode}
        value={confirm}
        onChangeText={(text) => setConfirm(digitsOnly(text))}
        keyboardType="number-pad"
        maxLength={6}
        secureTextEntry
      />
      <StrengthMeter level={checks.level} label={t.codeStrength} levelLabel={levelLabel} />
      <RequirementList
        testID="newAccessCode.requirements"
        items={[
          { key: "six", label: t.req6Digits, met: checks.sixDigits },
          { key: "repeated", label: t.reqNotRepeated, met: checks.notRepeated },
          { key: "sequential", label: t.reqNotSequential, met: checks.notSequential },
          { key: "match", label: t.reqMatch, met: matches },
        ]}
      />
    </StatusScreen>
  );
}
