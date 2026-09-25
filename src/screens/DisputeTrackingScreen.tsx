import React from "react";
import { Clock } from "lucide-react-native";

import { InfoCard, StatusScreen, TransactionRow } from "../components/ui";
import { tokens } from "../theme/colors";
import { Transaction } from "../types/app";

type Props = {
  t: any;
  /** Movimientos con apelacion enviada */
  appealed: Transaction[];
  onBack: () => void;
  onOpen: (id: string) => void;
};

/** Seguimiento de reportes: las apelaciones en revision, desde la pantalla 2. */
export default function DisputeTrackingScreen({ t, appealed, onBack, onOpen }: Props) {
  return (
    <StatusScreen
      testID="disputeTracking"
      showBack
      onBack={onBack}
      backTestID="disputeTracking.backButton"
      backAccessibilityLabel={t.back}
      icon={Clock}
      title={t.disputeTracking}
      subtitle={t.disputeTrackingDesc}
    >
      {appealed.length === 0 ? (
        <InfoCard testID="disputeTracking.emptyCard" text={t.noDisputes} />
      ) : (
        appealed.map((item) => (
          <TransactionRow
            key={item.id}
            testID={`disputeTracking.item.${item.id}`}
            title={item.label}
            date={item.date}
            status={t.appealInReview}
            statusColor={tokens.warningText}
            amount={item.amount}
            currency="USD"
            onPress={() => onOpen(item.id)}
          />
        ))
      )}
    </StatusScreen>
  );
}
