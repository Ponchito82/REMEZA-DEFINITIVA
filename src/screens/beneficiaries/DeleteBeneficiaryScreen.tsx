import React from "react";
import { CircleAlert, Trash2 } from "lucide-react-native";

import { Avatar, InfoCard, ListRow, StatusScreen } from "../../components/ui";
import { metrics } from "../../theme/radius";
import { bankFromClabe, last4 } from "../../utils/bank";
import { Beneficiary } from "../../types/app";

type Props = {
  t: any;
  beneficiary: Beneficiary;
  onConfirm: () => void;
  onCancel: () => void;
};

/** Eliminar beneficiario (pantalla 39). */
export default function DeleteBeneficiaryScreen({ t, beneficiary, onConfirm, onCancel }: Props) {
  const bank = bankFromClabe(beneficiary.clabe);
  const account = beneficiary.clabe ? `•••• ${last4(beneficiary.clabe)}` : "";

  return (
    <StatusScreen
      testID="deleteBeneficiary"
      icon={Trash2}
      iconVariant="ring"
      iconTone="danger"
      title={t.deleteBeneficiaryTitle}
      subtitle={t.deleteBeneficiarySubtitle}
      primary={{
        testID: "deleteBeneficiary.confirmButton",
        title: t.deleteBeneficiaryButton,
        tone: "danger",
        onPress: onConfirm,
      }}
      secondary={{ testID: "deleteBeneficiary.cancelButton", title: t.cancel, onPress: onCancel }}
    >
      <ListRow
        leading={<Avatar name={beneficiary.fullName} size={metrics.rowIconCircle} />}
        title={beneficiary.fullName}
        subtitle={[bank, account].filter(Boolean).join("\n") || beneficiary.phone}
        right="none"
      />
      <InfoCard icon={CircleAlert} tone="danger" text={t.deleteBeneficiaryWarn} />
    </StatusScreen>
  );
}
