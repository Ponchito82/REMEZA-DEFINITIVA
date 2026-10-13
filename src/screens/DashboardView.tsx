import React from "react";
import { View, Text, Pressable, ScrollView, StyleSheet, Switch } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Clipboard from "@react-native-clipboard/clipboard";
import { BanknoteArrowDown, Eye, EyeOff, Lock, Menu, ShieldOff, X } from "lucide-react-native";
import { styles } from "../theme/styles";
import { PURPLE, colors } from "../theme/colors";
import { fontFamily, typography } from "../theme/typography";
import { primaryGradient } from "../theme/gradients";
import { GlassBanner, RemezaLogo } from "../components/ui";
import { CardActivityPreview, PhysicalCardArt, RemezaCardBack } from "../components/remeza";
import type { CardMovementsState } from "../api/cardTransactions";
import { spacing, screenPadding } from "../theme/spacing";
import { getTargetNode, tourRef } from "../onboarding/tourTargets";
import type { CardDisplayData } from "./CardDetailScreen";

type Props = {
  t: any;

  /** Nombre completo con el que se registro; para el saludo. */
  holderName: string;

  /** Saldo disponible en dolares. */
  /** `null` cuando el saldo real aun no se conoce */
  availableUsdBalance: number | null;

  setIsMenuOpen: (value: boolean) => void;
  /** Abre Cuentas multidivisa al tocar el saldo */
  onBalancePress?: () => void;
  /** Boton "Enviar dinero" junto al saldo */
  onSendMoneyPress?: () => void;
  /** "Ver todo" de Actividad */
  onViewAllActivity?: () => void;
  /** Abre la pantalla de la tarjeta fisica o virtual */
  onOpenCard: (variant: "physical" | "virtual") => void;

  /** Datos de la tarjeta virtual (los mismos que la pantalla de detalle). */
  card: CardDisplayData;
  /** Tarjeta aun sin activar: en lugar del interruptor se ofrece activarla. */
  isVirtualInactive: boolean;
  /** Virtual encendida (true) o bloqueada (false); compartido con la pantalla de detalle. */
  isCardActive: boolean;
  onCardActiveChange: (value: boolean) => void;
  /** Mostrar u ocultar numero, vencimiento y CVV; compartido con la pantalla de detalle. */
  showCardData: boolean;
  onShowCardDataChange: (value: boolean) => void;

  /** Sección "Tarjeta física": se oculta si ya esta activa o si el usuario la cerro. */
  physicalCardActive: boolean;
  physicalCardRequested: boolean;
  physicalPromoDismissed: boolean;
  onDismissPhysicalPromo: () => void;
  /** "Solicitar tarjeta": abre la pantalla de solicitud de la tarjeta fisica. */
  onRequestPhysicalCard: () => void;
  /** Ya solicitada, "Activar tarjeta": abre el detalle en la fisica para activarla. */
  onActivatePhysicalCard: () => void;

  /** Movimientos reales de la tarjeta; aqui se muestran los 3 ultimos. */
  activity: CardMovementsState;

  /** Recordatorio de biometria (una vez al dia, si no se activo). Toca para ir a activarla. */
  biometricReminderVisible?: boolean;
  onBiometricReminderPress?: () => void;

  /**
   * Objetivo del paso actual de la guia. El Home se desplaza solo hasta el,
   * para que el cuadro de la guia nunca quede fuera de pantalla.
   */
  tourFocusId?: string;
};

/** Ancho del arte de la tarjeta fisica en la invitacion a solicitarla. */
const PROMO_CARD_WIDTH = 150;

/** Espacio que se deja arriba del objetivo al desplazarse (cabe el chip con el titulo). */
const TOUR_SCROLL_MARGIN = 140;

/** Objetivos de la guia que viven dentro del scroll del Home; con cualquier otro no se desplaza. */
const SCROLLABLE_TOUR_TARGETS = new Set([
  "balance",
  "hideToggle",
  "send",
  "cardVirtual",
  "cardShowData",
  "cardCopyNumber",
  "cardCopyCvv",
  "cardStatus",
  "cardDetails",
  "cardPhysical",
  "activity",
]);

export default function DashboardView({
  t,
  holderName,
  availableUsdBalance,
  setIsMenuOpen,
  onBalancePress,
  onSendMoneyPress,
  onViewAllActivity,
  onOpenCard,
  card,
  isVirtualInactive,
  isCardActive,
  onCardActiveChange,
  showCardData,
  onShowCardDataChange,
  physicalCardActive,
  physicalCardRequested,
  physicalPromoDismissed,
  onDismissPhysicalPromo,
  onRequestPhysicalCard,
  onActivatePhysicalCard,
  activity,
  biometricReminderVisible = false,
  onBiometricReminderPress = () => {},
  tourFocusId,
}: Props) {
  const [hideBalance, setHideBalance] = React.useState(false);

  const scrollRef = React.useRef<ScrollView>(null);
  const scrollViewportRef = React.useRef<View>(null);
  const scrollOffsetRef = React.useRef(0);

  // Lleva el objetivo de la guia a la vista. Se mide en coordenadas de ventana
  // (objetivo y contenedor) y se suma el desplazamiento actual.
  React.useEffect(() => {
    if (!tourFocusId || !SCROLLABLE_TOUR_TARGETS.has(tourFocusId)) return;
    const timer = setTimeout(() => {
      const node = getTargetNode(tourFocusId);
      const viewport = scrollViewportRef.current;
      if (!node || !viewport || typeof node.measureInWindow !== "function") return;
      viewport.measureInWindow((_vx, viewportY) => {
        node.measureInWindow((_x: number, y: number, _w: number, h: number) => {
          if (h <= 0) return;
          const contentY = y - viewportY + scrollOffsetRef.current;
          scrollRef.current?.scrollTo({
            y: Math.max(0, contentY - TOUR_SCROLL_MARGIN),
            animated: true,
          });
        });
      });
    }, 80);
    return () => clearTimeout(timer);
  }, [tourFocusId]);

  const firstName = holderName.trim().split(/\s+/)[0] ?? "";
  // Sin saldo conocido se muestra un boton "No disponible" (no un monto inventado).
  const balanceUnknown = availableUsdBalance === null && !hideBalance;
  const displayBalance = hideBalance
    ? "••••••"
    : availableUsdBalance === null
      ? t.balanceUnavailable
      : `$${availableUsdBalance.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;

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

      <View ref={scrollViewportRef} collapsable={false} style={dashboardStyles.scrollViewport}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.dashboardContent}
        showsVerticalScrollIndicator={false}
        onScroll={(event) => {
          scrollOffsetRef.current = event.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={32}
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
              style={({ pressed }) => [
                balanceUnknown && dashboardStyles.balanceUnavailableButton,
                balanceUnknown && pressed && dashboardStyles.pressed,
              ]}
            >
              <Text
                testID="dashboard-balance-amount"
                style={[dashboardStyles.amount, balanceUnknown && dashboardStyles.balanceUnavailableText]}
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
          <Text style={styles.sectionTitle}>{t.myCardTitle}</Text>
          <Pressable
            ref={tourRef("cardDetails")}
            collapsable={false}
            testID="dashboard-cardDetailsButton"
            accessibilityRole="button"
            onPress={() => onOpenCard("virtual")}
            hitSlop={8}
          >
            <Text style={dashboardStyles.seeAll}>{t.seeCardDetails}</Text>
          </Pressable>
        </View>

        <View ref={tourRef("cardVirtual")} collapsable={false} style={dashboardStyles.cardBlock}>
          <Pressable
            testID="dashboard-virtualCardPressable"
            // Sin activar, tocar la tarjeta lleva a activarla; activa, no hace nada (los botones de adentro si).
            onPress={isVirtualInactive ? () => onOpenCard("virtual") : undefined}
            disabled={!isVirtualInactive}
          >
            <RemezaCardBack
              testID="dashboard-virtualCard"
              numberTestID="dashboard-virtualCard-number"
              t={t}
              variant="virtual"
              number={card.number}
              last4={card.last4}
              expiry={card.expiry}
              cvv={card.cvv}
              showData={showCardData}
              dimmed={isVirtualInactive || !isCardActive}
              onCopyNumber={() => Clipboard.setString(card.number.replace(/\s/g, ""))}
              copyTestID="dashboard-copyVirtualCardNumberButton"
              copyRef={tourRef("cardCopyNumber")}
              onCopyCvv={() => Clipboard.setString(card.cvv)}
              copyCvvTestID="dashboard-copyVirtualCvvButton"
              copyCvvRef={tourRef("cardCopyCvv")}
            >
              {!isVirtualInactive && !isCardActive ? (
                <View style={[styles.virtualCardOverlay, dashboardStyles.cardOffOverlay]}>
                  <ShieldOff size={28} color="#fff" />
                  <Text style={styles.virtualCardOverlayText}>{t.cardOff}</Text>
                </View>
              ) : null}

              <View style={dashboardStyles.cardControls}>
                <Pressable
                  ref={tourRef("cardShowData")}
                  collapsable={false}
                  testID="dashboard-toggleShowCardDataButton"
                  accessibilityRole="button"
                  onPress={() => onShowCardDataChange(!showCardData)}
                  hitSlop={8}
                  style={({ pressed }) => [dashboardStyles.cardControl, pressed && dashboardStyles.pressed]}
                >
                  {showCardData ? (
                    <Eye size={16} color={PURPLE} strokeWidth={2.2} />
                  ) : (
                    <EyeOff size={16} color={colors.text.secondary} strokeWidth={2.2} />
                  )}
                  <Text style={dashboardStyles.cardControlText} numberOfLines={1}>
                    {showCardData ? t.hiddeData : t.showData}
                  </Text>
                </Pressable>

                {isVirtualInactive ? (
                  <Pressable
                    ref={tourRef("cardStatus")}
                    collapsable={false}
                    testID="dashboard-activateCardButton"
                    accessibilityRole="button"
                    onPress={() => onOpenCard("virtual")}
                    hitSlop={8}
                  >
                    <Text style={[dashboardStyles.cardControlText, dashboardStyles.activateText]}>
                      {t.activateCardShort}
                    </Text>
                  </Pressable>
                ) : (
                  <View
                    ref={tourRef("cardStatus")}
                    collapsable={false}
                    testID="dashboard-blockCardSwitchRow"
                    style={dashboardStyles.cardControl}
                  >
                    {isCardActive ? null : <Lock size={14} color={colors.text.secondary} />}
                    <Text style={dashboardStyles.cardControlText} numberOfLines={1}>
                      {isCardActive ? t.cardActiveLabel : t.cardBlockedLabel}
                    </Text>
                    <Switch
                      testID="dashboard-blockCardSwitch"
                      accessibilityLabel={isCardActive ? t.blockCardButton : t.unblockCardButton}
                      value={isCardActive}
                      onValueChange={onCardActiveChange}
                      trackColor={{ false: "#3B3B55", true: PURPLE }}
                      thumbColor="#FFFFFF"
                      style={dashboardStyles.switch}
                    />
                  </View>
                )}
              </View>
            </RemezaCardBack>
          </Pressable>
        </View>

        {/* Ya solicitada, la seccion pasa a "Activa tu tarjeta fisica" y no se puede cerrar. */}
        {!physicalCardActive && (physicalCardRequested || !physicalPromoDismissed) ? (
          <View ref={tourRef("cardPhysical")} collapsable={false} style={dashboardStyles.promoSection}>
            <View style={dashboardStyles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>{t.physicalCardName}</Text>
              {physicalCardRequested ? null : (
                <View style={dashboardStyles.optionalBadge}>
                  <Text style={dashboardStyles.optionalBadgeText}>{t.optional}</Text>
                </View>
              )}
            </View>

            <View testID="dashboard-physicalCardPromo" style={dashboardStyles.promoCard}>
              <LinearGradient
                colors={["rgba(75,35,250,0.30)", "rgba(20,16,70,0.55)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              />

              <PhysicalCardArt width={PROMO_CARD_WIDTH} style={dashboardStyles.promoArt} />

              <View style={dashboardStyles.promoText}>
                <Text style={dashboardStyles.promoTitle}>
                  {physicalCardRequested ? t.physicalActivateTitle : t.physicalPromoTitle}
                </Text>
                <Text style={dashboardStyles.promoDesc}>
                  {physicalCardRequested ? t.physicalActivateDesc : t.physicalPromoDesc}
                </Text>
              </View>

              <Pressable
                testID={
                  physicalCardRequested
                    ? "dashboard-activatePhysicalCardButton"
                    : "dashboard-requestPhysicalCardButton"
                }
                accessibilityRole="button"
                onPress={physicalCardRequested ? onActivatePhysicalCard : onRequestPhysicalCard}
                style={({ pressed }) => [dashboardStyles.promoButton, pressed && dashboardStyles.pressed]}
              >
                <LinearGradient
                  colors={primaryGradient.colors}
                  locations={primaryGradient.locations}
                  start={primaryGradient.start}
                  end={primaryGradient.end}
                  style={StyleSheet.absoluteFill}
                />
                <Text style={dashboardStyles.promoButtonText}>
                  {physicalCardRequested ? t.activateCardShort : t.physicalPromoCta}
                </Text>
              </Pressable>

              {physicalCardRequested ? null : (
                <Pressable
                  testID="dashboard-dismissPhysicalPromoButton"
                  accessibilityRole="button"
                  accessibilityLabel={t.physicalPromoDismiss}
                  onPress={onDismissPhysicalPromo}
                  hitSlop={8}
                  style={({ pressed }) => [dashboardStyles.promoClose, pressed && dashboardStyles.pressed]}
                >
                  <X size={16} color={colors.text.primary} strokeWidth={2.2} />
                </Pressable>
              )}
            </View>
          </View>
        ) : null}

        <View ref={tourRef("activity")} collapsable={false} style={dashboardStyles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>{t.activity}</Text>

          {onViewAllActivity ? (
            <Pressable testID="dashboard-viewAllActivityButton" onPress={onViewAllActivity}>
              <Text style={dashboardStyles.seeAll}>{t.seeAll}</Text>
            </Pressable>
          ) : null}
        </View>

        <CardActivityPreview
          t={t}
          state={activity}
          limit={3}
          itemTestID="dashboard-activityItem"
        />
      </ScrollView>
      </View>
    </View>
  );
}

const dashboardStyles = StyleSheet.create({
  scrollViewport: {
    flex: 1,
  },
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
  balanceUnavailableButton: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  balanceUnavailableText: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.text.secondary,
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
  cardBlock: {
    width: "85%",
    alignSelf: "center",
    marginBottom: spacing.xl,
  },
  cardOffOverlay: {
    // Deja libre la franja de abajo, donde viven los controles.
    bottom: "22%",
    backgroundColor: "transparent",
  },
  /** Franja inferior de la tarjeta, debajo de vencimiento/CVV y del logotipo. */
  cardControls: {
    position: "absolute",
    left: "6%",
    right: "6%",
    bottom: "13%",
    zIndex: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  cardControl: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 1,
  },
  cardControlText: {
    fontFamily: fontFamily.semibold,
    fontSize: 12,
    color: colors.text.primary,
    includeFontPadding: false,
    flexShrink: 1,
  },
  activateText: {
    color: PURPLE,
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
    marginVertical: -8,
  },
  promoSection: {
    marginBottom: spacing.xl,
  },
  optionalBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(130,110,255,0.55)",
  },
  optionalBadgeText: {
    fontFamily: fontFamily.bold,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: colors.text.secondary,
  },
  promoCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(130,110,255,0.35)",
    backgroundColor: colors.surface,
    padding: spacing.lg,
    paddingTop: spacing.xl,
    overflow: "hidden",
  },
  promoArt: {
    position: "absolute",
    right: 4,
    top: 64,
    transform: [{ rotate: "-16deg" }],
  },
  promoText: {
    width: "58%",
    gap: spacing.sm,
  },
  promoTitle: {
    ...typography.h2,
    fontSize: 19,
    lineHeight: 24,
  },
  promoDesc: {
    ...typography.body,
    fontSize: 14,
    lineHeight: 20,
  },
  promoButton: {
    alignSelf: "flex-start",
    marginTop: spacing.lg,
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  promoButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  promoClose: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  bioReminderNotice: {
    marginBottom: spacing.lg,
  },
});
