import KeyboardAwareScrollView from "../components/ui/KeyboardAwareScrollView";
import React from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Switch,
  Modal,
  TextInput,
  StyleSheet,
} from "react-native";
import { BanknoteArrowDown, ChevronLeft, ShieldOff, Eye, EyeOff, Lock, Menu } from "lucide-react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import { styles } from "../theme/styles";
import { PURPLE, colors } from "../theme/colors";
import { typography } from "../theme/typography";
import { PrimaryButton, RemezaLogo } from "../components/ui";
import { CardActivityPreview, CardTypeToggle, RemezaCardBack } from "../components/remeza";
import type { CardMovementsState } from "../api/cardTransactions";
import { spacing, screenPadding } from "../theme/spacing";
import { useHardwareBack } from "../hooks/useHardwareBack";

/** Datos de la tarjeta de muestra: los mismos valores que antes iban en linea. */
const CARD_DEMO = {
  number: "1234 5678 9012 4590",
  last4: "4590",
  expiry: "12/28",
  cvv: "123",
};

export type CardDisplayData = typeof CARD_DEMO;

/** La virtual no se captura al activarla: siempre muestra sus datos asignados. */
export const VIRTUAL_CARD_DATA: CardDisplayData = CARD_DEMO;

/**
 * Datos que pinta la tarjeta fisica: tras activarla, los capturados en la
 * activacion; antes, los de muestra.
 */
export function resolveCardData(
  isFactoryInactive: boolean,
  cardNumber: string,
  expiryDate: string,
  cvv: string,
): CardDisplayData {
  const entered = cardNumber.replace(/\s/g, "");
  return !isFactoryInactive && entered.length === 16
    ? { number: cardNumber, last4: entered.slice(-4), expiry: expiryDate, cvv }
    : CARD_DEMO;
}

type Props = {
  t: any;
  holderName: string;

  /** Fisica: sin activar, encendida/bloqueada. */
  isFactoryInactive: boolean;
  isCardActive: boolean;
  setIsCardActive: (value: boolean) => void;

  /** Virtual: su propia activacion y su propio bloqueo, independientes de la fisica. */
  isVirtualInactive: boolean;
  isVirtualCardActive: boolean;
  setIsVirtualCardActive: (value: boolean) => void;

  /**
   * La fisica solo aparece (selector Fisica/Virtual) una vez solicitada. Antes
   * de eso esta pantalla es solo de la virtual.
   */
  physicalCardRequested: boolean;

  setIsMenuOpen: (value: boolean) => void;
  onSendMoneyPress?: () => void;
  onBack: () => void;

  activeCardIndex: number;
  setActiveCardIndex: (value: number) => void;

  showSuccessMessage: boolean;

  showSecureCodeModal: boolean;
  setShowSecureCodeModal: (value: boolean) => void;

  showVirtualCardModal: boolean;
  setShowVirtualCardModal: (value: boolean) => void;

  secureCode: string;
  setSecureCode: (value: string) => void;

  virtualSecureCode: string;
  setVirtualSecureCode: (value: string) => void;

  birthDate: string;
  setBirthDate: (value: string) => void;

  cardNumber: string;
  setCardNumber: (value: string) => void;

  expiryDate: string;
  setExpiryDate: (value: string) => void;

  cvv: string;
  setCvv: (value: string) => void;

  showCardData: boolean;
  setShowCardData: (value: boolean) => void;

  handleActivateCard: () => void;
  handleActivateVirtualCard: () => void;

  /** Movimientos reales de la tarjeta; aqui se muestran los 2 ultimos. */
  activity: CardMovementsState;
  /** "Ver todo": abre los movimientos de la tarjeta */
  onViewAllActivity?: () => void;
};

/**
 * Pantalla de la tarjeta, a la que se llega desde "Mi tarjeta" en el
 * dashboard. Mientras no se solicite la fisica, es solo de la virtual; ya
 * solicitada, aparece el selector Fisica/Virtual. Cada tarjeta tiene su propia
 * activacion (la fisica con sus datos impresos, la virtual con fecha de
 * nacimiento y codigo) y su propio bloqueo.
 */
export default function CardDetailScreen({
  t,
  holderName,
  isFactoryInactive,
  isCardActive,
  setIsCardActive,
  isVirtualInactive,
  isVirtualCardActive,
  setIsVirtualCardActive,
  physicalCardRequested,
  setIsMenuOpen,
  onSendMoneyPress,
  onBack,
  activeCardIndex,
  setActiveCardIndex,
  showSuccessMessage,
  showSecureCodeModal,
  setShowSecureCodeModal,
  showVirtualCardModal,
  setShowVirtualCardModal,
  secureCode,
  setSecureCode,
  virtualSecureCode,
  setVirtualSecureCode,
  birthDate,
  setBirthDate,
  cardNumber,
  setCardNumber,
  expiryDate,
  setExpiryDate,
  cvv,
  setCvv,
  showCardData,
  setShowCardData,
  handleActivateCard,
  handleActivateVirtualCard,
  activity,
  onViewAllActivity,
}: Props) {
  useHardwareBack(() => {
    onBack();
    return true;
  });

  const isPhysicalFormValid =
    secureCode.length === 6 &&
    cardNumber.replace(/\s/g, "").length === 16 &&
    expiryDate.length === 5 &&
    cvv.length >= 3;

  const isVirtualFormValid = birthDate.length === 10 && virtualSecureCode.length === 6;

  // Tras activar, las dos tarjetas muestran los datos capturados en la activacion.
  // Ya activada, la fisica sigue visible aunque el flag de solicitud no este.
  const showPhysical = physicalCardRequested || !isFactoryInactive;
  const variant: "physical" | "virtual" =
    showPhysical && activeCardIndex === 0 ? "physical" : "virtual";
  const isPhysical = variant === "physical";

  // Cada tarjeta con su propio estado.
  const inactive = isPhysical ? isFactoryInactive : isVirtualInactive;
  const active = isPhysical ? isCardActive : isVirtualCardActive;
  const setActive = isPhysical ? setIsCardActive : setIsVirtualCardActive;
  const cardData = isPhysical
    ? resolveCardData(isFactoryInactive, cardNumber, expiryDate, cvv)
    : VIRTUAL_CARD_DATA;

  const openActivation = () => {
    if (isPhysical) {
      setShowSecureCodeModal(true);
    } else {
      setShowVirtualCardModal(true);
    }
  };

  return (
    <View style={styles.dashboardScreen}>
      <View style={detailStyles.header}>
        <View style={detailStyles.wordmark}>
          <RemezaLogo size={22} color={colors.text.primary} />
          <Text style={detailStyles.wordmarkText}>remeza</Text>
        </View>

        <Pressable
          testID="dashboard-menuButton"
          accessibilityRole="button"
          accessibilityLabel="Menu"
          onPress={() => setIsMenuOpen(true)}
          style={({ pressed }) => [detailStyles.menuButton, pressed && detailStyles.pressed]}
        >
          <Menu size={22} color={colors.text.primary} strokeWidth={2} />
        </Pressable>
      </View>

      <Modal
        visible={showSecureCodeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSecureCodeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAwareScrollView
            style={detailStyles.modalScroll}
            contentContainerStyle={detailStyles.modalScrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t.activateYourCard}</Text>

            <View
              style={{
                width: "100%",
                marginTop: 16,
                padding: 16,
                borderRadius: 12,
                backgroundColor: "#1C1A47",
              }}
            >
              <Text style={styles.modalSubtitle}>{t.cardNumber}</Text>

              <TextInput
                testID="dashboard-physicalCardNumberInput"
                value={cardNumber}
                onChangeText={(value) => {
                  const cleaned = value.replace(/\D/g, "").slice(0, 16);
                  const formatted = cleaned.replace(/(\d{4})(?=\d)/g, "$1 ");
                  setCardNumber(formatted);
                }}
                keyboardType="number-pad"
                maxLength={19}
                style={styles.secureCodeInput}
                placeholderTextColor={colors.text.placeholder}
                placeholder="1234 5678 9012 3456"
              />

              <Text style={styles.modalSubtitle}>{t.expiryDate}</Text>

              <TextInput
                testID="dashboard-expiryDateInput"
                value={expiryDate}
                onChangeText={(value) => {
                  const cleaned = value.replace(/\D/g, "").slice(0, 4);
                  const formatted =
                    cleaned.length > 2
                      ? `${cleaned.substring(0, 2)}/${cleaned.substring(2)}`
                      : cleaned;

                  setExpiryDate(formatted);
                }}
                keyboardType="number-pad"
                maxLength={5}
                style={styles.secureCodeInput}
                placeholderTextColor={colors.text.placeholder}
                placeholder="MM/YY"
              />

              <Text style={styles.modalSubtitle}>CCV</Text>

              <TextInput
                testID="dashboard-cvvInput"
                value={cvv}
                onChangeText={(value) => {
                  const cleaned = value.replace(/\D/g, "");
                  setCvv(cleaned.slice(0, 4));
                }}
                keyboardType="number-pad"
                maxLength={4}
                secureTextEntry
                style={styles.secureCodeInput}
                placeholderTextColor={colors.text.placeholder}
                placeholder="123"
              />
            </View>

            <Text style={styles.modalSubtitle}>{t.sixDigitNumerCode}</Text>

            <TextInput
              testID="dashboard-physicalSecureCodeInput"
              value={secureCode}
              onChangeText={(value) => {
                const onlyNumbers = value.replace(/[^0-9]/g, "");
                setSecureCode(onlyNumbers.slice(0, 6));
              }}
              keyboardType="number-pad"
              maxLength={6}
              secureTextEntry
              style={styles.secureCodeInput}
                placeholderTextColor={colors.text.placeholder}
              placeholder="••••••"
            />

            <Pressable
              testID="dashboard-activatePhysicalCardButton"
              onPress={handleActivateCard}
              disabled={!isPhysicalFormValid}
              style={[
                styles.activateButton,
                !isPhysicalFormValid && styles.activateButtonDisabled,
              ]}
            >
              <Text style={styles.activateButtonText}>{t.activateCard}</Text>
            </Pressable>

            <Pressable testID="dashboard-cancelPhysicalCardModalButton" onPress={() => setShowSecureCodeModal(false)}>
              <Text style={styles.cancelText}>{t.cancel}</Text>
            </Pressable>
          </View>
          </KeyboardAwareScrollView>
        </View>
      </Modal>

      <Modal
        visible={showVirtualCardModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowVirtualCardModal(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAwareScrollView
            style={detailStyles.modalScroll}
            contentContainerStyle={detailStyles.modalScrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {t.activateVirtualCard}
            </Text>

            <Text style={styles.modalSubtitle}>
              {t.birthDate}
            </Text>

            <TextInput
              testID="dashboard-birthDateInput"
              value={birthDate}
              onChangeText={(value) => {
                const cleaned = value.replace(/\D/g, "").slice(0, 8);

                let formatted = cleaned;

                if (cleaned.length > 4) {
                  formatted = `${cleaned.substring(0, 2)}/${cleaned.substring(
                    2,
                    4
                  )}/${cleaned.substring(4)}`;
                } else if (cleaned.length > 2) {
                  formatted = `${cleaned.substring(0, 2)}/${cleaned.substring(
                    2
                  )}`;
                }

                setBirthDate(formatted);
              }}
              keyboardType="number-pad"
              maxLength={10}
              style={styles.secureCodeInput}
                placeholderTextColor={colors.text.placeholder}
              placeholder="DD/MM/YYYY"
            />

            <Text style={styles.modalSubtitle}>{t.sixDigitNumerCode}</Text>

            <TextInput
              testID="dashboard-virtualSecureCodeInput"
              value={virtualSecureCode}
              onChangeText={(value) => {
                const onlyNumbers = value.replace(/[^0-9]/g, "");
                setVirtualSecureCode(onlyNumbers.slice(0, 6));
              }}
              keyboardType="number-pad"
              maxLength={6}
              secureTextEntry
              style={styles.secureCodeInput}
                placeholderTextColor={colors.text.placeholder}
              placeholder="••••••"
            />

            <Pressable
              testID="dashboard-activateVirtualCardButton"
              onPress={handleActivateVirtualCard}
              disabled={!isVirtualFormValid}
              style={[
                styles.activateButton,
                !isVirtualFormValid && styles.activateButtonDisabled,
              ]}
            >
              <Text style={styles.activateButtonText}>
                {t.activateCard}
              </Text>
            </Pressable>

            <Pressable testID="dashboard-cancelVirtualCardModalButton" onPress={() => setShowVirtualCardModal(false)}>
              <Text style={styles.cancelText}>{t.cancel}</Text>
            </Pressable>
          </View>
          </KeyboardAwareScrollView>
        </View>
      </Modal>

      <ScrollView
        contentContainerStyle={styles.dashboardContent}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          testID="cardDetail-backButton"
          accessibilityRole="button"
          accessibilityLabel={t.back}
          onPress={onBack}
          style={({ pressed }) => [detailStyles.backRow, pressed && detailStyles.pressed]}
        >
          <ChevronLeft size={20} color={colors.text.primary} strokeWidth={2} />
          <Text style={detailStyles.backText}>{t.back}</Text>
        </Pressable>

        {showPhysical ? (
          <CardTypeToggle
            testID="cardDetail-typeToggle"
            value={variant}
            onChange={(next) => setActiveCardIndex(next === "physical" ? 0 : 1)}
            physicalLabel={t.physical}
            virtualLabel={t.virtual}
            style={detailStyles.cardTypeToggle}
          />
        ) : null}

        {inactive && !showSuccessMessage && (
          <View style={styles.inactiveCardMessage}>
            <Pressable testID="dashboard-inactiveCardTitle" onPress={openActivation}>
              <Text style={styles.inactiveCardTitle}>{t.inactiveCard}</Text>
            </Pressable>

            <Pressable testID="dashboard-activateNowButton" onPress={openActivation}>
              <Text style={styles.activateNowText}>{t.activateNow}</Text>
            </Pressable>
          </View>
        )}

        {showSuccessMessage && (
          <View style={styles.successCardMessage}>
            <Text style={styles.successCardText}>
              {t.congratsYourCardIsActive}
            </Text>
          </View>
        )}

        <Pressable
          testID={variant === "physical" ? "dashboard-physicalCardPressable" : "dashboard-virtualCardPressable"}
          onPress={inactive ? openActivation : undefined}
        >
          <RemezaCardBack
            testID={variant === "physical" ? "dashboard-physicalCard" : "dashboard-virtualCard"}
            t={t}
            variant={variant}
            // Aqui no hay controles abajo: se baja el contenido para que quede centrado en la tarjeta.
            offsetY={100}
            holderName={holderName}
            number={cardData.number}
            last4={cardData.last4}
            expiry={cardData.expiry}
            cvv={cardData.cvv}
            showData={showCardData}
            dimmed={inactive || !active}
            onCopyNumber={() => Clipboard.setString(cardData.number.replace(/\s/g, ""))}
            copyTestID={
              variant === "physical" ? "dashboard-copyPhysicalCardNumberButton" : "dashboard-copyVirtualCardNumberButton"
            }
            onCopyCvv={() => Clipboard.setString(cardData.cvv)}
            copyCvvTestID={
              variant === "physical" ? "dashboard-copyPhysicalCvvButton" : "dashboard-copyVirtualCvvButton"
            }
            style={detailStyles.card}
          >
            {!inactive && !active && (
              <View style={styles.virtualCardOverlay}>
                <ShieldOff size={48} color="#fff" />
                <Text style={styles.virtualCardOverlayText}>{t.cardOff}</Text>
              </View>
            )}
          </RemezaCardBack>
        </Pressable>

        {showPhysical ? (
          <View style={styles.dotsRow}>
            {(["physical", "virtual"] as const).map((item) => (
              <View key={item} style={[styles.dot, variant === item && styles.dotActive]} />
            ))}
          </View>
        ) : null}

        {onSendMoneyPress ? (
          <PrimaryButton
            testID="dashboard-sendMoneyButton"
            title={t.sendMoney}
            iconLeft={BanknoteArrowDown}
            onPress={onSendMoneyPress}
            style={detailStyles.sendMoneyButton}
          />
        ) : null}

        <View style={styles.cardToggleRow}>
          <Pressable
            testID="dashboard-toggleShowCardDataButton"
            onPress={() => setShowCardData(!showCardData)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            {showCardData ? (
              <Eye size={22} color={PURPLE} />
            ) : (
              <EyeOff size={22} color="#6B7280" />
            )}

            <Text style={styles.cardToggleText}>
              {showCardData ? t.hiddeData : t.showData}
            </Text>
          </Pressable>

          {!inactive ? (
            <View
              testID="dashboard-blockCardSwitchRow"
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              {active ? null : <Lock size={22} color="#6B7280" />}

              <Text style={styles.cardToggleText}>
                {active ? t.cardActiveLabel : t.cardBlockedLabel}
              </Text>

              <Switch
                testID="dashboard-blockCardSwitch"
                accessibilityLabel={active ? t.blockCardButton : t.unblockCardButton}
                value={active}
                onValueChange={setActive}
                trackColor={{ false: "#3B3B55", true: PURPLE }}
                thumbColor="#FFFFFF"
              />
            </View>
          ) : null}
        </View>

        <View style={detailStyles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>{t.activity}</Text>

          {onViewAllActivity ? (
            <Pressable testID="cardDetail-viewAllActivityButton" onPress={onViewAllActivity}>
              <Text style={detailStyles.seeAll}>{t.seeAll}</Text>
            </Pressable>
          ) : null}
        </View>

        <CardActivityPreview
          t={t}
          state={activity}
          limit={2}
          itemTestID="cardDetail-activityItem"
        />
      </ScrollView>
    </View>
  );
}

const detailStyles = StyleSheet.create({
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  seeAll: {
    ...typography.link,
    color: PURPLE,
  },
  card: {
    width: "95%",
    marginBottom: 16,
    alignSelf: "center",
  },
  sendMoneyButton: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  modalScroll: {
    flex: 1,
    alignSelf: "stretch",
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
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
  cardTypeToggle: {
    marginBottom: spacing.lg,
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 2,
    marginBottom: spacing.md,
  },
  backText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text.primary,
  },
});
