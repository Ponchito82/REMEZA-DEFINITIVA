import React from "react";
import { SafeAreaView, View, Text } from "react-native";
import MainButton from "../components/MainButton";
import { ViewName } from "../types/app";
import { styles } from "../theme/styles";

type Props = {
  t: any;
  setView: (view: ViewName) => void;
};

export default function KycView({ t, setView }: Props) {
  return (
    <SafeAreaView style={styles.kycScreen}>
      <View style={styles.kycLogo}>
        <Text style={styles.kycLogoText}>P</Text>
      </View>

      <Text style={styles.kycTitle}>{t.plaidWidget}</Text>
      <Text style={styles.kycSubtitle}>{t.linkingAccounts}</Text>

      <MainButton
        testID="kyc-enterDashboardButton"
        onPress={() => setView("dashboard")}
        style={styles.kycButton}
        textStyle={styles.kycButtonText}
      >
        {t.enterDashboard}
      </MainButton>
    </SafeAreaView>
  );
}