import React from "react";
import { Modal, Animated, Pressable, SafeAreaView, View, Text, StyleSheet } from "react-native";
import { X, User, History, Package, Wallet, LogOut } from "lucide-react-native";
import { styles } from "../theme/styles";
import { ViewName } from "../types/app";
import { BanknoteArrowDown, UserCheck } from "lucide-react-native/icons";

type Props = {
  t: any;
  visible: boolean;
  overlayOpacity: Animated.Value;
  drawerTranslateX: Animated.Value;
  setIsMenuOpen: (value: boolean) => void;
  setView: (view: ViewName) => void;
};

export default function DrawerMenu({
  t,
  visible,
  overlayOpacity,
  drawerTranslateX,
  setIsMenuOpen,
  setView,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={() => setIsMenuOpen(false)}>
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        <Pressable testID="drawer-overlay" style={StyleSheet.absoluteFill} onPress={() => setIsMenuOpen(false)} />
      </Animated.View>

      <Animated.View style={[styles.drawer, { transform: [{ translateX: drawerTranslateX }] }]}>
        <SafeAreaView style={styles.drawerContent}>
          <Pressable testID="drawer-closeButton" onPress={() => setIsMenuOpen(false)} style={styles.drawerClose}>
            <X size={24} color="#111827" />
          </Pressable>

          <View style={styles.stack16}>
            <Pressable testID="drawer-profileItem" style={styles.drawerItem} onPress={() => { setIsMenuOpen(false); setView("profile"); }}>
              <User size={20} color="#374151" />
              <Text style={styles.drawerItemText}>{t.profile}</Text>
            </Pressable>

            <Pressable testID="drawer-transactionsItem" style={styles.drawerItem} onPress={() => { setIsMenuOpen(false); setView("transactions"); }}>
              <History size={20} color="#374151" />
              <Text style={styles.drawerItemText}>{t.transactions}</Text>
            </Pressable>

            <Pressable testID="drawer-physicalCardItem" style={styles.drawerItem} onPress={() => { setIsMenuOpen(false); setView("physicalCard"); }}>
              <Package size={20} color="#374151" />
              <Text style={styles.drawerItemText}>{t.requestPhysicalCard}</Text>
            </Pressable>

            {
}

            <Pressable testID="drawer-beneficiariesItem" style={styles.drawerItem} onPress={() => { setIsMenuOpen(false); setView("beneficiaries"); }}>
              <UserCheck size={20} color="#374151" />
              <Text style={styles.drawerItemText}>{t.beneficiaries}</Text>
            </Pressable>

            <Pressable testID="drawer-sendMoneyItem" style={styles.drawerItem} onPress={() => { setIsMenuOpen(false); setView("sendMoney"); }}>
              <BanknoteArrowDown size={20} color="#374151" />
              <Text style={styles.drawerItemText}>{t.sendMoney}</Text>
            </Pressable>
          </View>

          <View style={styles.spacer} />

          <Pressable testID="drawer-logoutItem" onPress={() => { setIsMenuOpen(false); setView("login"); }} style={styles.drawerItem}>
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.drawerLogoutText}>{t.logout}</Text>
          </Pressable>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
}