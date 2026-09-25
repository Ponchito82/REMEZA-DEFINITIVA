import React from "react";
import { StyleSheet, Text } from "react-native";
import { CreditCard } from "lucide-react-native";

import { PaymentCardRow, StatusScreen } from "../../components/ui";
import { textStyles } from "../../theme/typography";

type Props = {
  t: any;
  last4: string;
  blocking: boolean;
  onBack: () => void;
  onConfirm: () => void;
};

/** Confirmar bloqueo de tarjeta (pantalla 48). */
export default function BlockCardConfirmScreen({ t, last4, blocking, onBack, onConfirm }: Props) {
  return (
    <StatusScreen
      testID="blockCard"
      showBack
      onBack={onBack}
      backTestID="blockCard.backButton"
      backAccessibilityLabel={t.back}
      icon={CreditCard}
      iconBadge="x"
      title={t.blockCardTitle}
      subtitle={t.blockCardSubtitle}
      primary={{
        testID: "blockCard.confirmButton",
        title: t.blockCardButton,
        loading: blocking,
        onPress: onConfirm,
      }}
      secondary={{ testID: "blockCard.cancelButton", title: t.cancel, onPress: onBack }}
    >
      <PaymentCardRow last4={last4} type={t.cardTypeDebit} />
      <Text style={[textStyles.subtitle, styles.text]}>{t.blockCardInfo}</Text>
    </StatusScreen>
  );
}

const styles = StyleSheet.create({
  text: {
    marginTop: 8,
  },
});
