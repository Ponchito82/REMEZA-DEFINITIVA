import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Lock } from "lucide-react-native";
import { colors, tokens, PURPLE } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { metrics } from "../../theme/radius";
import PrimaryButton from "./PrimaryButton";

type Props = {
  title: string;
  body: string;
  acceptLabel: string;
  /** Sin cancelLabel el aviso solo tiene el boton de aceptar. */
  cancelLabel?: string;
  onAccept: () => void;
  onCancel: () => void;
  testID?: string;
};

/**
 * Aviso previo a solicitar la tarjeta de credito: el deposito en garantia no se
 * puede retirar durante al menos un ano. Mismo estilo que `ServiceUnavailableDialog`.
 */
export default function CreditDepositNoticeDialog({ title, body, acceptLabel, cancelLabel, onAccept, onCancel, testID = "creditDepositNotice" }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      testID={testID}
      style={[styles.layer, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}
    >
      <View style={styles.card}>
        <View style={styles.iconWrap}>
          <Lock size={26} color={PURPLE} strokeWidth={2} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
        <PrimaryButton
          testID={`${testID}-acceptButton`}
          title={acceptLabel}
          onPress={onAccept}
        />
        {cancelLabel ? (
          <Pressable
            testID={`${testID}-cancelButton`}
            accessibilityRole="button"
            onPress={onCancel}
            hitSlop={8}
            style={styles.cancel}
          >
            <Text style={styles.cancelText}>{cancelLabel}</Text>
          </Pressable>
        ) : null}
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
    marginBottom: spacing.sm,
  },
  body: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  cancel: {
    alignSelf: "center",
    paddingTop: spacing.md,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text.secondary,
  },
});
