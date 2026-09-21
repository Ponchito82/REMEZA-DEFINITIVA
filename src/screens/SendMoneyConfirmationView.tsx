import React from "react";
import {
  ScrollView,
  View,
  Text,
  Pressable,
} from "react-native";
import { X, CheckCircle2, AlertCircle, User } from "lucide-react-native";

import { styles } from "../theme/styles";
import { DANGER, PURPLE } from "../theme/colors";
import FormInput from "../components/FormInput";
import MainButton from "../components/MainButton";
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

export default function SendMoneyConfirmationView({
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
  const selectedBeneficiary = beneficiaries.find(
    (b) => b.id === selectedBeneficiaryId
  );

  return (
    <View style={styles.pageScreen}>
      <ScrollView
        contentContainerStyle={styles.pageContent}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          testID="sendMoneyConfirmation-backButton"
          onPress={() => setView("dashboard")}
          style={styles.backButton}
        >
          <X size={24} color="#111827" />
        </Pressable>

        <Text style={styles.pageTitle}>{t.sendMoneyConfirmationTitle}</Text>
        <Text style={styles.pageSubtitle}>{t.sendMoneyConfirmationSubtitle}</Text>

        <View style={styles.stack16}>

          <View style={styles.statusInfoBox}>
            <Text style={styles.statusInfoLabel}>{t.amountToSendUsd}</Text>
            <Text style={styles.statusInfoValue}>${sendAmountUsd} MXN</Text>
          </View>

          <View style={styles.statusInfoBox}>
            <Text style={styles.statusInfoLabel}>{t.exchangeRate}</Text>
            <Text style={styles.statusInfoValue}>1 USD = ${exchangeRate.toFixed(2)} MXN</Text>
          </View>

          <View style={styles.statusInfoBox}>
            <Text style={styles.statusInfoLabel}>{t.commission}</Text>
            <Text style={styles.statusInfoValue}>{t.commissionDetail}</Text>
          </View>

          <View style={styles.statusInfoBox}>
            <Text style={styles.statusInfoLabel}>{t.amountToReceiveMxn}</Text>
            <Text style={styles.statusInfoValue}>${amountToReceiveMxn.toFixed(2)} MXN</Text>
          </View>

          <View>
            <Text style={styles.formLabel}>{t.beneficiaryList}</Text>
            <View style={styles.stack12}>

              <View style={[
                styles.beneficiaryCard,
                styles.beneficiaryCardSelected,
              ]}>
                <View style={styles.beneficiaryIcon}>
                  <User
                    size={20}
                    color={PURPLE}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.beneficiaryName,
                      styles.beneficiaryNameSelected,
                    ]}
                  >
                    {selectedBeneficiary?.fullName}
                  </Text>

                  <Text
                    style={[
                      styles.beneficiaryMeta,
                      styles.beneficiaryMetaSelected,
                    ]}
                  >
                    {selectedBeneficiary?.phone}
                  </Text>

                  <Text
                    style={[
                      styles.beneficiaryMeta,
                      styles.beneficiaryMetaSelected,
                    ]}
                  >
                    {selectedBeneficiary?.city}, {selectedBeneficiary?.state}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <MainButton testID="sendMoneyConfirmation-confirmButton" onPress={handleSendMoney}>
            {t.confirmTransfer}
          </MainButton>

          {sendMoneySuccess && (
            <View testID="sendMoneyConfirmation-successMessage" style={styles.transferSuccessBox}>
              <CheckCircle2 size={18} color="#16A34A" />
              <Text style={styles.transferSuccessText}>
                {t.moneySent}
              </Text>
            </View>
          )}

          {!!sendMoneyError && (
            <View testID="sendMoneyConfirmation-errorMessage" style={styles.errorBox}>
              <AlertCircle size={18} color={DANGER} />
              <Text style={styles.errorText}>
                {sendMoneyError}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}