import React from "react";
import { Check } from "lucide-react-native";

import { Avatar, ListRow, StatusScreen } from "../../components/ui";
import { metrics } from "../../theme/radius";
import { bankFromClabe, last4 } from "../../utils/bank";
import { Beneficiary } from "../../types/app";
import BeneficiaryActions from "./BeneficiaryActions";

type Props = {
  t: any;
  beneficiary: Beneficiary;
  onSend: () => void;
  onToggleFavorite: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDone: () => void;
  onAddAnother: () => void;
};

/**
 * Beneficiario agregado (pantallas 31, 35 y 37: una sola). El subtitulo es el
 * mismo texto de exito que ya existia y que buscan las pruebas.
 */
export default function BeneficiaryAddedScreen({
  t,
  beneficiary,
  onSend,
  onToggleFavorite,
  onEdit,
  onDelete,
  onDone,
  onAddAnother,
}: Props) {
  const bank = bankFromClabe(beneficiary.clabe);
  const account = beneficiary.clabe ? `•••• ${last4(beneficiary.clabe)}` : "";

  return (
    <StatusScreen
      testID="beneficiaryAdded"
      icon={Check}
      iconVariant="ring"
      title={t.beneficiaryAddedTitle}
      subtitle={t.beneficiarySaved}
      primary={{ testID: "beneficiaryAdded.doneButton", title: t.commonDone, onPress: onDone }}
      secondary={{
        testID: "beneficiaryAdded.addAnotherButton",
        title: t.addAnotherBeneficiary,
        onPress: onAddAnother,
      }}
    >
      <ListRow
        leading={<Avatar name={beneficiary.fullName} size={metrics.rowIconCircle} />}
        title={beneficiary.fullName}
        subtitle={[bank, account].filter(Boolean).join(" · ") || beneficiary.phone}
        right="none"
      />
      <BeneficiaryActions
        t={t}
        favorite={beneficiary.favorite}
        onSend={onSend}
        onToggleFavorite={onToggleFavorite}
        onEdit={onEdit}
        onDelete={onDelete}
        testIDPrefix="beneficiaryAdded"
      />
    </StatusScreen>
  );
}
