import React from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { DollarSign, TrendingUp, Percent, Coins } from "lucide-react-native";

import {
  Button,
  CloseButton,
  FieldLabel,
  GlassBanner,
  ScreenHeader,
  TextField,
} from "../components/ui";
import { AvailableBalanceCard, BeneficiaryItem } from "../components/remeza";
import { spacing, screenPadding } from "../theme/spacing";
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
}: Props) {
  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <CloseButton testID="sendMoney-backButton" onPress={() => setView("dashboard")} />

        <ScreenHeader
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
            keyboardType="number-pad"
          />

          <TextField
            label={t.exchangeRate}
            leftIcon={TrendingUp}
            value={`1 USD = $${exchangeRate.toFixed(2)} MXN`}
            editable={false}
          />

          <TextField
            label={t.commission}
            leftIcon={Percent}
            value={t.commissionDetail}
            editable={false}
          />

          <TextField
            testID="sendMoney-amountToReceive"
            label={t.amountToReceiveMxn}
            leftIcon={Coins}
            value={`$${amountToReceiveMxn.toFixed(2)} MXN`}
            editable={false}
          />

          <View>
            <FieldLabel>{t.beneficiaryList}</FieldLabel>

            <View style={styles.beneficiaries}>
              {beneficiaries.map((beneficiary) => (
                <BeneficiaryItem
                  key={beneficiary.id}
                  testID={`sendMoney-beneficiaryCard-${beneficiary.id}`}
                  name={beneficiary.fullName}
                  phone={beneficiary.phone}
                  city={`${beneficiary.city}, ${beneficiary.state}`}
                  selected={selectedBeneficiaryId === beneficiary.id}
                  onPress={() => setSelectedBeneficiaryId(beneficiary.id)}
                />
              ))}
            </View>
          </View>

          <Button
            testID="sendMoney-sendButton"
            title={t.sendTransfer}
            onPress={handleSendMoney}
            radius="pill"
            disabled={!selectedBeneficiaryId}
          />

          {sendMoneySuccess ? (
            <GlassBanner testID="sendMoney-successMessage" tone="info" message={t.moneySent} />
          ) : null}

          {sendMoneyError ? (
            <GlassBanner testID="sendMoney-errorMessage" message={sendMoneyError} />
          ) : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: screenPadding,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginTop: spacing.xxl,
  },
  balance: {
    marginBottom: spacing.xxl,
  },
  form: {
    gap: spacing.lg,
  },
  beneficiaries: {
    gap: spacing.md,
  },
});
