import React, { useRef, useState } from "react";
import { Animated, ScrollView, StyleSheet } from "react-native";
import { FileText, MessageSquareWarning, FileX2, Clock } from "lucide-react-native";

import { Button, CloseButton, IconCircle, ScreenHeader } from "../components/ui";
import { ListItemCard } from "../components/remeza";
import type { IconComponent } from "../components/ui";
import { sizes } from "../theme/radius";
import { spacing, screenPadding } from "../theme/spacing";
import { ViewName } from "../types/app";

type Option = {
  id: string;
  icon: IconComponent;
  titleKey: string;
  descKey: string;
};

const OPTIONS: Option[] = [
  { id: "report", icon: MessageSquareWarning, titleKey: "disputeReportTitle", descKey: "disputeReportDesc" },
  { id: "cancel", icon: FileX2, titleKey: "disputeCancelTitle", descKey: "disputeCancelDesc" },
  { id: "track", icon: Clock, titleKey: "disputeTrackTitle", descKey: "disputeTrackDesc" },
];

type Props = {
  t: any;
  setView: (view: ViewName) => void;
  /** Llega desde la transaccion de origen; se pasara a la ruta siguiente. */
  transactionId?: string;
};

export default function DisputeOptionsScreen({ t, setView, transactionId }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const shake = useRef(new Animated.Value(0)).current;

  /** Sin opcion elegida el boton no navega: solo sacude la lista. */
  const handleContinue = () => {
    if (!selected) {
      Animated.sequence([
        Animated.timing(shake, { toValue: 8, duration: 50, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -8, duration: 50, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 6, duration: 50, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
      return;
    }

    console.log(`[dispute] ${selected} transaccion=${transactionId ?? "n/a"}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <CloseButton
        testID="dispute.backButton"
        accessibilityLabel={t.back}
        icon="chevron"
        onPress={() => setView("dashboard")}
      />

      <IconCircle icon={FileText} size={sizes.hero} hero glow style={styles.hero} />

      <ScreenHeader
        title={t.disputeTitle}
        subtitle={t.disputeSubtitle}
        align="center"
        size="hero"
        testID="dispute.header"
      />

      <Animated.View style={[styles.options, { transform: [{ translateX: shake }] }]}>
        {OPTIONS.map((option) => (
          <ListItemCard
            key={option.id}
            testID={`dispute.option.${option.id}`}
            icon={option.icon}
            title={t[option.titleKey]}
            description={t[option.descKey]}
            showChevron
            selected={selected === option.id}
            onPress={() => setSelected(option.id)}
          />
        ))}
      </Animated.View>

      <Button
        testID="dispute.continueButton"
        title={t.continueLabel}
        onPress={handleContinue}
        variant="gradient"
        deepGradient
        size="lg"
        radius="md"
        rightAdornment="arrow"
        style={styles.cta}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: screenPadding,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  hero: {
    marginTop: spacing.xxxl,
    marginBottom: spacing.xxl,
  },
  options: {
    marginTop: spacing.xxl,
    gap: spacing.md,
  },
  cta: {
    marginTop: spacing.xxl,
  },
});
