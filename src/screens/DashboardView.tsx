import React from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import {
  Menu,
  CreditCard,
  ShieldOff,
  Eye,
  EyeOff,
  Power
} from "lucide-react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import { Clipboard as ClipboardIcon } from "lucide-react-native";
import { styles } from "../theme/styles";
import { GLASS_BORDER, GLASS_SURFACE_STRONG, PURPLE } from "../theme/colors";

type Props = {
  t: any;

  isFactoryInactive: boolean;
  isCardActive: boolean;
  setIsCardActive: (value: boolean) => void;

  setIsMenuOpen: (value: boolean) => void;

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
};

export default function DashboardView({
  t,
  isFactoryInactive,
  isCardActive,
  setIsCardActive,
  setIsMenuOpen,
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
}: Props) {
  const isPhysicalFormValid =
    secureCode.length === 6 &&
    cardNumber.replace(/\s/g, "").length === 16 &&
    expiryDate.length === 5 &&
    cvv.length >= 3;

  const isVirtualFormValid =
    birthDate.length === 10 && virtualSecureCode.length === 6;

  return (
    <View style={styles.dashboardScreen}>
      <View style={styles.dashboardSafeTop}>
        <View style={styles.dashboardHeader}>
          <View>
            <Text style={styles.kicker}>{t.myBalance}</Text>
            <Text style={styles.balance}>$2,450.00</Text>
          </View>

          <Pressable
            testID="dashboard-menuButton"
            onPress={() => setIsMenuOpen(true)}
            style={({ pressed }) => [
              styles.iconButton,
              pressed && styles.iconButtonPressed,
            ]}
          >
            <Menu size={24} color="#374151" />
          </Pressable>
        </View>
      </View>

      <Modal
        visible={showSecureCodeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSecureCodeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t.activateYourCard}</Text>

            <View
              style={{
                width: "100%",
                marginTop: 16,
                padding: 16,
                borderRadius: 12,
                backgroundColor: GLASS_SURFACE_STRONG,
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
        </View>
      </Modal>

      <Modal
        visible={showVirtualCardModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowVirtualCardModal(false)}
      >
        <View style={styles.modalOverlay}>
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
        </View>
      </Modal>

      <ScrollView
        contentContainerStyle={styles.dashboardContent}
        showsVerticalScrollIndicator={false}
      >
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
              <View
                style={[
                  styles.virtualCard,
                  isCardActive && !isFactoryInactive
                    ? styles.virtualCardOn
                    : styles.virtualCardOff,
                ]}
              >
                {!isFactoryInactive && !isCardActive && (
                  <View style={styles.virtualCardOverlay}>
                    <ShieldOff size={48} color="#fff" />
                    <Text style={styles.virtualCardOverlayText}>
                      {t.cardOff}
                    </Text>
                  </View>
                )}

                <View style={styles.virtualCardInner}>
                  <CreditCard size={28} color="#fff" />
                  <View>
                    <Text style={styles.virtualCardNumber}>
                      {showCardData ? "1234 5678 9012 4590" : "•••• 4590"}
                    </Text>

                    {showCardData && (
                      <View
                        style={{
                          marginTop: 6,
                          flexDirection: "row",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Pressable
                          testID="dashboard-copyPhysicalCardNumberButton"
                          onPress={() => Clipboard.setString(cardNumber.replace(/\s/g, ""))}
                          style={{
                            paddingHorizontal: 8,
                            paddingVertical: 6,
                            borderRadius: 8,
                            backgroundColor: "rgba(255,255,255,0.15)",
                          }}
                        >
                          <ClipboardIcon size={16} color="#FFF" />
                        </Pressable>
                      </View>
                    )}

                    <Text style={styles.virtualCardName}>JOHN PEREZ</Text>

                    {showCardData && (
                      <View
                        style={{
                          marginTop: 8,
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <View>
                          <Text
                            style={{
                              color: "rgba(255,255,255,0.7)",
                              fontSize: 10,
                            }}
                          >
                            EXP
                          </Text>

                          <Text
                            style={{
                              color: "#FFF",
                              fontSize: 13,
                              fontWeight: "600",
                            }}
                          >
                            12/28
                          </Text>
                        </View>

                        <View>
                          <Text
                            style={{
                              color: "rgba(255,255,255,0.7)",
                              fontSize: 10,
                            }}
                          >
                            CCV
                          </Text>

                          <Text
                            style={{
                              color: "#FFF",
                              fontSize: 13,
                              fontWeight: "600",
                            }}
                          >
                            123
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              </View>
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
              <View
                style={[
                  styles.virtualCard,
                  isCardActive && !isFactoryInactive
                    ? styles.virtualCardOn
                    : styles.virtualCardOff,
                ]}
              >
                {!isFactoryInactive && !isCardActive && (
                  <View style={styles.virtualCardOverlay}>
                    <ShieldOff size={48} color="#fff" />
                    <Text style={styles.virtualCardOverlayText}>
                      {t.cardOff}
                    </Text>
                  </View>
                )}

                <View style={styles.virtualCardInner}>
                  <CreditCard size={28} color="#fff" />
                  <View>
                    <Text style={styles.virtualCardNumber}>
                      {showCardData ? "1234 5678 9012 4590" : "•••• 4590"}
                    </Text>

                    {showCardData && (
                      <View
                        style={{
                          marginTop: 6,
                          flexDirection: "row",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Pressable
                          testID="dashboard-copyVirtualCardNumberButton"
                          onPress={() => Clipboard.setString(cardNumber.replace(/\s/g, ""))}
                          style={{
                            paddingHorizontal: 8,
                            paddingVertical: 6,
                            borderRadius: 8,
                            backgroundColor: "rgba(255,255,255,0.15)",
                          }}
                        >
                          <ClipboardIcon size={16} color="#FFF" />
                        </Pressable>
                      </View>
                    )}

                    <Text style={styles.virtualCardName}>JOHN PEREZ</Text>

                    {showCardData && (
                      <View
                        style={{
                          marginTop: 8,
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <View>
                          <Text
                            style={{
                              color: "rgba(255,255,255,0.7)",
                              fontSize: 10,
                            }}
                          >
                            EXP
                          </Text>

                          <Text
                            style={{
                              color: "#FFF",
                              fontSize: 13,
                              fontWeight: "600",
                            }}
                          >
                            12/28
                          </Text>
                        </View>

                        <View>
                          <Text
                            style={{
                              color: "rgba(255,255,255,0.7)",
                              fontSize: 10,
                            }}
                          >
                            CCV
                          </Text>

                          <Text
                            style={{
                              color: "#FFF",
                              fontSize: 13,
                              fontWeight: "600",
                            }}
                          >
                            123
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              </View>
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

          <Pressable
            testID="dashboard-toggleCardActiveSwitch"
            disabled={isFactoryInactive}
            onPress={() => setIsCardActive(!isCardActive)}
            style={[
              styles.switchTrack,
              {
                backgroundColor:
                  isCardActive && !isFactoryInactive ? PURPLE : GLASS_BORDER,
                opacity: isFactoryInactive ? 0.5 : 1,
              },
            ]}
          >
            <Power
              size={18}
              color={isCardActive && !isFactoryInactive ? "#fff" : "#6B7280"}
              style={{
                position: "absolute",
                left: isCardActive && !isFactoryInactive ? 31 : 8,
                top: 6,
                zIndex: 2,
              }}
            />

            <View
              style={[
                styles.switchThumb,
                {
                  left: isCardActive && !isFactoryInactive ? 25 : 4,
                },
              ]}
            />
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>{t.activity}</Text>

        <View style={styles.stack12}>
          {transactions.map((item, index) => (
            <View key={index} style={styles.activityRow}>
              <View style={styles.activityLeft}>
                <View
                  style={[
                    styles.activityIcon,
                    { backgroundColor: item.bg },
                  ]}
                >
                  {item.icon}
                </View>

                <Text style={styles.activityLabel}>{item.label}</Text>
              </View>

              <Text style={[styles.activityAmount, { color: item.color }]}>
                {item.amount}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}