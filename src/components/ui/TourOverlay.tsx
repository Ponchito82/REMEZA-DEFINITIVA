import React from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { X } from "lucide-react-native";
import { tokens } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { metrics, radius } from "../../theme/radius";
import { TOUR_STEPS } from "../../onboarding/tourSteps";
import PrimaryButton from "./PrimaryButton";
import StepProgress from "./StepProgress";

type Props = {
  t: any;
  stepIndex: number;
  onNext: () => void;
  onSkip: () => void;
};

/**
 * Guia paso a paso: solo un mensaje centrado por paso (titulo, descripcion y
 * progreso), sin resaltar ningun elemento de la pantalla.
 */
export default function TourOverlay({ t, stepIndex, onNext, onSkip }: Props) {
  const step = TOUR_STEPS[stepIndex];
  const isLast = stepIndex === TOUR_STEPS.length - 1;

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onSkip}
    >
      <View style={styles.overlay}>
        <Pressable
          testID="onboardingTour-skipButton"
          accessibilityRole="button"
          accessibilityLabel={t.tourSkip}
          onPress={onSkip}
          style={styles.skipButton}
          hitSlop={10}
        >
          <X size={15} color={tokens.textPrimary} strokeWidth={2} />
          <Text style={styles.skipText}>{t.tourSkip}</Text>
        </Pressable>

        <View style={styles.card}>
          <StepProgress
            testID="onboardingTour-progress"
            total={TOUR_STEPS.length}
            current={stepIndex + 1}
            style={styles.progress}
          />
          <Text style={styles.title}>{t[step.titleKey]}</Text>
          <Text style={styles.description}>{t[step.descriptionKey]}</Text>

          <PrimaryButton
            testID="onboardingTour-nextButton"
            title={isLast ? t.tourFinish : t.tourNext}
            onPress={onNext}
            showArrow={!isLast}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(2,2,26,0.88)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  skipButton: {
    position: "absolute",
    top: spacing.xxl,
    right: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  skipText: {
    color: tokens.textPrimary,
    fontSize: 13,
    fontWeight: "700",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: tokens.sheetSurface,
    borderRadius: metrics.radius.card,
    borderWidth: 1,
    borderColor: tokens.glassBorderStrong,
    padding: spacing.xl,
  },
  progress: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 19,
    fontWeight: "800",
    color: tokens.textPrimary,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: tokens.textSecondary,
    marginBottom: spacing.xl,
  },
});
