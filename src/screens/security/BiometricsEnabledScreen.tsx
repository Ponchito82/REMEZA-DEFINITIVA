import React from "react";
import { Fingerprint, ShieldCheck } from "lucide-react-native";

import { InfoCard, StatusScreen } from "../../components/ui";

type Props = {
  t: any;
  onContinue: () => void;
};

/** ¡Biometria activada! (pantalla 11) */
export default function BiometricsEnabledScreen({ t, onContinue }: Props) {
  return (
    <StatusScreen
      testID="biometricsEnabled"
      icon={Fingerprint}
      iconBadge="check"
      title={t.bioEnabledTitle}
      subtitle={t.bioEnabledSubtitle}
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
