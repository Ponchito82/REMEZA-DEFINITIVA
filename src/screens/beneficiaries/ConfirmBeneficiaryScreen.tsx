import React from "react";
import { UserCheck } from "lucide-react-native";

import { InfoCard, StatusScreen } from "../../components/ui";
import { Beneficiary } from "../../types/app";
import BeneficiaryDetails from "./BeneficiaryDetails";

type Props = {
  t: any;
  draft: Pick<Beneficiary, "fullName" | "phone" | "city" | "state" | "email" | "clabe">;
  onBack: () => void;
  onConfirm: () => void;
};

/** Confirmar datos del beneficiario (pantalla 34). */
export default function ConfirmBeneficiaryScreen({ t, draft, onBack, onConfirm }: Props) {
  return (
    <StatusScreen
      testID="beneficiaryConfirm"
      showBack
      onBack={onBack}
      backTestID="beneficiaryConfirm.backButton"
      backAccessibilityLabel={t.back}
      icon={UserCheck}
      iconVariant="ring"
      title={t.confirmBeneficiaryTitle}
      subtitle={t.confirmBeneficiarySubtitle}
      primary={{
        testID: "beneficiaryConfirm.confirmButton",
        title: t.confirmAndSave,
        onPress: onConfirm,
      }}
      secondary={{
        testID: "beneficiaryConfirm.editButton",
        title: t.editInformation,
        tone: "danger",
        onPress: onBack,
      }}
    >
      <BeneficiaryDetails t={t} beneficiary={draft} testIDPrefix="beneficiaryConfirm" />
      <InfoCard text={t.confirmBeneficiaryInfo} />
    </StatusScreen>
  );
}
