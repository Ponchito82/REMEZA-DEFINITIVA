import React, { useState } from "react";
import { FileText, ReceiptText } from "lucide-react-native";

import { InfoCard, StatusScreen, TextField } from "../../components/ui";

type Props = {
  t: any;
  initialReference: string;
  onBack: () => void;
  onContinue: (reference: string) => void;
};

const isValidReference = (value: string) => /^[A-Za-z0-9]{6,30}$/.test(value);

/** Capturar referencia de servicio (pantalla 51). */
export default function ServiceReferenceScreen({ t, initialReference, onBack, onContinue }: Props) {
  const [reference, setReference] = useState(initialReference);
  const [touched, setTouched] = useState(false);
  const valid = isValidReference(reference);

  return (
    <StatusScreen
      testID="serviceReference"
      keyboard
      showBack
      onBack={onBack}
      backTestID="serviceReference.backButton"
      backAccessibilityLabel={t.back}
      icon={FileText}
      title={t.serviceRefTitle}
      subtitle={t.serviceRefSubtitle}
      primary={{
        testID: "serviceReference.continueButton",
        title: t.commonContinue,
        disabled: !valid,
        onPress: () => onContinue(reference),
      }}
    >
      <TextField
        testID="serviceReference.input"
        label={t.serviceRefLabel}
        leftIcon={ReceiptText}
        placeholder={t.serviceRefPlaceholder}
        value={reference}
        onChangeText={(text) => setReference(text.replace(/[^A-Za-z0-9]/g, "").slice(0, 30))}
        onBlur={() => setTouched(true)}
        error={touched && reference && !valid ? t.serviceRefInvalid : undefined}
        autoCapitalize="characters"
      />
      <InfoCard text={t.serviceRefInfo} />
    </StatusScreen>
  );
}
