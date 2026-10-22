import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { ChartNoAxesColumn, ChevronRight, Lock, Wallet } from "lucide-react-native";
import { styles as appStyles } from "../theme/styles";
import { colors } from "../theme/colors";
import { fontFamily, typography } from "../theme/typography";
import { primaryGradient } from "../theme/gradients";
import { CreditCardArt, CreditFlowHeader } from "../components/remeza";
import { spacing, screenPadding } from "../theme/spacing";
import CreditDepositNoticeDialog from "../components/ui/CreditDepositNoticeDialog";
import { authenticateWithBiometrics, getBiometryKind } from "../services/biometrics";
import { isBiometricsEnabled } from "../services/securitySettings";
import { bioText } from "./security/biometryKind";

type Props = {
  t: any;
  holderName?: string;
  setIsMenuOpen: (value: boolean) => void;
  onBack: () => void;
  /** "Solicitar tarjeta": aun sin flujo, se conecta mas adelante. */
  onRequestCard?: () => void;
  /** Para solicitar el historial la tarjeta de debito debe estar activada. */
  isDebitCardActive: boolean;
};

export default function CreditHistoryScreen({ t, holderName, setIsMenuOpen, onBack, onRequestCard, isDebitCardActive }: Props) {
  const [needCardOpen, setNeedCardOpen] = useState(false);

  // Con biometria activada se exige huella / Face ID; sin ella se continua directo.
  const handleRequest = async () => {
    if (!isDebitCardActive) return setNeedCardOpen(true);
    if (isBiometricsEnabled()) {
      const kind = await getBiometryKind();
      const result = await authenticateWithBiometrics(bioText(t, "creditBioPrompt", kind), t.cancel);
      if (!result.ok) return;
    }
    onRequestCard?.();
  };

  const features = [
    { id: "limit", icon: Wallet, title: t.creditFeatureLimitTitle, desc: t.creditFeatureLimitDesc },
    { id: "history", icon: ChartNoAxesColumn, title: t.creditFeatureHistoryTitle, desc: t.creditFeatureHistoryDesc },
    { id: "fee", icon: Lock, title: t.creditFeatureFeeTitle, desc: t.creditFeatureFeeDesc },
  ];

  return (
    <View style={appStyles.dashboardScreen}>
      <CreditFlowHeader
        testIDPrefix="creditHistory"
        onMenu={() => setIsMenuOpen(true)}
        onBack={onBack}
        backLabel={t.back}
      />

      <ScrollView
        contentContainerStyle={localStyles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={localStyles.title}>{t.creditHistoryHeadline}</Text>
        <Text style={[localStyles.title, localStyles.titleAccent]}>{t.creditHistoryHeadlineAccent}</Text>
        <Text style={localStyles.subtitle}>{t.creditHistoryDesc}</Text>

        <CreditCardArt t={t} holderName={holderName} />

        <View style={localStyles.features}>
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <View key={item.id} style={localStyles.featureRow}>
                <View style={localStyles.featureIcon}>
                  <Icon size={24} color={colors.text.primary} strokeWidth={2} />
                </View>
                <View style={localStyles.featureText}>
                  <Text style={localStyles.featureTitle}>{item.title}</Text>
                  <Text style={localStyles.featureDesc}>{item.desc}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <Pressable
          testID="creditHistory-requestCardButton"
          accessibilityRole="button"
          onPress={handleRequest}
          style={({ pressed }) => [localStyles.cta, pressed && localStyles.pressed]}
        >
          <LinearGradient
            colors={primaryGradient.colors}
            locations={primaryGradient.locations}
            start={primaryGradient.start}
            end={primaryGradient.end}
            style={StyleSheet.absoluteFill}
          />
          <Text style={localStyles.ctaText}>{t.creditRequestCard}</Text>
          <ChevronRight size={20} color="#FFFFFF" strokeWidth={2.4} />
        </Pressable>
      </ScrollView>

      {needCardOpen ? (
        <CreditDepositNoticeDialog
          testID="creditHistory-needCard"
          title={t.creditNeedCardTitle}
          body={t.creditNeedCardBody}
          acceptLabel={t.creditGuaranteeOk}
          onCancel={() => setNeedCardOpen(false)}
          onAccept={() => setNeedCardOpen(false)}
        />
      ) : null}
    </View>
  );
}

const localStyles = StyleSheet.create({
  content: {
    paddingHorizontal: screenPadding,
    paddingTop: spacing.lg,
    paddingBottom: 40,
  },
  pressed: {
    opacity: 0.7,
  },
  title: {
    ...typography.h1,
    fontSize: 30,
    lineHeight: 36,
  },
  titleAccent: {
    color: "#FFFFFF",
  },
  subtitle: {
    ...typography.body,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  features: {
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    backgroundColor: colors.surface,
  },
  featureIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(75,35,250,0.45)",
  },
  featureText: {
    flex: 1,
    gap: 2,
  },
  featureTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 15,
    lineHeight: 20,
    color: colors.text.primary,
    includeFontPadding: false,
  },
  featureDesc: {
    ...typography.body,
    fontSize: 13,
    lineHeight: 18,
  },
  cta: {
    marginTop: spacing.xl,
    height: 56,
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    overflow: "hidden",
  },
  ctaText: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: "#FFFFFF",
  },
});
