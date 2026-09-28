import React from "react";
import { ShieldCheck } from "lucide-react-native";

import { InfoCard, StatusScreen } from "../../components/ui";
import type { BiometryKind } from "../../services/biometrics";
import { bioText, biometryIcon } from "./biometryKind";

type Props = {
  t: any;
  kind: BiometryKind;
  onContinue: () => void;
};

/** ¡Biometria activada! (pantalla 11) */
export default function BiometricsEnabledScreen({ t, kind, onContinue }: Props) {
  return (
    <StatusScreen
      testID="biometricsEnabled"
      icon={biometryIcon(kind)}
      iconBadge="check"
      title={t.bioEnabledTitle}
      subtitle={bioText(t, "bioEnabledSubtitle", kind)}
      primary={{
        testID: "biometricsEnabled.continueButton",
        title: t.commonContinue,
        onPress: onContinue,
      }}
    >
      <InfoCard icon={ShieldCheck} title={t.bioSaferTitle} text={t.bioSaferText} />
    </StatusScreen>
  );
}
