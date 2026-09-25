import React from "react";
import { Fingerprint, ShieldCheck } from "lucide-react-native";

import { InfoCard, StatusScreen } from "../../components/ui";

type Props = {
  t: any;
  retrying: boolean;
  onRetry: () => void;
  onUseAccessCode: () => void;
  onHome: () => void;
};

/** No se pudo reconocer tu huella (pantalla 26). */
export default function BiometricsFailedScreen({ t, retrying, onRetry, onUseAccessCode, onHome }: Props) {
  return (
    <StatusScreen
      testID="biometricsFailed"
      icon={Fingerprint}
      iconBadge="x"
      title={t.bioFailedTitle}
      subtitle={t.bioFailedSubtitle}
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
