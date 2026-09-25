import React from "react";
import { Landmark, ShieldCheck } from "lucide-react-native";

import { InfoCard, StatusScreen } from "../../components/ui";

type Props = {
  t: any;
  retrying: boolean;
  onRetry: () => void;
  onCheckDetails: () => void;
};

/** No se pudo vincular tu banco (pantalla 27). */
export default function LinkBankFailedScreen({ t, retrying, onRetry, onCheckDetails }: Props) {
  return (
    <StatusScreen
      testID="linkBankFailed"
      icon={Landmark}
      iconBadge="x"
      title={t.linkBankFailedTitle}
      subtitle={t.linkBankFailedSubtitle}
      primary={{
        testID: "linkBankFailed.retryButton",
        title: t.commonTryAgain,
        loading: retrying,
        onPress: onRetry,
      }}
      secondary={{
        testID: "linkBankFailed.checkButton",
        title: t.verifyData,
        tone: "accent",
        onPress: onCheckDetails,
      }}
    >
      <InfoCard icon={ShieldCheck} title={t.infoSafeTitle} text={t.linkBankFailedSafeText} />
    </StatusScreen>
  );
}
