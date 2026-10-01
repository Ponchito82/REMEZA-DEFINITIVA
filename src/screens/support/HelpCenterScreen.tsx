import React, { useState } from "react";
import { Linking, StyleSheet, View } from "react-native";
import { BookOpen, CircleHelp, FileText, Headset, Info, Lock, ShieldCheck } from "lucide-react-native";

import { InfoCard, ListRow, StatusScreen } from "../../components/ui";
import type { IconComponent } from "../../components/ui";
import { MOCK_HELP_TOPICS } from "../../mocks/remeza";
import { tourRef } from "../../onboarding/tourTargets";

type Props = {
  t: any;
  onBack: () => void;
  onContactSupport: () => void;
  /** Abre la pantalla de Preguntas frecuentes */
  onOpenFaq: () => void;
  /** Vuelve al dashboard y lanza la guia paso a paso */
  onStartGuide: () => void;
};

type Topic = (typeof MOCK_HELP_TOPICS)[number];

const TOPIC_ICONS: Record<Topic, IconComponent> = {
  faq: CircleHelp,
  guides: BookOpen,
  limits: Info,
  security: ShieldCheck,
};

const TERMS_URL = "https://remeza.app/index.php/terms-and-conditions/";
const PRIVACY_URL = "https://remeza.app/index.php/privacy-policy/";

const openLink = (url: string) => {
  Linking.openURL(url).catch(() => undefined);
};

/**
 * Centro de ayuda (pantalla 18). "Preguntas frecuentes" abre su propia
 * pantalla; el resto de temas despliega su respuesta debajo.
 */
export default function HelpCenterScreen({ t, onBack, onContactSupport, onOpenFaq, onStartGuide }: Props) {
  const [open, setOpen] = useState<Topic | null>(null);

  return (
    <StatusScreen
      testID="helpCenter"
      showBack
      onBack={onBack}
      backTestID="helpCenter.backButton"
      backAccessibilityLabel={t.back}
      backTourId="helpCenterBack"
      icon={CircleHelp}
      title={t.helpCenterTitle}
      subtitle={t.helpCenterSubtitle}
    >
      {MOCK_HELP_TOPICS.map((topic) => (
        <View
          key={topic}
          {...(topic === "guides" ? { ref: tourRef("helpCenterGuide"), collapsable: false } : {})}
        >
          <ListRow
            testID={`helpCenter.topic.${topic}`}
            icon={TOPIC_ICONS[topic]}
            title={t[`help_${topic}`]}
            selected={topic !== "faq" && topic !== "guides" && open === topic}
            onPress={
              topic === "faq"
                ? onOpenFaq
                : topic === "guides"
                  ? onStartGuide
                  : () => setOpen((prev) => (prev === topic ? null : topic))
            }
          />
          {topic !== "faq" && topic !== "guides" && open === topic ? (
            <InfoCard
              testID={`helpCenter.answer.${topic}`}
              text={t[`help_${topic}_answer`]}
              style={styles.answer}
            />
          ) : null}
        </View>
      ))}

      <ListRow
        testID="helpCenter.contactRow"
        icon={Headset}
        title={t.help_contact}
        onPress={onContactSupport}
      />

      <ListRow
        testID="helpCenter.termsRow"
        icon={FileText}
        title={t.help_terms}
        onPress={() => openLink(TERMS_URL)}
      />
      <ListRow
        testID="helpCenter.privacyRow"
        icon={Lock}
        title={t.help_privacy}
        onPress={() => openLink(PRIVACY_URL)}
      />
    </StatusScreen>
  );
}

const styles = StyleSheet.create({
  answer: {
    marginTop: 6,
  },
});
