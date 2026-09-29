import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Compass } from "lucide-react-native";
import { tokens } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { metrics } from "../../theme/radius";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";

type Props = {
  t: any;
  visible: boolean;
  onShowAgain: () => void;
  onNotNow: () => void;
  onDontAskAgain: () => void;
};

/**
 * Aviso al reingresar (tras cerrar sesion): pregunta si se quiere repetir la
 * guia paso a paso. Las tres salidas del pedido: si, ahora no (puede
 * reaparecer en otro login) y no volver a preguntar.
 */
export default function TourPromptModal({ t, visible, onShowAgain, onNotNow, onDontAskAgain }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onNotNow}>
      <Pressable style={styles.overlay} onPress={onNotNow}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.badge}>
            <Compass size={22} color={tokens.violet} strokeWidth={1.75} />
          </View>

          <Text style={styles.title}>{t.tourPromptTitle}</Text>

          <View style={styles.actions}>
            <PrimaryButton
              testID="tourPrompt-showAgainButton"
              title={t.tourPromptShowAgain}
              onPress={onShowAgain}
            />
            <SecondaryButton
              testID="tourPrompt-notNowButton"
              title={t.tourPromptNotNow}
              onPress={onNotNow}
            />
            <Pressable testID="tourPrompt-dontAskAgainButton" onPress={onDontAskAgain} hitSlop={8}>
              <Text style={styles.dismissText}>{t.tourPromptDontAskAgain}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(2,3,15,0.72)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  sheet: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: tokens.sheetSurface,
    borderRadius: metrics.radius.card,
    borderWidth: 1,
    borderColor: tokens.glassBorderStrong,
    padding: spacing.xl,
    alignItems: "center",
  },
  badge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(80,55,255,0.18)",
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: tokens.textPrimary,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  actions: {
    width: "100%",
    gap: spacing.sm,
    alignItems: "center",
  },
  dismissText: {
    marginTop: spacing.xs,
    fontSize: 13,
    fontWeight: "600",
    color: tokens.textSecondary,
    textDecorationLine: "underline",
  },
});
