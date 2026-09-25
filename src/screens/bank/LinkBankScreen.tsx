import React from "react";
import { Clock, Landmark, ShieldCheck, ShieldPlus } from "lucide-react-native";

import { FeatureRow, StatusScreen } from "../../components/ui";

type Props = {
  t: any;
  linking: boolean;
  onBack: () => void;
  onLink: () => void;
};

/** Vincula tu cuenta bancaria (pantalla 6). */
export default function LinkBankScreen({ t, linking, onBack, onLink }: Props) {
  return (
    <StatusScreen
      testID="linkBank"
      showBack
      onBack={onBack}
      backTestID="linkBank.backButton"
      backAccessibilityLabel={t.back}
      icon={Landmark}
      title={t.linkBankTitle}
      subtitle={t.linkBankSubtitle}
      primary={{
        testID: "linkBank.linkButton",
        title: t.linkBankButton,
        showArrow: true,
        loading: linking,
        onPress: onLink,
      }}
    >
      <FeatureRow icon={ShieldPlus} title={t.linkBankSecure} subtitle={t.linkBankSecureDesc} />
      <FeatureRow icon={ShieldCheck} title={t.linkBankRealtime} subtitle={t.linkBankRealtimeDesc} />
      <FeatureRow icon={Clock} title={t.linkBankPrivacy} subtitle={t.linkBankPrivacyDesc} />
    </StatusScreen>
  );
}
