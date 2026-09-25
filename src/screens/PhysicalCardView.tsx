import React, { useState } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { MapPin, CreditCard } from "lucide-react-native";

import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
import { radius, sizes } from "../theme/radius";
import { spacing, screenPadding } from "../theme/spacing";
import {
  Button,
  CloseButton,
  DeliveryAnimation,
  GlassCard,
  IconCircle,
  ScreenHeader,
} from "../components/ui";
import { useHardwareBack } from "../hooks/useHardwareBack";
import { ViewName } from "../types/app";

type Props = {
  t: any;
  setView: (view: ViewName) => void;

  /** Direccion del KYC. Solo se muestra: no se puede editar aqui. */
  deliveryAddress: string;

  physicalCardRequested: boolean;
  handlePhysicalCardSubmit: () => void;
};

type Step = "address" | "confirm";

/**
 * Solicitud de tarjeta fisica: la tarjeta se envia a la direccion verificada
 * en el KYC, asi que la pantalla solo la confirma. Van tres cuadros seguidos:
 * la direccion, la confirmacion de la solicitud y la entrega en proceso.
 */
export default function PhysicalCardView({
  t,
  setView,
  deliveryAddress,
  physicalCardRequested,
  handlePhysicalCardSubmit,
}: Props) {
  const [step, setStep] = useState<Step>("address");

  // Atras de Android: de la confirmacion vuelve a la direccion.
  useHardwareBack(() => {
    if (!physicalCardRequested && step === "confirm") {
      setStep("address");
      return true;
    }
    return false;
  });

  const address = deliveryAddress || t.notAvailable;

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <CloseButton testID="physicalCard-backButton" onPress={() => setView("dashboard")} />

      {!physicalCardRequested ? (
        <ScreenHeader
          title={step === "address" ? t.physicalCardTitle : t.cardRequestConfirmTitle}
          subtitle={step === "address" ? t.physicalCardSubtitle : t.cardRequestConfirmSubtitle}
          style={styles.header}
        />
      ) : null}

      {!physicalCardRequested && step === "confirm" ? (
        <View style={styles.form}>
          <GlassCard size="lg" style={styles.solid}>
            <View style={styles.confirmHeader}>
              <IconCircle icon={CreditCard} size={48} />
              <Text style={[typography.bodyStrong, styles.confirmTitle]}>
                {t.cardRequestConfirmMessage}
              </Text>
            </View>

            <Text testID="physicalCard-confirmAddress" style={[typography.body, styles.confirmAddress]}>
              {address}
            </Text>
          </GlassCard>

          <Button
            testID="physicalCard-requestButton"
            title={t.cardRequestConfirmYes}
            rightAdornment="none"
            onPress={handlePhysicalCardSubmit}
          />
          <Button
            testID="physicalCard-goBackButton"
            title={t.cardRequestBack}
            variant="outline"
            rightAdornment="none"
            onPress={() => setStep("address")}
          />
        </View>
      ) : null}

      {!physicalCardRequested && step === "address" ? (
        <View style={styles.form}>
          <GlassCard size="lg" style={styles.addressCard}>
            <View style={styles.iconCircle}>
              <MapPin size={18} color={colors.primaryLight} strokeWidth={2} />
            </View>

            <View style={styles.addressText}>
              <Text style={typography.caption}>{t.deliveryAddress}</Text>
              <Text testID="physicalCard-addressValue" style={typography.bodyStrong} selectable>
                {address}
              </Text>
            </View>
          </GlassCard>

          <Button
            testID="physicalCard-confirmButton"
            title={t.confirmCard}
            rightAdornment="none"
            onPress={() => setStep("confirm")}
          />
        </View>
      ) : null}

      {physicalCardRequested ? (
        <View style={styles.status}>
          <DeliveryAnimation testID="physicalCard-deliveryAnimation" style={styles.animation} />

          <Text style={[typography.h2, styles.statusTitle]}>{t.deliveryInProgress}</Text>
          <Text style={[typography.body, styles.statusText]}>{t.deliveryMessage}</Text>

          <GlassCard style={[styles.solid, styles.statusCard]}>
            <Text style={typography.label}>{t.cardShippedTo}</Text>
            <Text
              testID="physicalCard-shippedTo"
              style={[typography.bodyStrong, styles.statusValue]}
            >
              {address}
            </Text>
          </GlassCard>

          <GlassCard style={[styles.solid, styles.statusCard]}>
            <Text style={typography.label}>{t.status}</Text>
            <Text style={[typography.bodyStrong, styles.statusValue]}>{t.pendingShipment}</Text>
          </GlassCard>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: screenPadding,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginTop: spacing.xxl,
  },
  form: {
    gap: spacing.lg,
  },
  /** Superficie opaca, la misma del menu desplegable */
  solid: {
    backgroundColor: colors.sheetSurface,
  },
  addressCard: {
    backgroundColor: colors.sheetSurface,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  iconCircle: {
    width: sizes.inputIcon,
    height: sizes.inputIcon,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceStrong,
  },
  addressText: {
    flex: 1,
    gap: spacing.xs,
  },
  confirmHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  confirmTitle: {
    flex: 1,
  },
  confirmAddress: {
    marginTop: spacing.lg,
  },
  status: {
    alignItems: "center",
    gap: spacing.md,
    marginTop: spacing.xxl,
  },
  animation: {
    marginBottom: spacing.sm,
  },
  statusTitle: {
    marginTop: spacing.lg,
    textAlign: "center",
  },
  statusText: {
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  statusCard: {
    width: "100%",
  },
  statusValue: {
    marginTop: spacing.xs,
  },
});
