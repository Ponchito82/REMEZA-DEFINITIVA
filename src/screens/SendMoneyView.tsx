import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CircleAlert, CircleCheck, DollarSign, Send } from "lucide-react-native";

import {
  Avatar,
  InfoCard,
  TextLink,
  KeyValueCard,
  ListRow,
  PrimaryButton,
  ScreenHeader,
  ScreenLayout,
  TextField,
} from "../components/ui";
import { AvailableBalanceCard } from "../components/remeza";
import { textStyles } from "../theme/typography";
import { metrics } from "../theme/radius";
import { spacing } from "../theme/spacing";
import { ViewName } from "../types/app";

type Beneficiary = {
  id: string;
  fullName: string;
  phone: string;
  city: string;
  state: string;
};

type Props = {
  t: any;
  setView: (view: ViewName) => void;

  availableUsdBalance: number;
  sendAmountUsd: string;
  setSendAmountUsd: (value: string) => void;

  exchangeRate: number;
  amountToReceiveMxn: number;

  beneficiaries: Beneficiary[];

  selectedBeneficiaryId: string;
  setSelectedBeneficiaryId: (value: string) => void;

  sendMoneySuccess: boolean;
  sendMoneyError: string;

  handleSendMoney: () => void;
  /** Historial de envios (14) */
  onOpenHistory: () => void;
};

/**
 * Enviar dinero: lo visual de la pantalla 13, con la eleccion de destinatario
 * de la 32 en la misma pantalla. El saldo es el de `App`, asi que refleja los
 * reembolsos de remesas canceladas.
 */
export default function SendMoneyView({
  t,
  setView,
  availableUsdBalance,
  sendAmountUsd,
  setSendAmountUsd,
  exchangeRate,
  amountToReceiveMxn,
  beneficiaries,
  selectedBeneficiaryId,
  setSelectedBeneficiaryId,
  sendMoneySuccess,
  sendMoneyError,
  handleSendMoney,
  onOpenHistory,
}: Props) {
  return (
    <ScreenLayout
      keyboard
      showBack
      onBack={() => setView("dashboard")}
      backTestID="sendMoney-backButton"
      backAccessibilityLabel={t.back}
    >
      <ScreenHeader
        icon={Send}
        title={t.sendMoneyTitle}
        subtitle={t.sendMoneySubtitle}
        style={styles.header}
      />

      <AvailableBalanceCard
        testID="sendMoney-availableBalance"
        label={t.availableUsdBalance}
        amount={`$${availableUsdBalance.toFixed(2)}`}
        style={styles.balance}
      />

      <View style={styles.form}>
        <TextField
          testID="sendMoney-amountInput"
          label={t.amountToSendUsd}
          leftIcon={DollarSign}
          value={sendAmountUsd}
          onChangeText={(value) => setSendAmountUsd(value.replace(/[^0-9.]/g, ""))}
          keyboardType="decimal-pad"
        />

        <KeyValueCard
          items={[
            {
              key: "exchangeRate",
              label: t.exchangeRate,
              value: `1 USD = $${exchangeRate.toFixed(2)} MXN`,
            },
            { key: "commission", label: t.commission, value: t.commissionDetail },
            {
              key: "amountToReceive",
              label: t.amountToReceiveMxn,
              value: `$${amountToReceiveMxn.toFixed(2)} MXN`,
              testID: "sendMoney-amountToReceive",
            },
          ]}
        />

        <View style={styles.beneficiaries}>
          <Text style={textStyles.overline}>{t.beneficiaryList}</Text>

          {beneficiaries.map((beneficiary) => (
            <ListRow
              key={beneficiary.id}
              testID={`sendMoney-beneficiaryCard-${beneficiary.id}`}
              accessibilityLabel={beneficiary.fullName}
              leading={<Avatar name={beneficiary.fullName} size={metrics.rowIconCircle} />}
              title={beneficiary.fullName}
              subtitle={`${beneficiary.phone}\n${beneficiary.city}, ${beneficiary.state}`}
              right="radio"
              selected={selectedBeneficiaryId === beneficiary.id}
              onPress={() => setSelectedBeneficiaryId(beneficiary.id)}
            />
          ))}
        </View>

        <PrimaryButton
          testID="sendMoney-sendButton"
          title={t.sendTransfer}
          showArrow
          onPress={handleSendMoney}
          disabled={!selectedBeneficiaryId}
        />

        {sendMoneySuccess ? (
          <InfoCard
            testID="sendMoney-successMessage"
            icon={CircleCheck}
            tone="success"
            text={t.moneySent}
          />
        ) : null}

        {sendMoneyError ? (
          <InfoCard
            testID="sendMoney-errorMessage"
            icon={CircleAlert}
            tone="danger"
            text={sendMoneyError}
          />
        ) : null}

        <TextLink
          testID="sendMoney.historyLink"
          title={t.viewTransferHistory}
          onPress={onOpenHistory}
        />
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: spacing.lg,
  },
  balance: {
    marginBottom: spacing.xl,
  },
  form: {
    gap: spacing.lg,
  },
  beneficiaries: {
    gap: metrics.rowGap,
  },
});
