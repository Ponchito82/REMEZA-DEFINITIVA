import React, { useState } from "react";
import { Linking, StyleSheet, View } from "react-native";
import { BookOpen, CircleHelp, CreditCard, FileText, Headset, Info, Lock, ShieldCheck } from "lucide-react-native";

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
  /** Vuelve al dashboard y lanza la guia de bienvenida */
  onStartGuide: () => void;
  /** Lleva a "Mis tarjetas virtuales" y lanza su guia */
  onStartCardsGuide: () => void;
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
export default function HelpCenterScreen({ t, onBack, onContactSupport, onOpenFaq, onStartGuide, onStartCardsGuide }: Props) {
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
            selected={topic !== "faq" && open === topic}
            onPress={
              topic === "faq"
                ? onOpenFaq
                : () => setOpen((prev) => (prev === topic ? null : topic))
            }
          />
          {topic === "guides" && open === topic ? (
            <View style={styles.guides}>
              <ListRow
                testID="helpCenter.guide.welcome"
                icon={BookOpen}
                title={t.help_guides_welcome}
                subtitle={t.help_guides_welcome_desc}
                onPress={onStartGuide}
              />
              <ListRow
                testID="helpCenter.guide.cards"
                icon={CreditCard}
                title={t.help_guides_cards}
                subtitle={t.help_guides_cards_desc}
                onPress={onStartCardsGuide}
              />
            </View>
          ) : null}
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
  guides: {
    marginTop: 6,
    marginLeft: 18,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: "rgba(130,110,255,0.45)",
    gap: 6,
  },
});
