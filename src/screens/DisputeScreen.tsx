import React, { useState } from "react";
import { Clock, FileText, FileX, MessageSquareWarning } from "lucide-react-native";

import { ListRow, StatusScreen } from "../components/ui";

export type DisputeOption = "report" | "cancel" | "tracking";

type Props = {
  t: any;
  onBack: () => void;
  onChoose: (option: DisputeOption) => void;
};

/**
 * Cancelar o disputar (pantalla 2). Ya no esta en el menu: se abre desde el
 * Centro de ayuda. Cada opcion lleva a lo que ya existe (Transacciones con su
 * Apelar y su Cancelar) o al seguimiento de apelaciones.
 */
export default function DisputeScreen({ t, onBack, onChoose }: Props) {
  const [option, setOption] = useState<DisputeOption>("report");

  const options = [
    { key: "report" as const, icon: MessageSquareWarning, title: t.disputeReport, subtitle: t.disputeReportDesc },
    { key: "cancel" as const, icon: FileX, title: t.disputeCancel, subtitle: t.disputeCancelDesc },
    { key: "tracking" as const, icon: Clock, title: t.disputeTracking, subtitle: t.disputeTrackingDesc },
  ];

  return (
    <StatusScreen
      testID="dispute"
      showBack
      onBack={onBack}
      backTestID="dispute.backButton"
      backAccessibilityLabel={t.back}
      icon={FileText}
      title={t.disputeTitle}
      subtitle={t.disputeSubtitle}
      primary={{
        testID: "dispute.continueButton",
        title: t.commonContinue,
        showArrow: true,
        onPress: () => onChoose(option),
      }}
    >
      {options.map((item) => (
        <ListRow
          key={item.key}
          testID={`dispute.option.${item.key}`}
          icon={item.icon}
          title={item.title}
          subtitle={item.subtitle}
          selected={option === item.key}
          onPress={() => setOption(item.key)}
        />
      ))}
    </StatusScreen>
  );
}
