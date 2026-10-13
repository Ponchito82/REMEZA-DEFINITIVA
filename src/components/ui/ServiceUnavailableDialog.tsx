import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CloudOff } from "lucide-react-native";
import { tokens, PURPLE } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { metrics } from "../../theme/radius";
import PrimaryButton from "./PrimaryButton";

type Props = {
  t: any;
  onAccept: () => void;
};

/**
 * Aviso emergente de "Servicio no disponible", con el mismo estilo que la
 * tarjeta de la guia paso a paso (`TourOverlay`): fondo atenuado, tarjeta
 * `sheetSurface` y el boton principal con degradado. No es un Modal y la capa
 * absorbe los toques, asi que la app de atras no responde hasta aceptar.
 */
export default function ServiceUnavailableDialog({ t, onAccept }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      testID="serviceUnavailable"
      style={[styles.layer, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}
    >
      <View style={styles.card}>
        <View style={styles.iconWrap}>
          <CloudOff size={26} color={PURPLE} strokeWidth={2} />
        </View>
        <Text style={styles.title}>{t.serviceUnavailable}</Text>
        <PrimaryButton
          testID="serviceUnavailable-acceptButton"
          title={t.serviceUnavailableAccept}
          onPress={onAccept}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1100,
    elevation: 1100,
    backgroundColor: "rgba(2,2,26,0.78)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: tokens.sheetSurface,
    borderRadius: metrics.radius.card,
    borderWidth: 1,
    borderColor: tokens.glassBorderStrong,
    padding: spacing.lg,
    alignItems: "stretch",
  },
  iconWrap: {
    alignSelf: "center",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: tokens.textPrimary,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
});
