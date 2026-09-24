import React, { useState } from "react";
import { Lock, Mail, Phone, Search } from "lucide-react-native";

import { ListRow, StatusScreen } from "../../components/ui";

export type RecoveryMethod = "email" | "phone" | "support";

type Props = {
  t: any;
  onBack: () => void;
  onChoose: (method: RecoveryMethod) => void;
};

/**
 * Recupera tu acceso (pantalla 21). Se elige un metodo y "Continuar" lleva a
 * el. El titulo es el mismo texto que ya usaba la recuperacion por telefono
 * ("Recover access code"), que es lo que buscan las pruebas al tocar el enlace
 * del Login.
 */
export default function RecoverAccessScreen({ t, onBack, onChoose }: Props) {
  const [method, setMethod] = useState<RecoveryMethod>("email");

  const options: { key: RecoveryMethod; icon: typeof Mail; title: string; subtitle: string }[] = [
    { key: "email", icon: Mail, title: t.recoverByEmail, subtitle: t.recoverByEmailDesc },
    { key: "phone", icon: Phone, title: t.recoverByPhone, subtitle: t.recoverByPhoneDesc },
    { key: "support", icon: Lock, title: t.recoverBySupport, subtitle: t.recoverBySupportDesc },
  ];

  return (
    <StatusScreen
      testID="recoverAccess"
      showBack
      onBack={onBack}
      backTestID="recoverAccess.backButton"
      backAccessibilityLabel={t.back}
      icon={Search}
      title={t.forgotAccessCodeTitle}
      subtitle={t.recoverSubtitle}
      primary={{
        testID: "recoverAccess.continueButton",
        title: t.commonContinue,
        showArrow: true,
        onPress: () => onChoose(method),
      }}
    >
      {options.map((option) => (
        <ListRow
          key={option.key}
          testID={`recoverAccess.option.${option.key}`}
          icon={option.icon}
          title={option.title}
          subtitle={option.subtitle}
          selected={method === option.key}
          onPress={() => setMethod(option.key)}
        />
      ))}
    </StatusScreen>
  );
}
