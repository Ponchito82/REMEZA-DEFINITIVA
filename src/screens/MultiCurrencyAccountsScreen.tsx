import React from "react";
import { View, StyleSheet } from "react-native";
import { Globe } from "lucide-react-native";

import { FlagIcon, ListRow, ScreenHeader, ScreenLayout } from "../components/ui";
import type { FlagCountry } from "../components/ui";
import { metrics } from "../theme/radius";
import { spacing } from "../theme/spacing";
import { ViewName } from "../types/app";

type Account = {
  id: string;
  country: FlagCountry;
  code: string;
  /** Clave de i18n con el nombre de la moneda */
  nameKey: string;
  balance: number;
};

/** Mock: de aqui saldran las monedas cuando haya backend. */
const ACCOUNTS: Account[] = [
  { id: "usd", country: "US", code: "USD", nameKey: "currencyUsdName", balance: 12480 },
  { id: "mxn", country: "MX", code: "MXN", nameKey: "currencyMxnName", balance: 25300 },
];

const formatBalance = (value: number) =>
  `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

type Props = {
  t: any;
  setView: (view: ViewName) => void;
};

/**
 * "Mis cuentas", con lo visual de la pantalla 1. Sin "Agregar moneda": esa
 * accion (30) y el tipo de cambio (8) quedan fuera por posible trading.
 */
export default function MultiCurrencyAccountsScreen({ t, setView }: Props) {
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
        {ACCOUNTS.map((account) => (
          <ListRow
            key={account.id}
            testID={`multiCurrency.account.${account.id}`}
            accessibilityLabel={`${account.code} ${formatBalance(account.balance)}`}
            leading={<FlagIcon country={account.country} size={metrics.rowIconCircle} />}
            title={account.code}
            subtitle={t[account.nameKey]}
            value={formatBalance(account.balance)}
            right="chevron"
            onPress={() => console.log(`[multiCurrency] abrir ${account.code}`)}
          />
        ))}
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
