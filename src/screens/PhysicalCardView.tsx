import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { MapPin, CreditCard, Send, Check } from "lucide-react-native";

import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
import { radius, sizes } from "../theme/radius";
import { spacing, screenPadding } from "../theme/spacing";
import {
  Button,
  CloseButton,
  GlassCard,
  HeroIcon,
  IconCircle,
  ScreenHeader,
} from "../components/ui";
import type { IconComponent } from "../components/ui";
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

type RowStatus = "done" | "active" | "pending";

type ConfirmStepConfig = {
  title: string;
  description: string;
};

/**
 * Avanza 1 -> 2 -> 3 mientras `active` es verdadero: el paso 1 arranca listo,
 * el 2 se valida y el 3 cierra el recorrido. Se reinicia cada vez que la
 * pantalla vuelve a activarse, asi que la animacion se ve fresca cada visita.
 */
function useConfirmProgress(active: boolean): number {
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    if (!active) return;

    setProgress(1);
    const advanceToSecond = setTimeout(() => setProgress(2), 1600);
    const advanceToThird = setTimeout(() => setProgress(3), 3200);

    return () => {
      clearTimeout(advanceToSecond);
      clearTimeout(advanceToThird);
    };
  }, [active]);

  return progress;
}

/** Fila de una lista vertical unida por una linea: check, aro o punto segun el estado. */
function StepRow({
  title,
  description,
  status,
  isLast,
}: {
  title: string;
  description: string;
  status: RowStatus;
  isLast: boolean;
}) {
  return (
    <View style={rowStyles.root}>
      <View style={rowStyles.rail}>
        <View
          style={[
            rowStyles.dot,
            status === "done" && rowStyles.dotDone,
            status === "active" && rowStyles.dotActive,
            status === "pending" && rowStyles.dotPending,
          ]}
        >
          {status === "done" ? <Check size={13} color={colors.text.primary} strokeWidth={2.5} /> : null}
        </View>
        {!isLast ? <View style={[rowStyles.line, status === "done" && rowStyles.lineDone]} /> : null}
      </View>

      <View style={rowStyles.body}>
        <Text style={[typography.bodyStrong, status === "pending" && rowStyles.mutedText]}>
          {title}
        </Text>
        <Text style={[typography.caption, status === "pending" && rowStyles.mutedText]}>
          {description}
        </Text>
      </View>
    </View>
  );
}

/**
 * Panel de "confirmando": aro giratorio (igual en las tres pantallas de la
 * tarjeta fisica) mas una lista de pasos que avanza sola conforme el usuario
 * llega a cada pantalla. El progreso lo da `useConfirmProgress`, no un valor
 * fijo, asi que la animacion se activa dinamicamente en cada una.
 */
function ConfirmingPanel({
  icon,
  title,
  subtitle,
  steps,
  progress,
  testID,
}: {
  icon: IconComponent;
  title: string;
  subtitle: string;
  steps: ConfirmStepConfig[];
  progress: number;
  testID?: string;
}) {
  return (
    <GlassCard size="lg" style={styles.solid} testID={testID}>
      <View style={styles.confirmingCenter}>
        <HeroIcon icon={icon} variant="ring" spinning size={120} />
        <Text style={[typography.h2, styles.confirmingTitle]}>{title}</Text>
        <Text style={[typography.body, styles.confirmingSubtitle]}>{subtitle}</Text>
      </View>

      <View style={styles.checklist}>
        {steps.map((item, index) => (
          <StepRow
            key={item.title}
            title={item.title}
            description={item.description}
            status={index < progress ? "done" : index === progress ? "active" : "pending"}
            isLast={index === steps.length - 1}
          />
        ))}
      </View>
    </GlassCard>
  );
}

/**
 * Solicitud de tarjeta fisica: la tarjeta se envia a la direccion verificada
 * en el KYC, asi que la pantalla solo la confirma. Van tres cuadros seguidos:
 * la direccion, la confirmacion de la solicitud y la entrega en proceso; las
 * tres comparten el mismo panel de "confirmando" y cada una activa su propia
 * animacion al mostrarse.
 */
export default function PhysicalCardView({
  t,
  setView,
  deliveryAddress,
  physicalCardRequested,
  handlePhysicalCardSubmit,
}: Props) {
  const [step, setStep] = useState<Step>("address");

  const addressProgress = useConfirmProgress(!physicalCardRequested && step === "address");
  const requestProgress = useConfirmProgress(!physicalCardRequested && step === "confirm");
  const deliveryProgress = useConfirmProgress(physicalCardRequested);

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
          <ConfirmingPanel
            testID="physicalCard-requestPanel"
            icon={CreditCard}
            title={t.cardRequestPreparingTitle}
            subtitle={t.cardRequestPreparingSubtitle}
            progress={requestProgress}
            steps={[
              { title: t.cardRequestReceivedLabel, description: t.cardRequestReceivedStatus },
              { title: t.deliveryAddress, description: t.cardRequestAddressStatus },
              { title: t.cardRequestIssueLabel, description: t.cardRequestIssueStatus },
            ]}
          />

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
          <ConfirmingPanel
            testID="physicalCard-addressPanel"
            icon={CreditCard}
            title={t.cardConfirmProcessTitle}
            subtitle={t.cardConfirmProcessSubtitle}
            progress={addressProgress}
            steps={[
              { title: t.cardStepAddressTitle, description: t.cardStepAddressDesc },
              { title: t.cardStepDataTitle, description: t.cardStepDataDesc },
              { title: t.cardStepConfirmTitle, description: t.cardStepConfirmDesc },
            ]}
          />

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
          <ConfirmingPanel
            testID="physicalCard-deliveryAnimation"
            icon={Send}
            title={t.deliveryInProgress}
            subtitle={t.deliveryMessage}
            progress={deliveryProgress}
            steps={[
              { title: t.cardStepIssuedTitle, description: t.cardStepIssuedDesc },
              { title: t.cardStepTransitTitle, description: t.cardStepTransitDesc },
              { title: t.cardStepDeliveryTitle, description: t.cardStepDeliveryDesc },
            ]}
          />

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

          <Button
            testID="physicalCard-backToMenuButton"
            title={t.backToMenu}
            variant="gradient"
            rightAdornment="none"
            onPress={() => setView("dashboard")}
            style={styles.backToMenuButton}
          />
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
  confirmingCenter: {
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.xl,
  },
  confirmingTitle: {
    marginTop: spacing.md,
    textAlign: "center",
  },
  confirmingSubtitle: {
    textAlign: "center",
  },
  checklist: {
    marginTop: spacing.sm,
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
  statusCard: {
    width: "100%",
  },
  statusValue: {
    marginTop: spacing.xs,
  },
  backToMenuButton: {
    marginTop: spacing.lg,
  },
});

const rowStyles = StyleSheet.create({
  root: {
    flexDirection: "row",
    gap: spacing.md,
  },
  rail: {
    alignItems: "center",
  },
  dot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  dotDone: {
    backgroundColor: colors.primary,
  },
  dotActive: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: colors.primaryLight,
  },
  dotPending: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.progressInactive,
  },
  line: {
    flex: 1,
    width: 2,
    minHeight: spacing.lg,
    marginVertical: spacing.xs,
    backgroundColor: colors.progressInactive,
  },
  lineDone: {
    backgroundColor: colors.primary,
  },
  body: {
    flex: 1,
    paddingBottom: spacing.lg,
    gap: spacing.xs,
  },
  mutedText: {
    color: colors.text.placeholder,
  },
});
