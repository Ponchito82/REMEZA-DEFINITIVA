import KeyboardAwareScrollView from "../components/ui/KeyboardAwareScrollView";
import React, { useState } from "react";
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
import {
  ShieldOff,
  Eye,
  EyeOff,
  Lock,
  LockOpen,
} from "lucide-react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import { styles } from "../theme/styles";
import { GLASS_BORDER, PURPLE, colors } from "../theme/colors";
import { GlassBanner } from "../components/ui";
import { ActivityItem, BalanceHeader, RemezaCardBack } from "../components/remeza";
import { spacing, screenPadding } from "../theme/spacing";

/** Datos de la tarjeta de muestra: los mismos valores que antes iban en linea. */
const CARD_DEMO = {
  number: "1234 5678 9012 4590",
  last4: "4590",
  expiry: "12/28",
  cvv: "123",
};

type Props = {
  t: any;

  /** Nombre completo con el que se registro; se pinta en el reverso de las tarjetas. */
  holderName: string;

  isFactoryInactive: boolean;
  isCardActive: boolean;
  setIsCardActive: (value: boolean) => void;

  setIsMenuOpen: (value: boolean) => void;
  /** Abre Cuentas multidivisa al tocar el saldo */
  onBalancePress?: () => void;

  transactions: any[];

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

  /** Recordatorio de biometria (una vez al dia, si no se activo). Toca para ir a activarla. */
  biometricReminderVisible?: boolean;
  onBiometricReminderPress?: () => void;
};

export default function DashboardView({
  t,
  holderName,
  isFactoryInactive,
  isCardActive,
  setIsCardActive,
  setIsMenuOpen,
  onBalancePress,
  transactions,
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
  biometricReminderVisible = false,
  onBiometricReminderPress = () => {},
}: Props) {
  const [hideBalance, setHideBalance] = useState(false);

  const isPhysicalFormValid =
    secureCode.length === 6 &&
    cardNumber.replace(/\s/g, "").length === 16 &&
    expiryDate.length === 5 &&
    cvv.length >= 3;

  const isVirtualFormValid =
    birthDate.length === 10 && virtualSecureCode.length === 6;

  // Tras activar, las dos tarjetas muestran los datos capturados en la activacion.
  const enteredNumber = cardNumber.replace(/\s/g, "");
  const cardData =
    !isFactoryInactive && enteredNumber.length === 16
      ? { number: cardNumber, last4: enteredNumber.slice(-4), expiry: expiryDate, cvv }
      : CARD_DEMO;

  return (
    <View style={styles.dashboardScreen}>
      <View style={dashboardStyles.header}>
        <BalanceHeader
          testID="dashboard-balance"
          label={t.myBalance}
          amount="$2,450.00"
          onMenuPress={() => setIsMenuOpen(true)}
          onBalancePress={onBalancePress}
          menuTestID="dashboard-menuButton"
          hidden={hideBalance}
          onToggleHidden={() => setHideBalance((prev) => !prev)}
          hideBalanceAccessibilityLabel={t.hideBalance}
          showBalanceAccessibilityLabel={t.showBalance}
        />
      </View>

      <Modal
        visible={showSecureCodeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSecureCodeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAwareScrollView
            style={dashboardStyles.modalScroll}
            contentContainerStyle={dashboardStyles.modalScrollContent}
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
            style={dashboardStyles.modalScroll}
            contentContainerStyle={dashboardStyles.modalScrollContent}
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

        {isFactoryInactive && !showSuccessMessage && (
          <View style={styles.inactiveCardMessage}>
            <Pressable
              testID="dashboard-inactiveCardTitle"
              onPress={() => {
                if (activeCardIndex === 0) {
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
                if (activeCardIndex === 0) {
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

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(e) => {
            const index = Math.round(
              e.nativeEvent.contentOffset.x /
              e.nativeEvent.layoutMeasurement.width
            );
            setActiveCardIndex(index);
          }}
          scrollEventThrottle={16}
        >
          <View style={styles.cardSlide}>
            <Text style={styles.cardTypeLabel}>{t.physical}</Text>

            <Pressable
              testID="dashboard-physicalCardPressable"
              onPress={() => {
                if (isFactoryInactive) {
                  setShowSecureCodeModal(true);
                }
              }}
            >
              <RemezaCardBack
                testID="dashboard-physicalCard"
                t={t}
                holderName={holderName}
                number={cardData.number}
                last4={cardData.last4}
                expiry={cardData.expiry}
                cvv={cardData.cvv}
                showData={showCardData}
                dimmed={!(isCardActive && !isFactoryInactive)}
                onCopyNumber={() => Clipboard.setString(cardNumber.replace(/\s/g, ""))}
                copyTestID="dashboard-copyPhysicalCardNumberButton"
                onCopyCvv={() => Clipboard.setString(cardData.cvv)}
                copyCvvTestID="dashboard-copyPhysicalCvvButton"
                style={dashboardStyles.card}
              >
                {!isFactoryInactive && !isCardActive && (
                  <View style={styles.virtualCardOverlay}>
                    <ShieldOff size={48} color="#fff" />
                    <Text style={styles.virtualCardOverlayText}>
                      {t.cardOff}
                    </Text>
                  </View>
                )}
              </RemezaCardBack>
            </Pressable>
          </View>

          <View style={styles.cardSlide}>
            <Text style={styles.cardTypeLabel}>{t.virtual}</Text>

            <Pressable
              testID="dashboard-virtualCardPressable"
              onPress={() => {
                if (isFactoryInactive) {
                  setShowVirtualCardModal(true);
                }
              }}
            >
              <RemezaCardBack
                testID="dashboard-virtualCard"
                t={t}
                holderName={holderName}
                number={cardData.number}
                last4={cardData.last4}
                expiry={cardData.expiry}
                cvv={cardData.cvv}
                showData={showCardData}
                dimmed={!(isCardActive && !isFactoryInactive)}
                onCopyNumber={() => Clipboard.setString(cardNumber.replace(/\s/g, ""))}
                copyTestID="dashboard-copyVirtualCardNumberButton"
                onCopyCvv={() => Clipboard.setString(cardData.cvv)}
                copyCvvTestID="dashboard-copyVirtualCvvButton"
                style={dashboardStyles.card}
              >
                {!isFactoryInactive && !isCardActive && (
                  <View style={styles.virtualCardOverlay}>
                    <ShieldOff size={48} color="#fff" />
                    <Text style={styles.virtualCardOverlayText}>
                      {t.cardOff}
                    </Text>
                  </View>
                )}
              </RemezaCardBack>
            </Pressable>
          </View>
        </ScrollView>

        <View style={styles.dotsRow}>
          {[0, 1].map((index) => (
            <View
              key={index}
              style={[
                styles.dot,
                activeCardIndex === index && styles.dotActive,
              ]}
            />
          ))}
        </View>

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
              {isCardActive ? (
                <LockOpen size={22} color={PURPLE} />
              ) : (
                <Lock size={22} color="#6B7280" />
              )}

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

const dashboardStyles = StyleSheet.create({
  card: {
    width: "95%",
    marginBottom: 16,
  },
  /** Con el teclado abierto el modal deja de caber: se desplaza en lugar de recortarse */
  modalScroll: {
    flex: 1,
    alignSelf: "stretch",
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  header: {
    paddingHorizontal: screenPadding,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  bioReminderNotice: {
    marginBottom: spacing.lg,
  },
});