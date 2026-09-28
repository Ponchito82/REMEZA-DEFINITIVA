import React from "react";
import { View, StyleSheet } from "react-native";
import { Globe } from "lucide-react-native";

import { CurrencyAccountCard } from "../components/remeza";
import { ScreenHeader, ScreenLayout } from "../components/ui";
import { metrics } from "../theme/radius";
import { spacing } from "../theme/spacing";
import { ViewName } from "../types/app";

type Props = {
  t: any;
  setView: (view: ViewName) => void;
};

/**
 * "Mis cuentas": no es un sistema de multidivisa expandible, son dos cuentas
 * fijas segun las reglas de negocio (remitente en EE.UU./USD, beneficiario en
 * Mexico/MXN). Sin "Agregar moneda": esa accion (30) y el tipo de cambio (8)
 * quedan fuera por posible trading.
 */
export default function MultiCurrencyAccountsScreen({ t, setView }: Props) {
  const usdAccount = { country: "US" as const, code: "USD", balance: 12480 };
  const mxnAccount = { country: "MX" as const, code: "MXN", balance: 25300 };

  return (
    <ScreenLayout
      showBack
      onBack={() => setView("dashboard")}
      backTestID="multiCurrency.backButton"
      backAccessibilityLabel={t.back}
    >
      <ScreenHeader
        icon={Globe}
        title={t.multiCurrencyTitle}
        subtitle={t.multiCurrencySubtitle}
        testID="multiCurrency.header"
        style={styles.header}
      />

      <View style={styles.accounts}>
        <CurrencyAccountCard
          testID="multiCurrency.account.usd"
          country={usdAccount.country}
          code={usdAccount.code}
          name={t.accountUsdName}
          balance={usdAccount.balance}
          onPress={() => console.log(`[multiCurrency] abrir ${usdAccount.code}`)}
        />
        <CurrencyAccountCard
          testID="multiCurrency.account.mxn"
          country={mxnAccount.country}
          code={mxnAccount.code}
          name={t.accountMxnName}
          balance={mxnAccount.balance}
          onPress={() => console.log(`[multiCurrency] abrir ${mxnAccount.code}`)}
        />
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: spacing.lg,
  },
  accounts: {
    gap: metrics.rowGap,
  },
});
