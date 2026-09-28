import React from "react";
import { ShieldCheck } from "lucide-react-native";

import { InfoCard, StatusScreen } from "../../components/ui";
import type { BiometryKind } from "../../services/biometrics";
import { bioText, biometryIcon } from "./biometryKind";

type Props = {
  t: any;
  kind: BiometryKind;
  /** El equipo no tiene el sensor o no hay rostro/huella registrados */
  unavailable: boolean;
  retrying: boolean;
  onRetry: () => void;
  onUseAccessCode: () => void;
  onHome: () => void;
};

/** No se pudo reconocer tu rostro o tu huella (pantalla 26). */
export default function BiometricsFailedScreen({ t, kind, unavailable, retrying, onRetry, onUseAccessCode, onHome }: Props) {
  return (
    <StatusScreen
      testID="biometricsFailed"
      icon={biometryIcon(kind)}
      iconBadge="x"
      title={bioText(t, unavailable ? "bioUnavailableTitle" : "bioFailedTitle", kind)}
      subtitle={bioText(t, unavailable ? "bioUnavailableSubtitle" : "bioFailedSubtitle", kind)}
      primary={{
        testID: "biometricsFailed.retryButton",
        title: t.commonRetry,
        loading: retrying,
        onPress: onRetry,
      }}
      secondary={{
        testID: "biometricsFailed.accessCodeButton",
        title: t.useAccessCode,
        tone: "accent",
        onPress: onUseAccessCode,
      }}
      link={{ testID: "biometricsFailed.homeLink", title: t.commonBackToHome, onPress: onHome }}
    >
      <InfoCard icon={ShieldCheck} title={t.infoSafeTitle} text={t.bioFailedSafeText} />
    </StatusScreen>
  );
}
