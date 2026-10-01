import React from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { BanknoteArrowDown, Eye, EyeOff, Menu } from "lucide-react-native";
import { styles } from "../theme/styles";
import { PURPLE, colors } from "../theme/colors";
import { typography } from "../theme/typography";
import { primaryGradient } from "../theme/gradients";
import { GlassBanner, RemezaLogo } from "../components/ui";
import { ActivityItem, CardSummaryTile } from "../components/remeza";
import { spacing, screenPadding } from "../theme/spacing";
import { tourRef } from "../onboarding/tourTargets";

type Props = {
  t: any;

  /** Nombre completo con el que se registro; para el saludo. */
  holderName: string;

  setIsMenuOpen: (value: boolean) => void;
  /** Abre Cuentas multidivisa al tocar el saldo */
  onBalancePress?: () => void;
  /** Boton "Enviar dinero" junto al saldo */
  onSendMoneyPress?: () => void;
  /** "Ver todo" de Actividad */
  onViewAllActivity?: () => void;
  /** Abre la pantalla de la tarjeta fisica o virtual */
  onOpenCard: (variant: "physical" | "virtual") => void;

  transactions: any[];

  /** Recordatorio de biometria (una vez al dia, si no se activo). Toca para ir a activarla. */
  biometricReminderVisible?: boolean;
  onBiometricReminderPress?: () => void;
};

/** Ultimos 4 digitos solo para la fila resumida de "Mis tarjetas" (contenido de muestra). */
const SUMMARY_LAST4 = { physical: "1651", virtual: "3094" };

export default function DashboardView({
  t,
  holderName,
  setIsMenuOpen,
  onBalancePress,
  onSendMoneyPress,
  onViewAllActivity,
  onOpenCard,
  transactions,
  biometricReminderVisible = false,
  onBiometricReminderPress = () => {},
}: Props) {
  const [hideBalance, setHideBalance] = React.useState(false);

  const firstName = holderName.trim().split(/\s+/)[0] ?? "";
  const displayBalance = hideBalance ? "••••••" : "$2,450.00";

  return (
    <View style={styles.dashboardScreen}>
      <View style={dashboardStyles.header}>
        <View style={dashboardStyles.wordmark}>
          <RemezaLogo size={22} color={colors.text.primary} />
          <Text style={dashboardStyles.wordmarkText}>remeza</Text>
        </View>

        <Pressable
          ref={tourRef("menu")}
          collapsable={false}
          testID="dashboard-menuButton"
          accessibilityRole="button"
          accessibilityLabel="Menu"
          onPress={() => setIsMenuOpen(true)}
          style={({ pressed }) => [dashboardStyles.menuButton, pressed && dashboardStyles.pressed]}
        >
          <Menu size={22} color={colors.text.primary} strokeWidth={2} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.dashboardContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={dashboardStyles.greeting}>
          {t.greetingPrefix} {firstName}
        </Text>

        {biometricReminderVisible ? (
          <Pressable
            testID="dashboard-biometricReminder"
            accessibilityRole="button"
            onPress={onBiometricReminderPress}
          >
            <GlassBanner
              tone="info"
              message={t.dashboardBioReminderNote}
              style={dashboardStyles.bioReminderNotice}
            />
          </Pressable>
        ) : null}

        <View style={dashboardStyles.balanceRow}>
          <View style={dashboardStyles.balanceBlock}>
            <View style={dashboardStyles.balanceLabelRow}>
              <Text
                testID="dashboard-balance-label"
                style={dashboardStyles.balanceLabel}
              >
                {t.myBalance}
              </Text>
            </View>

            <Pressable
              ref={tourRef("balance")}
              collapsable={false}
              testID="dashboard-balance-balancePressable"
              accessibilityRole={onBalancePress ? "button" : undefined}
              onPress={onBalancePress}
              disabled={!onBalancePress}
            >
              <Text
                testID="dashboard-balance-amount"
                style={dashboardStyles.amount}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.6}
              >
                {displayBalance}
              </Text>
            </Pressable>
          </View>

          <Pressable
            ref={tourRef("hideToggle")}
            collapsable={false}
            testID="dashboard-balance-hideToggle"
            accessibilityRole="button"
            accessibilityLabel={hideBalance ? t.showBalance : t.hideBalance}
            onPress={() => setHideBalance((prev) => !prev)}
            hitSlop={6}
            style={({ pressed }) => [dashboardStyles.hideToggleButton, pressed && dashboardStyles.pressed]}
          >
            {hideBalance ? (
              <EyeOff size={21} color={colors.text.secondary} strokeWidth={2} />
            ) : (
              <Eye size={21} color={PURPLE} strokeWidth={2} />
            )}
          </Pressable>

          {onSendMoneyPress ? (
            <Pressable
              ref={tourRef("send")}
              collapsable={false}
              testID="dashboard-sendMoneyButtonTop"
              accessibilityRole="button"
              accessibilityLabel={t.sendMoney}
              onPress={onSendMoneyPress}
              style={({ pressed }) => [dashboardStyles.sendMoneyCompact, pressed && dashboardStyles.pressed]}
            >
              <LinearGradient
                colors={primaryGradient.colors}
                locations={primaryGradient.locations}
                start={primaryGradient.start}
                end={primaryGradient.end}
                style={StyleSheet.absoluteFill}
              />
              <BanknoteArrowDown size={16} color="#FFFFFF" strokeWidth={2} />
              <Text style={dashboardStyles.sendMoneyCompactText} numberOfLines={1}>
                {t.sendMoney}
              </Text>
            </Pressable>
          ) : null}
        </View>

        <View style={dashboardStyles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>{t.myCardsTitle}</Text>
          <Text style={dashboardStyles.seeAll}>{t.seeAllCards}</Text>
        </View>

        <View style={dashboardStyles.cardsRow}>
          <View ref={tourRef("cardPhysical")} collapsable={false} style={dashboardStyles.cardSlot}>
          <CardSummaryTile
            testID="dashboard-physicalCardRow"
            variant="physical"
            typeLabel={t.physical}
            name={t.physicalCardName}
            last4={SUMMARY_LAST4.physical}
            onPress={() => onOpenCard("physical")}
          />
          </View>
          <View ref={tourRef("cardVirtual")} collapsable={false} style={dashboardStyles.cardSlot}>
          <CardSummaryTile
            testID="dashboard-virtualCardRow"
            variant="virtual"
            typeLabel={t.virtual}
            name={t.virtualCardName}
            last4={SUMMARY_LAST4.virtual}
            onPress={() => onOpenCard("virtual")}
          />
          </View>
        </View>

        <View ref={tourRef("activity")} collapsable={false} style={dashboardStyles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>{t.activity}</Text>

          {onViewAllActivity ? (
            <Pressable testID="dashboard-viewAllActivityButton" onPress={onViewAllActivity}>
              <Text style={dashboardStyles.seeAll}>{t.seeAll}</Text>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.stack12}>
          {transactions.map((item, index) => (
            <ActivityItem
              key={index}
              testID={`dashboard-activityItem-${index}`}
              label={item.label}
              subtitle={item.time}
              amount={item.amount}
              direction={item.amount.trim().startsWith("+") ? "in" : "out"}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const dashboardStyles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: screenPadding,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  wordmark: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  wordmarkText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
  },
  menuButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceStrong,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  pressed: {
    opacity: 0.7,
  },
  greeting: {
    ...typography.h2,
    marginBottom: spacing.lg,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  balanceBlock: {
    flex: 1,
    flexShrink: 1,
  },
  balanceLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  balanceLabel: {
    ...typography.label,
    fontSize: 15,
    letterSpacing: 1,
    flexShrink: 1,
  },
  hideToggleButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceStrong,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  amount: {
    ...typography.amount,
    fontSize: 24,
    lineHeight: 30,
  },
  sendMoneyCompact: {
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 22,
    overflow: "hidden",
  },
  sendMoneyCompactText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  seeAll: {
    ...typography.link,
    color: PURPLE,
  },
  cardSlot: {
    flex: 1,
  },
  cardsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  bioReminderNotice: {
    marginBottom: spacing.lg,
  },
});
