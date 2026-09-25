import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { BookOpen, CircleHelp, Headset, Info, ShieldCheck } from "lucide-react-native";

import { InfoCard, ListRow, StatusScreen } from "../../components/ui";
import type { IconComponent } from "../../components/ui";
import { MOCK_HELP_TOPICS } from "../../mocks/remeza";

type Props = {
  t: any;
  onBack: () => void;
  onContactSupport: () => void;
  /** Abre la pantalla de Preguntas frecuentes */
  onOpenFaq: () => void;
};

type Topic = (typeof MOCK_HELP_TOPICS)[number];

const TOPIC_ICONS: Record<Topic, IconComponent> = {
  faq: CircleHelp,
  guides: BookOpen,
  limits: Info,
  security: ShieldCheck,
};

/**
 * Centro de ayuda (pantalla 18). "Preguntas frecuentes" abre su propia
 * pantalla; el resto de temas despliega su respuesta debajo.
 */
export default function HelpCenterScreen({ t, onBack, onContactSupport, onOpenFaq }: Props) {
  const [open, setOpen] = useState<Topic | null>(null);

  return (
    <StatusScreen
      testID="helpCenter"
      showBack
      onBack={onBack}
      backTestID="helpCenter.backButton"
      backAccessibilityLabel={t.back}
      icon={CircleHelp}
      title={t.helpCenterTitle}
      subtitle={t.helpCenterSubtitle}
    >
      {MOCK_HELP_TOPICS.map((topic) => (
        <View key={topic}>
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
          {topic !== "faq" && open === topic ? (
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
    </StatusScreen>
  );
}

const styles = StyleSheet.create({
  answer: {
    marginTop: 6,
  },
});
