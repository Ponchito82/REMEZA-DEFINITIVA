import React from "react";
import {
  ScrollView,
  View,
  Text,
  Pressable,
} from "react-native";
import { X, CheckCircle2, AlertCircle, User } from "lucide-react-native";

import { styles } from "../theme/styles";
import { DANGER, PURPLE, TEXT_PRIMARY } from "../theme/colors";
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
    <View style={styles.pageScreen}>
      <ScrollView
        contentContainerStyle={styles.pageContent}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          testID="sendMoney-backButton"
          onPress={() => setView("dashboard")}
          style={styles.backButton}
        >
          <X size={24} color="#111827" />
        </Pressable>

        <Text style={styles.pageTitle}>{t.sendMoneyTitle}</Text>
        <Text style={styles.pageSubtitle}>{t.sendMoneySubtitle}</Text>

        <View style={styles.walletCard}>
          <Text style={styles.walletFundsLabel}>
            {t.availableUsdBalance}
          </Text>
          <Text style={styles.walletFundsValue}>
            ${availableUsdBalance.toFixed(2)}
          </Text>
        </View>

        <View style={styles.stack16}>
          <FormInput
            testID="sendMoney-amountInput"
            label={t.amountToSendUsd}
            value={sendAmountUsd}
            onChangeText={(value) =>
              setSendAmountUsd(value.replace(/[^0-9.]/g, ""))
            }
            keyboardType="number-pad"
          />

          <View style={styles.statusInfoBox}>
            <Text style={styles.statusInfoLabel}>{t.exchangeRate}</Text>
            <Text style={styles.statusInfoValue}>
              1 USD = ${exchangeRate.toFixed(2)} MXN
            </Text>
          </View>
          <View style={styles.statusInfoBox}>
            <Text style={styles.statusInfoLabel}>{t.commission}</Text>
            <Text style={styles.statusInfoValue}>{t.commissionDetail}</Text>
          </View>          

          <View style={styles.statusInfoBox}>
            <Text style={styles.statusInfoLabel}>
              {t.amountToReceiveMxn}
            </Text>
            <Text style={styles.statusInfoValue}>
              ${amountToReceiveMxn.toFixed(2)} MXN
            </Text>            
          </View>

          <View>
            <Text style={styles.formLabel}>{t.beneficiaryList}</Text>

            <View style={styles.stack12}>
              {beneficiaries.map((beneficiary) => {
                const selected = selectedBeneficiaryId === beneficiary.id;

                return (
                  <Pressable
                    key={beneficiary.id}
                    testID={`sendMoney-beneficiaryCard-${beneficiary.id}`}
                    onPress={() => setSelectedBeneficiaryId(beneficiary.id)}
                    style={[
                      styles.beneficiaryCard,
                      selected && styles.beneficiaryCardSelected,
                    ]}
                  >
                    <View style={styles.beneficiaryIcon}>
                      <User
                        size={20}
                        color={selected ? TEXT_PRIMARY : PURPLE}
                      />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.beneficiaryName,
                          selected && styles.beneficiaryNameSelected,
                        ]}
                      >
                        {beneficiary.fullName}
                      </Text>

                      <Text
                        style={[
                          styles.beneficiaryMeta,
                          selected && styles.beneficiaryMetaSelected,
                        ]}
                      >
                        {beneficiary.phone}
                      </Text>

                      <Text
                        style={[
                          styles.beneficiaryMeta,
                          selected && styles.beneficiaryMetaSelected,
                        ]}
                      >
                        {beneficiary.city}, {beneficiary.state}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <MainButton testID="sendMoney-sendButton" onPress={handleSendMoney}>
            {t.sendTransfer}
          </MainButton>

          {sendMoneySuccess && (
            <View testID="sendMoney-successMessage" style={styles.transferSuccessBox}>
              <CheckCircle2 size={18} color="#16A34A" />
              <Text style={styles.transferSuccessText}>
                {t.moneySent}
              </Text>
            </View>
          )}

          {!!sendMoneyError && (
            <View testID="sendMoney-errorMessage" style={styles.errorBox}>
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