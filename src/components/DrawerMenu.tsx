import React from "react";
import { Modal, Animated, Pressable, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  User,
  History,
  Package,
  UserCheck,
  BanknoteArrowDown,
  Coins,
  LogOut,
} from "lucide-react-native";

import { CloseButton } from "./ui";
import { DrawerItem } from "./remeza";
import { colors } from "../theme/colors";
import { spacing, screenPadding } from "../theme/spacing";
import { ViewName } from "../types/app";
import { tourRef } from "../onboarding/tourTargets";

type Props = {
  t: any;
  visible: boolean;
  overlayOpacity: Animated.Value;
  drawerTranslateX: Animated.Value;
  setIsMenuOpen: (value: boolean) => void;
  setView: (view: ViewName) => void;
  /** Cierre de sesion. Sin el, el item navega directo al login como antes. */
  onLogout?: () => void;
  /** Con la tarjeta fisica ya activada, "Solicitar tarjeta" deja de tener sentido y se oculta. */
  physicalCardActive?: boolean;
  /**
   * `TourOverlay` de la guia, cuando esta activa y el menu esta abierto. El
   * Modal del drawer es su propia ventana nativa: un `TourOverlay` suelto en
   * el arbol normal de la app queda tapado por esta. Pasandolo como hijo
   * aqui, queda en la misma ventana y se ve por encima del panel.
   */
  tourOverlay?: React.ReactNode;
};

export default function DrawerMenu({
  t,
  visible,
  overlayOpacity,
  drawerTranslateX,
  setIsMenuOpen,
  setView,
  onLogout,
  physicalCardActive = false,
  tourOverlay,
}: Props) {
  const insets = useSafeAreaInsets();

  const go = (view: ViewName) => {
    setIsMenuOpen(false);
    setView(view);
  };

  const items = [
    { id: "profile", icon: User, label: t.profile, onPress: () => go("profile") },
    { id: "transactions", icon: History, label: t.transactions, onPress: () => go("transactions") },
    ...(physicalCardActive
      ? []
      : [{ id: "physicalCard", icon: Package, label: t.requestPhysicalCard, onPress: () => go("physicalCard") }]),
    { id: "beneficiaries", icon: UserCheck, label: t.beneficiaries, onPress: () => go("beneficiaries") },
    { id: "sendMoney", icon: BanknoteArrowDown, label: t.sendMoney, onPress: () => go("sendMoney") },
    // Pagos de servicio: oculto por ahora. La ruta `servicePayments` sigue en App.
    { id: "multiCurrency", icon: Coins, label: t.multiCurrencyTitle, onPress: () => go("multiCurrency") },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
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
        <View
          style={[
            styles.content,
            {
              paddingTop: insets.top + spacing.lg,
              paddingBottom: insets.bottom + spacing.xxl,
            },
          ]}
        >
          <CloseButton
            testID="drawer-closeButton"
            shape="circle"
            onPress={() => setIsMenuOpen(false)}
            style={styles.close}
          />

          {items.map((item) =>
            item.id === "profile" ? (
              <View key={item.id} ref={tourRef("drawerProfile")} collapsable={false}>
                <DrawerItem
                  testID={`drawer-${item.id}Item`}
                  icon={item.icon}
                  label={item.label}
                  onPress={item.onPress}
                />
              </View>
            ) : (
              <DrawerItem
                key={item.id}
                testID={`drawer-${item.id}Item`}
                icon={item.icon}
                label={item.label}
                onPress={item.onPress}
              />
            )
          )}

          <View style={styles.spacer} />

          <DrawerItem
            testID="drawer-logoutItem"
            icon={LogOut}
            label={t.logout}
            danger
            last
            onPress={() => {
              if (!onLogout) return go("login");
              setIsMenuOpen(false);
              onLogout();
            }}
          />
        </View>
      </Animated.View>

      {tourOverlay}
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
   * dashboard de atras y las filas costaban de leer. El Modal va con
   * `statusBarTranslucent`/`navigationBarTranslucent` para que overlay y panel
   * cubran tambien las barras del sistema; sin eso el panel empezaba bajo la
   * barra de estado, dejaba franjas sin oscurecer y el `insets.top` se sumaba
   * dos veces.
   */
  drawer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: 300,
    backgroundColor: colors.sheetSurface,
    boxShadow: "-6px 0px 24px 0px rgba(0,0,0,0.3)",
  },
  content: {
    flex: 1,
    paddingHorizontal: screenPadding,
  },
  close: {
    alignSelf: "flex-end",
    marginBottom: spacing.lg,
  },
  spacer: {
    flex: 1,
  },
});
