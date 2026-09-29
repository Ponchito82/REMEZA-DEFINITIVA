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
import { PrimaryButton, RemezaLogo } from "../components/ui";
import { ActivityItem, CardTypeToggle, RemezaCardBack } from "../components/remeza";
import { spacing, screenPadding } from "../theme/spacing";
import { useHardwareBack } from "../hooks/useHardwareBack";

/** Datos de la tarjeta de muestra: los mismos valores que antes iban en linea. */
const CARD_DEMO = {
  number: "1234 5678 9012 4590",
  last4: "4590",
  expiry: "12/28",
  cvv: "123",
};

type Props = {
  t: any;
  holderName: string;

  isFactoryInactive: boolean;
  isCardActive: boolean;
  setIsCardActive: (value: boolean) => void;

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

  /** Actividad reducida (2 movimientos), igual en fisica y virtual. */
  transactions: any[];
};

/**
 * Pantalla de la tarjeta (fisica o virtual), a la que se llega desde "Mis
 * tarjetas" en el dashboard. El selector Fisica/Virtual cambia cual tarjeta
 * se ve sin salir de la pantalla; ambas comparten el mismo flujo de
 * activacion que antes vivia en el dashboard.
 */
export default function CardDetailScreen({
  t,
  holderName,
  isFactoryInactive,
  isCardActive,
  setIsCardActive,
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
  transactions,
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
  const enteredNumber = cardNumber.replace(/\s/g, "");
  const cardData =
    !isFactoryInactive && enteredNumber.length === 16
      ? { number: cardNumber, last4: enteredNumber.slice(-4), expiry: expiryDate, cvv }
      : CARD_DEMO;

  const variant: "physical" | "virtual" = activeCardIndex === 0 ? "physical" : "virtual";

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

        <CardTypeToggle
          testID="cardDetail-typeToggle"
          value={variant}
          onChange={(next) => setActiveCardIndex(next === "physical" ? 0 : 1)}
          physicalLabel={t.physical}
          virtualLabel={t.virtual}
          style={detailStyles.cardTypeToggle}
        />

        {isFactoryInactive && !showSuccessMessage && (
          <View style={styles.inactiveCardMessage}>
            <Pressable
              testID="dashboard-inactiveCardTitle"
              onPress={() => {
                if (variant === "physical") {
                  setShowSecureCodeModal(true);
                } else {
                  setShowVirtualCardModal(true);
                }
              }}
            >
              <Text style={styles.inactiveCardTitle}>{t.inactiveCard}</Text>
            </Pressable>

            <Pressable
              testID="dashboard-activateNowButton"
              onPress={() => {
                if (variant === "physical") {
                  setShowSecureCodeModal(true);
                } else {
                  setShowVirtualCardModal(true);
                }
              }}
            >
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
          onPress={() => {
            if (isFactoryInactive) {
              if (variant === "physical") {
                setShowSecureCodeModal(true);
              } else {
                setShowVirtualCardModal(true);
              }
            }
          }}
        >
          <RemezaCardBack
            testID={variant === "physical" ? "dashboard-physicalCard" : "dashboard-virtualCard"}
            t={t}
            variant={variant}
            holderName={holderName}
            number={cardData.number}
            last4={cardData.last4}
            expiry={cardData.expiry}
            cvv={cardData.cvv}
            showData={showCardData}
            dimmed={!(isCardActive && !isFactoryInactive)}
            onCopyNumber={() => Clipboard.setString(cardNumber.replace(/\s/g, ""))}
            copyTestID={
              variant === "physical" ? "dashboard-copyPhysicalCardNumberButton" : "dashboard-copyVirtualCardNumberButton"
            }
            onCopyCvv={() => Clipboard.setString(cardData.cvv)}
            copyCvvTestID={
              variant === "physical" ? "dashboard-copyPhysicalCvvButton" : "dashboard-copyVirtualCvvButton"
            }
            style={detailStyles.card}
          >
            {!isFactoryInactive && !isCardActive && (
              <View style={styles.virtualCardOverlay}>
                <ShieldOff size={48} color="#fff" />
                <Text style={styles.virtualCardOverlayText}>{t.cardOff}</Text>
              </View>
            )}
          </RemezaCardBack>
        </Pressable>

        <View style={styles.dotsRow}>
          {[0, 1].map((index) => (
            <View
              key={index}
              style={[styles.dot, activeCardIndex === index && styles.dotActive]}
            />
          ))}
        </View>

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

          {!isFactoryInactive ? (
            <View
              testID="dashboard-blockCardSwitchRow"
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              {isCardActive ? null : <Lock size={22} color="#6B7280" />}

              <Text style={styles.cardToggleText}>
                {isCardActive ? t.cardActiveLabel : t.cardBlockedLabel}
              </Text>

              <Switch
                testID="dashboard-blockCardSwitch"
                accessibilityLabel={isCardActive ? t.blockCardButton : t.unblockCardButton}
                value={isCardActive}
                onValueChange={setIsCardActive}
                trackColor={{ false: "#3B3B55", true: PURPLE }}
                thumbColor="#FFFFFF"
              />
            </View>
          ) : null}
        </View>

        <Text style={styles.sectionTitle}>{t.activity}</Text>

        <View style={styles.stack12}>
          {transactions.map((item, index) => (
            <ActivityItem
              key={index}
              testID={`dashboard-activityItem-${index}`}
              label={item.label}
              amount={item.amount}
              direction={item.amount.trim().startsWith("+") ? "in" : "out"}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const detailStyles = StyleSheet.create({
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
