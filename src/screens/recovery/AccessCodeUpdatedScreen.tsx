import React from "react";
import { Check, ShieldCheck } from "lucide-react-native";

import { InfoCard, StatusScreen } from "../../components/ui";

type Props = {
  t: any;
  onSignIn: () => void;
  onHome: () => void;
};

/** ¡Codigo de acceso actualizado! (pantalla 24) */
export default function AccessCodeUpdatedScreen({ t, onSignIn, onHome }: Props) {
  return (
    <StatusScreen
      testID="accessCodeUpdated"
      icon={Check}
      title={t.codeUpdatedTitle}
      subtitle={t.codeUpdatedSubtitle}
      primary={{ testID: "accessCodeUpdated.signInButton", title: t.signIn, onPress: onSignIn }}
      link={{ testID: "accessCodeUpdated.homeLink", title: t.commonBackToHome, onPress: onHome }}
    >
      <InfoCard icon={ShieldCheck} title={t.accountSafeTitle} text={t.accountSafeText} />
    </StatusScreen>
  );
}
