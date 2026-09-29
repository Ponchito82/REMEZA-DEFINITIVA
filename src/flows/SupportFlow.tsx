import React from "react";

import LiveSupportScreen from "../screens/support/LiveSupportScreen";
import HelpCenterScreen from "../screens/support/HelpCenterScreen";
import FaqScreen from "../screens/support/FaqScreen";
import { useStepStack } from "../hooks/useStepStack";
import { Language } from "../types/app";

export type SupportEntry = "live" | "helpCenter";
type Step = SupportEntry | "faq";

type Props = {
  t: any;
  language: Language;
  entry: SupportEntry;
  onExit: () => void;
  /** Vuelve al dashboard y lanza la guia paso a paso */
  onStartGuide: () => void;
};

/** Soporte: en vivo (5), centro de ayuda (18) y preguntas frecuentes. El chat en vivo redirige a WhatsApp. */
export default function SupportFlow({ t, language, entry, onExit, onStartGuide }: Props) {
  const { step, push, pop } = useStepStack<Step>(entry, onExit);

  switch (step) {
    case "faq":
      return <FaqScreen t={t} language={language} onBack={pop} />;
    case "helpCenter":
      return (
        <HelpCenterScreen
          t={t}
          onBack={pop}
          onContactSupport={() => push("live")}
          onOpenFaq={() => push("faq")}
          onStartGuide={onStartGuide}
        />
      );
    default:
      return <LiveSupportScreen t={t} onBack={pop} />;
  }
}
