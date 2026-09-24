import React from "react";
import { View, StyleSheet } from "react-native";
import { CircleAlert, CircleCheck, Send } from "lucide-react-native";

import {
  Avatar,
  InfoCard,
  KeyValueCard,
  ListRow,
  PrimaryButton,
  ScreenHeader,
  ScreenLayout,
} from "../components/ui";
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
};

/**
 * Resultado del envio, con lo visual de la pantalla 42. La logica no cambia:
 * se llega aqui con el envio ya hecho y "Confirmar" vuelve a llamar a
 * `handleSendMoney`, como esperan los specs.
 */
export default function SendMoneyConfirmationView({
  t,
  setView,
  sendAmountUsd,
  exchangeRate,
  amountToReceiveMxn,
  beneficiaries,
  selectedBeneficiaryId,
  sendMoneySuccess,
  sendMoneyError,
  handleSendMoney,
}: Props) {
  const selectedBeneficiary = beneficiaries.find((b) => b.id === selectedBeneficiaryId);

  return (
    <ScreenLayout
      showBack
      onBack={() => setView("dashboard")}
      backTestID="sendMoneyConfirmation-backButton"
      backAccessibilityLabel={t.back}
    >
      <ScreenHeader
        icon={sendMoneySuccess ? CircleCheck : Send}
        iconVariant={sendMoneySuccess ? "ring" : "filled"}
        iconTone={sendMoneySuccess ? "success" : "default"}
        title={t.sendMoneyConfirmationTitle}
        subtitle={t.sendMoneyConfirmationSubtitle}
        style={styles.header}
      />

      <View style={styles.stack}>
        {sendMoneySuccess ? (
          <InfoCard
            testID="sendMoneyConfirmation-successMessage"
            icon={CircleCheck}
            tone="success"
            text={t.moneySent}
          />
        ) : null}

        <KeyValueCard
          items={[
            { key: "amountToSend", label: t.amountToSendUsd, value: `$${sendAmountUsd} USD` },
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
            },
          ]}
        />

        {selectedBeneficiary ? (
          <ListRow
            leading={<Avatar name={selectedBeneficiary.fullName} size={metrics.rowIconCircle} />}
            title={selectedBeneficiary.fullName}
            subtitle={`${selectedBeneficiary.phone}\n${selectedBeneficiary.city}, ${selectedBeneficiary.state}`}
            right="none"
          />
        ) : null}

        <PrimaryButton
          testID="sendMoneyConfirmation-confirmButton"
          title={t.confirmTransfer}
          onPress={handleSendMoney}
        />

        {sendMoneyError ? (
          <InfoCard
            testID="sendMoneyConfirmation-errorMessage"
            icon={CircleAlert}
            tone="danger"
            text={sendMoneyError}
          />
        ) : null}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: spacing.lg,
  },
  stack: {
    gap: spacing.lg,
  },
});
