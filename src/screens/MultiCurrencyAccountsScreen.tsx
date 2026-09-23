import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Globe, Plus } from "lucide-react-native";

import { Button, CloseButton, IconCircle, ScreenHeader } from "../components/ui";
import { CurrencyAccountCard } from "../components/remeza";
import type { FlagCountry } from "../components/ui";
import { sizes } from "../theme/radius";
import { spacing, screenPadding } from "../theme/spacing";
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

type Props = {
  t: any;
  setView: (view: ViewName) => void;
};

export default function MultiCurrencyAccountsScreen({ t, setView }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <CloseButton
        testID="multiCurrency.backButton"
        accessibilityLabel={t.back}
        icon="chevron"
        onPress={() => setView("dashboard")}
      />

      <IconCircle icon={Globe} size={sizes.hero} hero glow style={styles.hero} />

      <ScreenHeader
        title={t.multiCurrencyTitle}
        subtitle={t.multiCurrencySubtitle}
        align="center"
        size="hero"
        testID="multiCurrency.header"
      />

      <View style={styles.accounts}>
        {ACCOUNTS.map((account) => (
          <CurrencyAccountCard
            key={account.id}
            testID={`multiCurrency.account.${account.id}`}
            country={account.country}
            code={account.code}
            name={t[account.nameKey]}
            balance={account.balance}
            onPress={() => console.log(`[multiCurrency] abrir ${account.code}`)}
          />
        ))}
      </View>

      <Button
        testID="multiCurrency.addCurrencyButton"
        title={t.addCurrency}
        onPress={() => console.log("[multiCurrency] agregar moneda")}
        variant="gradient"
        deepGradient
        size="lg"
        radius="md"
        leftIcon={Plus}
        rightAdornment="none"
        style={styles.cta}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  /** Sin `flexGrow`: el diseno deja el resto de la pantalla vacio. */
  content: {
    paddingHorizontal: screenPadding,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  hero: {
    marginTop: spacing.xxxl,
    marginBottom: spacing.xxl,
  },
  accounts: {
    marginTop: spacing.xxl,
    gap: spacing.md,
  },
  cta: {
    marginTop: spacing.lg,
  },
});
