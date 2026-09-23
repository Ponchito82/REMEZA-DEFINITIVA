import React, { useState } from "react";
import { Modal, Animated, Pressable, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  User,
  History,
  Package,
  UserCheck,
  BanknoteArrowDown,
  FileText,
  Globe,
  LogOut,
} from "lucide-react-native";

import { CloseButton, OptionSheet } from "./ui";
import { DrawerItem } from "./remeza";
import { colors } from "../theme/colors";
import { spacing, screenPadding } from "../theme/spacing";
import { COUNTRY_NAMES, CountryCode, countryOptions } from "../services/geo";
import { Language, ViewName } from "../types/app";

type Props = {
  t: any;
  language: Language;
  visible: boolean;
  overlayOpacity: Animated.Value;
  drawerTranslateX: Animated.Value;
  setIsMenuOpen: (value: boolean) => void;
  setView: (view: ViewName) => void;
};

export default function DrawerMenu({
  t,
  language,
  visible,
  overlayOpacity,
  drawerTranslateX,
  setIsMenuOpen,
  setView,
}: Props) {
  const insets = useSafeAreaInsets();
  const [isNationalityOpen, setNationalityOpen] = useState(false);
  const [nationality, setNationality] = useState<CountryCode>("MX");

  const go = (view: ViewName) => {
    setIsMenuOpen(false);
    setView(view);
  };

  const items = [
    { id: "profile", icon: User, label: t.profile, onPress: () => go("profile") },
    { id: "transactions", icon: History, label: t.transactions, onPress: () => go("transactions") },
    { id: "physicalCard", icon: Package, label: t.requestPhysicalCard, onPress: () => go("physicalCard") },
    { id: "beneficiaries", icon: UserCheck, label: t.beneficiaries, onPress: () => go("beneficiaries") },
    { id: "sendMoney", icon: BanknoteArrowDown, label: t.sendMoney, onPress: () => go("sendMoney") },
    { id: "dispute", icon: FileText, label: t.disputeTitle, onPress: () => go("disputeOptions") },
    { id: "multiCurrency", icon: Globe, label: t.multiCurrencyTitle, onPress: () => go("multiCurrency") },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={() => setIsMenuOpen(false)}
    >
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        <Pressable
          testID="drawer-overlay"
          style={StyleSheet.absoluteFill}
          onPress={() => setIsMenuOpen(false)}
        />
      </Animated.View>

      <Animated.View
        style={[styles.drawer, { transform: [{ translateX: drawerTranslateX }] }]}
      >
        <View style={[styles.content, { paddingTop: insets.top + spacing.lg }]}>
          <CloseButton
            testID="drawer-closeButton"
            shape="circle"
            onPress={() => setIsMenuOpen(false)}
            style={styles.close}
          />

          {items.map((item) => (
            <DrawerItem
              key={item.id}
              testID={`drawer-${item.id}Item`}
              icon={item.icon}
              label={item.label}
              onPress={item.onPress}
            />
          ))}

          <DrawerItem
            testID="drawer-nationalityItem"
            icon={Globe}
            label={t.nationality}
            showChevron
            onPress={() => setNationalityOpen(true)}
          />

          <View style={styles.spacer} />

          <DrawerItem
            testID="drawer-logoutItem"
            icon={LogOut}
            label={t.logout}
            danger
            last
            onPress={() => go("login")}
          />
        </View>
      </Animated.View>

      <OptionSheet
        visible={isNationalityOpen}
        onClose={() => setNationalityOpen(false)}
        title={t.nationality}
        icon={Globe}
        options={countryOptions(language).map((option) => ({
          label: COUNTRY_NAMES[option.value as CountryCode][language],
          value: option.value,
        }))}
        value={nationality}
        onSelect={(next) => {
          setNationality(next as CountryCode);
          setNationalityOpen(false);
        }}
        testID="drawer-nationalitySheet"
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(2,2,26,0.72)",
  },
  /**
   * Panel **opaco**: con una superficie translucida se transparentaba el
   * dashboard de atras y las filas costaban de leer.
   */
  drawer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: 300,
    backgroundColor: colors.sheetSurface,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 24,
    shadowOffset: { width: -6, height: 0 },
    elevation: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: screenPadding,
    paddingBottom: spacing.xxl,
  },
  close: {
    alignSelf: "flex-end",
    marginBottom: spacing.lg,
  },
  spacer: {
    flex: 1,
  },
});
