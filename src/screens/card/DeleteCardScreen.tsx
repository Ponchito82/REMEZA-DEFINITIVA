import React from "react";
import { Trash2 } from "lucide-react-native";

import { InfoCard, PaymentCardRow, StatusScreen } from "../../components/ui";

type Props = {
  t: any;
  last4: string;
  deleting: boolean;
  onBack: () => void;
  onConfirm: () => void;
};

/**
 * Eliminar tarjeta (pantalla 50), con el texto corregido: el PDF decia "ya no
 * estaras disponible para realizar transacciones".
 */
export default function DeleteCardScreen({ t, last4, deleting, onBack, onConfirm }: Props) {
  return (
    <StatusScreen
      testID="deleteCard"
      showBack
      onBack={onBack}
      backTestID="deleteCard.backButton"
      backAccessibilityLabel={t.back}
      icon={Trash2}
      title={t.deleteCardTitle}
      subtitle={t.deleteCardSubtitle}
      primary={{
        testID: "deleteCard.confirmButton",
        title: t.deleteCardButton,
        loading: deleting,
        onPress: onConfirm,
      }}
      secondary={{ testID: "deleteCard.cancelButton", title: t.cancel, onPress: onBack }}
    >
      <PaymentCardRow last4={last4} type={t.cardTypeDebit} />
      <InfoCard text={t.deleteCardInfo} />
    </StatusScreen>
  );
}
