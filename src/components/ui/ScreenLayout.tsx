import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
} from "react-native";
import { colors } from "../../theme/colors";
import { metrics } from "../../theme/radius";
import { spacing } from "../../theme/spacing";
import BackButton from "./BackButton";

type Props = {
  children: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  backTestID?: string;
  backAccessibilityLabel?: string;
  /** Envuelve en KeyboardAvoidingView: pantallas con inputs */
  keyboard?: boolean;
  /**
   * Tapa las esferas y la marca de agua del fondo global con el color base,
   * para pantallas que deben ir lisas.
   */
  plain?: boolean;
  /** Botones fijos abajo, fuera del scroll */
  footer?: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  /** Ref del ScrollView, para pantallas que desplazan hasta un campo */
  scrollRef?: React.Ref<ScrollView>;
  testID?: string;
};

/**
 * Esqueleto de las pantallas rediseñadas: scroll con `flexGrow: 1`, boton de
 * retroceso opcional y pie fijo opcional.
 *
 * No monta SafeAreaView ni el fondo: `ScreenBackground` envuelve a toda la app
 * y ya aplica las areas seguras y las esferas una sola vez. Repetirlos aqui
 * duplicaria el margen y la opacidad del brillo. Las lineas de luz se activan
 * en ese mismo fondo global, por pantalla, desde `App`.
 */
export default function ScreenLayout({
  children,
  showBack = false,
  onBack,
  backTestID,
  backAccessibilityLabel,
  keyboard = false,
  plain = false,
  footer,
  contentStyle,
  scrollRef,
  testID,
}: Props) {
  return (
    <View style={styles.root} testID={testID}>
      {plain ? <View style={styles.plain} pointerEvents="none" /> : null}

      <KeyboardAvoidingView
        style={styles.root}
        enabled={keyboard}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={[styles.content, contentStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {showBack && onBack ? (
            <BackButton
              testID={backTestID}
              accessibilityLabel={backAccessibilityLabel}
              onPress={onBack}
            />
          ) : null}

          {children}
        </ScrollView>

        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  plain: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.bg.base,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: metrics.gutter,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  footer: {
    paddingHorizontal: metrics.gutter,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
});
