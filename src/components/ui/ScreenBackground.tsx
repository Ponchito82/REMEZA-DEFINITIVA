import React from "react";
import { View, ScrollView, StyleSheet, StatusBar } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../theme/colors";
import BackgroundOrbs from "./BackgroundOrbs";

type Props = {
  children?: React.ReactNode;
  /** "R" gigante detras del contenido */
  watermark?: boolean;
  /** Envuelve el contenido en un ScrollView, para pantallas largas */
  scroll?: boolean;
};

/**
 * Lienzo comun de toda la app: degradado de fondo, resplandores y area segura.
 *
 * Las esferas se montan **una sola vez** aqui, y no en cada pantalla: el
 * router entero va envuelto por este componente, asi que basta con esto para
 * que todas las pantallas compartan el mismo fondo. Pintarlas tambien dentro
 * de una pantalla las superpondria y duplicaria su opacidad.
 */
export default function ScreenBackground({
  children,
  watermark = true,
  scroll = false,
}: Props) {
  const insets = useSafeAreaInsets();
  const padding = { paddingTop: insets.top, paddingBottom: insets.bottom };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <LinearGradient
        colors={[colors.bg.base, colors.bg.deep, colors.bg.base]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <BackgroundOrbs watermark={watermark} />

      {scroll ? (
        <ScrollView
          style={styles.content}
          contentContainerStyle={padding}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, padding]}>{children}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg.base,
  },
  content: {
    flex: 1,
  },
});
