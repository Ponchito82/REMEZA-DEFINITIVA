import React from "react";
import { Landmark } from "lucide-react-native";

import { BankAccountCard, InfoCard, StatusScreen } from "../../components/ui";
import { BankAccount } from "../../mocks/remeza";
import { last4 } from "../../utils/bank";

type Props = {
  t: any;
  account: BankAccount;
  unlinking: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/** ¿Desvincular cuenta bancaria? (pantalla 29) */
export default function UnlinkBankConfirmScreen({ t, account, unlinking, onConfirm, onCancel }: Props) {
  return (
    <StatusScreen
      testID="unlinkBank"
      icon={Landmark}
      iconBadge="x"
      title={t.unlinkTitle}
      subtitle={t.unlinkSubtitle}
      primary={{
        testID: "unlinkBank.confirmButton",
        title: t.unlinkConfirm,
        loading: unlinking,
        onPress: onConfirm,
      }}
      secondary={{
        testID: "unlinkBank.cancelButton",
        title: t.cancel,
        tone: "danger",
        onPress: onCancel,
      }}
    >
      <BankAccountCard
        bankName={account.bankName}
        accountType={t[account.typeKey]}
        last4={last4(account.clabe)}
      />
      <InfoCard title={t.unlinkWarnTitle} text={t.unlinkWarnText} />
    </StatusScreen>
  );
}
