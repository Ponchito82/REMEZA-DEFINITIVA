import React from "react";
import { ShieldCheck, TimerReset, Zap } from "lucide-react-native";

import { FeatureRow, StatusScreen } from "../../components/ui";
import type { BiometryKind } from "../../services/biometrics";
import { bioText, biometryIcon } from "./biometryKind";

type Props = {
  t: any;
  kind: BiometryKind;
  enabling: boolean;
  onBack: () => void;
  onEnable: () => void;
};

/**
 * Habilita tu biometria (pantalla 10), con los textos corregidos: el PDF
 * decia "Habita", "Llena de forma rapida" y hablaba de salud mental.
 */
export default function EnableBiometricsScreen({ t, kind, enabling, onBack, onEnable }: Props) {
  return (
    <StatusScreen
      testID="enableBiometrics"
      showBack
      onBack={onBack}
      backTestID="enableBiometrics.backButton"
      backAccessibilityLabel={t.back}
      icon={biometryIcon(kind)}
      title={bioText(t, "enableBioTitle", kind)}
      subtitle={t.enableBioSubtitle}
      primary={{
        testID: "enableBiometrics.enableButton",
        title: bioText(t, "enableBioButton", kind),
        showArrow: true,
        loading: enabling,
        onPress: onEnable,
      }}
      link={{ testID: "enableBiometrics.laterLink", title: t.commonLater, onPress: onBack }}
    >
      <FeatureRow icon={Zap} title={t.bioMoreSecurity} subtitle={t.bioMoreSecurityDesc} />
      <FeatureRow icon={TimerReset} title={t.bioFaster} subtitle={t.bioFasterDesc} />
      <FeatureRow icon={ShieldCheck} title={t.bioPrivacy} subtitle={bioText(t, "bioPrivacyDesc", kind)} />
    </StatusScreen>
  );
}
