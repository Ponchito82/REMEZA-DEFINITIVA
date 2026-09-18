import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Pressable,
} from "react-native";
import {
  X,
  ShieldCheck,
  Landmark,
  CheckCircle2,
  Wallet,
} from "lucide-react-native";

import { styles } from "../theme/styles";
import { PURPLE } from "../theme/colors";
import FormInput from "../components/FormInput";
import MainButton from "../components/MainButton";
import { Language, ViewName } from "../types/app";

type Props = {
  t: any;
  language: Language;
  setView: (view: ViewName) => void;

  tradingKycStarted: boolean;
  setTradingKycStarted: (v: boolean) => void;

  tradingKycVerified: boolean;
  setTradingKycVerified: (v: boolean) => void;

  walletId: string;
  walletFunds: number;

  destinationWalletId: string;
  setDestinationWalletId: (v: string) => void;

  transferAmount: string;
  setTransferAmount: (v: string) => void;

  transferSubmitted: boolean;
  handleTradingTransfer: () => void;
};

export default function TradingView({
  t,
  language,
  setView,
  tradingKycStarted,
  setTradingKycStarted,
  tradingKycVerified,
  setTradingKycVerified,
  walletId,
  walletFunds,
  destinationWalletId,
  setDestinationWalletId,
  transferAmount,
  setTransferAmount,
  transferSubmitted,
  handleTradingTransfer,
}: Props) {
  return (
    <SafeAreaView style={styles.pageScreen}>
      <ScrollView
        contentContainerStyle={styles.pageContent}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          testID="trading-backButton"
          onPress={() => setView("dashboard")}
          style={styles.backButton}
        >
          <X size={24} color="#111827" />
        </Pressable>

        <Text style={styles.pageTitle}>{t.openTradingAccount}</Text>
        <Text style={styles.pageSubtitle}>{t.tradingSubtitle}</Text>

        {!tradingKycStarted && (
          <View style={styles.centerCard}>
            <View style={styles.statusIcon}>
              <ShieldCheck size={28} color={PURPLE} />
            </View>

            <Text style={styles.statusTitle}>{t.startKyc}</Text>
            <Text style={styles.statusText}>{t.tradingSubtitle}</Text>

            <MainButton testID="trading-startKycButton" onPress={() => setTradingKycStarted(true)}>
              {t.startKyc}
            </MainButton>
          </View>
        )}

        {tradingKycStarted && !tradingKycVerified && (
          <View style={styles.centerCard}>
            <View style={styles.statusIcon}>
              <Landmark size={28} color={PURPLE} />
            </View>

            <Text style={styles.statusTitle}>{t.completeKyc}</Text>

            <Text style={styles.statusText}>
              {language === "en"
                ? "Review your information and confirm your identity to activate trading."
                : "Revisa tu información y confirma tu identidad para activar trading."}
            </Text>

            <MainButton testID="trading-completeKycButton" onPress={() => setTradingKycVerified(true)}>
              {t.completeKyc}
            </MainButton>
          </View>
        )}

        {tradingKycVerified && (
          <View style={styles.stack16}>
            <View style={styles.successBanner}>
              <CheckCircle2 size={20} color="#16A34A" />

              <View style={{ flex: 1 }}>
                <Text style={styles.successTitle}>{t.kycVerified}</Text>
                <Text style={styles.successText}>{t.tradingReady}</Text>
              </View>
            </View>

            <View style={styles.walletCard}>
              <View style={styles.walletRow}>
                <Wallet size={24} color="#fff" />
                <Text style={styles.walletTitle}>{t.walletId}</Text>
              </View>

              <Text style={styles.walletIdText}>{walletId}</Text>

              <Text style={styles.walletFundsLabel}>
                {t.availableFunds}
              </Text>

              <Text style={styles.walletFundsValue}>
                ${walletFunds.toFixed(2)}
              </Text>
            </View>

            <View style={styles.transferCard}>
              <FormInput
                testID="trading-destinationWalletInput"
                label={t.destinationWallet}
                value={destinationWalletId}
                onChangeText={setDestinationWalletId}
              />

              <FormInput
                testID="trading-transferAmountInput"
                label={t.transferAmount}
                value={transferAmount}
                onChangeText={setTransferAmount}
                keyboardType="number-pad"
              />

              <MainButton testID="trading-sendTransferButton" onPress={handleTradingTransfer}>
                {t.sendTransfer}
              </MainButton>

              {transferSubmitted && (
                <View style={styles.transferSuccessBox}>
                  <CheckCircle2 size={18} color="#16A34A" />
                  <Text style={styles.transferSuccessText}>
                    {t.transferSuccess}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}