import React from "react";
import { CalendarCheck, CircleCheck } from "lucide-react-native";

import { BankAccountCard, DetailRow, StatusScreen } from "../../components/ui";
import { BankAccount } from "../../mocks/remeza";
import { last4 } from "../../utils/bank";
import { formatDateTime } from "../../utils/date";
import { Language } from "../../types/app";

type Props = {
  t: any;
  language: Language;
  account: BankAccount;
  onBack: () => void;
  onContinue: () => void;
};

/** Banco conectado (pantalla 7). */
export default function BankConnectedScreen({ t, language, account, onBack, onContinue }: Props) {
  return (
    <StatusScreen
      testID="bankConnected"
      showBack
      onBack={onBack}
      backTestID="bankConnected.backButton"
      backAccessibilityLabel={t.back}
      icon={CircleCheck}
      title={t.bankConnectedTitle}
      subtitle={t.bankConnectedSubtitle}
      primary={{
        testID: "bankConnected.continueButton",
        title: t.commonContinue,
        showArrow: true,
        onPress: onContinue,
      }}
    >
      <BankAccountCard
        bankName={account.bankName}
        accountType={t[account.typeKey]}
        last4={last4(account.clabe)}
        onPress={onContinue}
      />
      <DetailRow
        icon={CalendarCheck}
        label={t.connectedOn}
        value={formatDateTime(account.connectedAt, language)}
      />
    </StatusScreen>
  );
}
