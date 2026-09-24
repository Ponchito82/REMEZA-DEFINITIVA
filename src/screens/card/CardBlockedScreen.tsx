import React from "react";
import { StyleSheet, Text } from "react-native";
import { Lock } from "lucide-react-native";

import { PaymentCardRow, StatusScreen } from "../../components/ui";
import { textStyles } from "../../theme/typography";

type Props = {
  t: any;
  last4: string;
  onDone: () => void;
};

/** Tarjeta bloqueada (pantalla 49). */
export default function CardBlockedScreen({ t, last4, onDone }: Props) {
  return (
    <StatusScreen
      testID="cardBlocked"
      icon={Lock}
      title={t.cardBlockedTitle}
      subtitle={t.cardBlockedSubtitle}
      primary={{ testID: "cardBlocked.doneButton", title: t.commonUnderstood, onPress: onDone }}
    >
      <PaymentCardRow last4={last4} type={t.cardTypeDebit} />
      <Text style={[textStyles.subtitle, styles.text]}>{t.cardBlockedInfo}</Text>
    </StatusScreen>
  );
}

const styles = StyleSheet.create({
  text: {
    marginTop: 8,
  },
});
