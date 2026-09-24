import React from "react";
import { CreditCard, FileText, Landmark, User } from "lucide-react-native";

import { BankAccountCard, DetailRow, StatusScreen } from "../../components/ui";
import { BankAccount } from "../../mocks/remeza";
import { formatClabe, last4 } from "../../utils/bank";

type Props = {
  t: any;
  account: BankAccount;
  onBack: () => void;
  onUnlink: () => void;
};

/**
 * Cuenta bancaria vinculada (pantalla 28). Sin "Editar informacion": el PDF
 * no trae pantalla para eso y los datos vienen del banco.
 */
export default function LinkedBankAccountScreen({ t, account, onBack, onUnlink }: Props) {
  return (
    <StatusScreen
      testID="linkedBank"
      showBack
      onBack={onBack}
      backTestID="linkedBank.backButton"
      backAccessibilityLabel={t.back}
      icon={Landmark}
      title={t.linkedBankTitle}
      subtitle={t.linkedBankSubtitle}
      secondary={{
        testID: "linkedBank.unlinkButton",
        title: t.unlinkAccount,
        tone: "danger",
        onPress: onUnlink,
      }}
    >
      <BankAccountCard
        bankName={account.bankName}
        accountType={t[account.typeKey]}
        last4={last4(account.clabe)}
        statusLabel={t.statusConnected}
      />
      <DetailRow icon={User} label={t.accountHolder} value={account.holder} />
      <DetailRow icon={FileText} label={t.accountTypeLabel} value={t[account.typeKey]} />
      <DetailRow icon={Landmark} label={t.commonBank} value={account.bankName} />
      <DetailRow
        icon={CreditCard}
        label={t.clabe}
        value={formatClabe(account.clabe)}
        right="copy"
        copiedLabel={t.commonCopied}
      />
    </StatusScreen>
  );
}
