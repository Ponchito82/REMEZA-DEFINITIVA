import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { ChevronRight, FileText, Wallet } from "lucide-react-native";
import { styles as appStyles } from "../theme/styles";
import { colors } from "../theme/colors";
import { fontFamily, typography } from "../theme/typography";
import { primaryGradient } from "../theme/gradients";
import { CreditFlowHeader, CreditMovementRow } from "../components/remeza";
import { spacing, screenPadding } from "../theme/spacing";
import type { CreditMovement } from "../utils/creditSimulation";
import type { Language } from "../types/app";

type Filter = "all" | "purchase" | "payment" | "other";

/** Cuantos movimientos se ven antes de "Ver mas movimientos". */
const PAGE_SIZE = 5;

type Props = {
  t: any;
  holderName?: string;
  language: Language;
  creditLimitUsd: number;
  usedUsd: number;
  movements: CreditMovement[];
  setIsMenuOpen: (value: boolean) => void;
  onBack: () => void;
};

const money = (value: number) => `$${value.toLocaleString("en-US")}`;

export default function CreditMovementsScreen({
  t,
  language,
  creditLimitUsd,
  usedUsd,
  movements,
  setIsMenuOpen,
  onBack,
}: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: t.creditFilterAll },
    { id: "purchase", label: t.creditFilterPurchases },
    { id: "payment", label: t.creditFilterPayments },
    { id: "other", label: t.creditFilterOther },
  ];

  // "Otros" (comisiones, intereses) no tiene movimientos simulados.
  const filtered = movements.filter((m) =>
    filter === "all" ? true : filter === "other" ? false : m.kind === filter,
  );
  const shown = filtered.slice(0, visible);

  const pickFilter = (next: Filter) => {
    setFilter(next);
    setVisible(PAGE_SIZE);
  };

  return (
    <View style={appStyles.dashboardScreen}>
      <CreditFlowHeader
        testIDPrefix="creditMovements"
        onMenu={() => setIsMenuOpen(true)}
        onBack={onBack}
        backLabel={t.back}
        title={
          <>
            {t.creditMovementsTitle} <Text style={localStyles.accent}>{t.creditMovementsTitleAccent}</Text>
          </>
        }
      />

      <ScrollView contentContainerStyle={localStyles.content} showsVerticalScrollIndicator={false}>
        <Text style={localStyles.subtitle}>{t.creditMovementsSubtitle}</Text>

        <View style={localStyles.balanceRow}>
          <View style={localStyles.iconBox}>
            <Wallet size={22} color={colors.text.primary} strokeWidth={2} />
          </View>
          <View>
            <Text style={localStyles.infoLabel}>{t.creditPayBalance}</Text>
            <Text testID="creditMovements-balance" style={localStyles.balanceValue}>
              {money(usedUsd)}
            </Text>
            <Text style={localStyles.infoLabel}>
              {t.creditPayOf} {money(creditLimitUsd)}
            </Text>
          </View>
        </View>

        <View style={localStyles.filters}>
          {filters.map((item) => {
            const active = filter === item.id;
            return (
              <Pressable
                key={item.id}
                testID={`creditMovements-filter-${item.id}`}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => pickFilter(item.id)}
                style={[localStyles.filter, active && localStyles.filterActive]}
              >
                <Text style={localStyles.filterText}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={localStyles.listTitle}>{t.creditMovementsRecent}</Text>

        {shown.length > 0 ? (
          <View style={localStyles.list}>
            {shown.map((movement) => (
              <CreditMovementRow
                key={movement.id}
                testID="creditMovements-item"
                t={t}
                language={language}
                movement={movement}
              />
            ))}
          </View>
        ) : (
          <View style={localStyles.empty}>
            <View style={localStyles.emptyIcon}>
              <FileText size={22} color={colors.text.secondary} strokeWidth={2} />
            </View>
            <Text style={localStyles.emptyTitle}>{t.creditEmptyTitle}</Text>
          </View>
        )}

        {filtered.length > visible ? (
          <Pressable
            testID="creditMovements-moreButton"
            accessibilityRole="button"
            onPress={() => setVisible((count) => count + PAGE_SIZE)}
            style={({ pressed }) => [localStyles.cta, pressed && localStyles.pressed]}
          >
            <LinearGradient
              colors={primaryGradient.colors}
              locations={primaryGradient.locations}
              start={primaryGradient.start}
              end={primaryGradient.end}
              style={StyleSheet.absoluteFill}
            />
            <Text style={localStyles.ctaText}>{t.creditSeeMoreMovements}</Text>
            <ChevronRight size={20} color="#FFFFFF" strokeWidth={2.4} />
          </Pressable>
        ) : null}
      </ScrollView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  content: {
    paddingHorizontal: screenPadding,
    paddingTop: spacing.md,
    paddingBottom: 40,
  },
  pressed: { opacity: 0.7 },
  accent: { color: "#FFFFFF" },
  subtitle: {
    ...typography.body,
    marginBottom: spacing.lg,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    backgroundColor: colors.surface,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(75,35,250,0.45)",
  },
  infoLabel: {
    ...typography.caption,
    fontSize: 12,
  },
  balanceValue: {
    fontFamily: fontFamily.bold,
    fontSize: 22,
    color: colors.text.primary,
  },
  filters: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  filter: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    backgroundColor: colors.surface,
  },
  filterActive: {
    borderColor: colors.primaryLight,
    backgroundColor: colors.primary,
  },
  filterText: {
    fontFamily: fontFamily.semibold,
    fontSize: 12,
    color: colors.text.primary,
  },
  listTitle: {
    ...typography.h2,
    fontSize: 17,
    lineHeight: 22,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  list: {
    gap: spacing.sm,
  },
  empty: {
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.xl,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    backgroundColor: colors.surface,
  },
  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceStrong,
  },
  emptyTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 15,
    color: colors.text.primary,
  },
  cta: {
    marginTop: spacing.lg,
    height: 56,
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    overflow: "hidden",
  },
  ctaText: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: "#FFFFFF",
  },
});
