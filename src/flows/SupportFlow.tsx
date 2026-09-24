import React from "react";

import LiveSupportScreen from "../screens/support/LiveSupportScreen";
import SupportChatScreen from "../screens/support/SupportChatScreen";
import HelpCenterScreen from "../screens/support/HelpCenterScreen";
import { useStepStack } from "../hooks/useStepStack";
import { Language } from "../types/app";

export type SupportEntry = "live" | "helpCenter";
type Step = SupportEntry | "chat";

type Props = {
  t: any;
  language: Language;
  entry: SupportEntry;
  onExit: () => void;
};

/** Soporte: en vivo (5), chat (16) y centro de ayuda (18). */
export default function SupportFlow({ t, language, entry, onExit }: Props) {
  const { step, push, pop } = useStepStack<Step>(entry, onExit);

  switch (step) {
    case "chat":
      return <SupportChatScreen t={t} language={language} onBack={pop} />;
    case "helpCenter":
      return <HelpCenterScreen t={t} onBack={pop} onContactSupport={() => push("live")} />;
    default:
      return (
        <LiveSupportScreen
          t={t}
          onBack={pop}
          onOpenChat={() => push("chat")}
          onOpenHelpCenter={() => push("helpCenter")}
        />
      );
  }
}
