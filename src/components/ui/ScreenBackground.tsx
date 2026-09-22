import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../theme/colors";
import BackgroundOrbs from "./BackgroundOrbs";

type Props = {
  children?: React.ReactNode;
};

/**
 * Lienzo comun de toda la app: fondo de marca y area segura.
 *
 * Las esferas se montan **una sola vez** aqui, y no en cada pantalla: el
 * router entero va envuelto por este componente, asi que basta con esto para
 * que todas las pantallas compartan el mismo fondo. Pintarlas tambien dentro
 * de una pantalla las superpondria y duplicaria su opacidad.
 */
export default function ScreenBackground({ children }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <BackgroundOrbs />

      <View style={[styles.content, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
});
