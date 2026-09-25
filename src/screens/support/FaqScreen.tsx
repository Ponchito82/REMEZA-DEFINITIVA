import React, { useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronDown, CircleHelp, Mail, Phone } from "lucide-react-native";

import { KeyValueCard, ListRow, ScreenHeader, ScreenLayout } from "../../components/ui";
import { FAQ_CONTACT, FAQ_CONTENT, TERMS_URL } from "../../i18n/faqContent";
import { tokens } from "../../theme/colors";
import { metrics } from "../../theme/radius";
import { spacing } from "../../theme/spacing";
import { fontFamily, textStyles } from "../../theme/typography";
import { Language } from "../../types/app";

type Props = {
  t: any;
  language: Language;
  onBack: () => void;
};

const openLink = (url: string) => {
  Linking.openURL(url).catch(() => undefined);
};

/**
 * Preguntas frecuentes (contenido de Remeza_Preguntas_Frecuentes.docx):
 * secciones con preguntas desplegables, el resumen de comisiones y el contacto.
 */
export default function FaqScreen({ t, language, onBack }: Props) {
  const content = FAQ_CONTENT[language];
  const [open, setOpen] = useState<string | null>(null);

  return (
    <ScreenLayout
      testID="faq"
      showBack
      onBack={onBack}
      backTestID="faq.backButton"
      backAccessibilityLabel={t.back}
    >
      <ScreenHeader
        icon={CircleHelp}
        title={content.title}
        subtitle={content.intro}
        testID="faq.header"
        style={styles.header}
      />

      {content.sections.map((section) => (
        <View key={section.key} testID={`faq.section.${section.key}`}>
          <Text style={[textStyles.overline, styles.section]}>{section.title}</Text>

          <View style={styles.list}>
            {section.questions.map((item, index) => {
              const id = `${section.key}-${index}`;
              const isOpen = open === id;

              return (
                <View key={id} style={[styles.item, isOpen && styles.itemOpen]}>
                  <Pressable
                    testID={`faq.question.${id}`}
                    accessibilityRole="button"
                    accessibilityLabel={item.question}
                    accessibilityState={{ expanded: isOpen }}
                    onPress={() => setOpen(isOpen ? null : id)}
                    style={({ pressed }) => [styles.question, pressed && styles.pressed]}
                  >
                    <Text style={[textStyles.rowTitle, styles.questionText]}>{item.question}</Text>
                    <View style={isOpen ? styles.chevronOpen : undefined}>
                      <ChevronDown size={20} color={tokens.iconAccent} strokeWidth={1.75} />
                    </View>
                  </Pressable>

                  {isOpen ? (
                    <View testID={`faq.answer.${id}`} style={styles.answer}>
                      <Text style={textStyles.caption}>{item.answer}</Text>
                      {item.items?.map((line) => (
                        <View key={line} style={styles.bullet}>
                          <Text style={textStyles.caption}>{"•"}</Text>
                          <Text style={[textStyles.caption, styles.bulletText]}>{line}</Text>
                        </View>
                      ))}
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        </View>
      ))}

      <Text style={[textStyles.overline, styles.section]}>{content.feesTitle}</Text>
      <Text style={[textStyles.caption, styles.feesIntro]}>{content.feesIntro}</Text>
      <KeyValueCard
        testID="faq.fees"
        items={content.fees.map((fee, index) => ({
          key: String(index),
          label: fee.concept,
          value: fee.cost,
        }))}
      />
      <Text style={[textStyles.caption, styles.feesNote]}>{content.feesNote}</Text>

      <Text style={[textStyles.overline, styles.section]}>{content.moreTitle}</Text>
      <View style={styles.list}>
        <ListRow
          testID="faq.emailRow"
          icon={Mail}
          title={FAQ_CONTACT.email}
          subtitle={content.moreSubtitle}
          onPress={() => openLink(`mailto:${FAQ_CONTACT.email}`)}
        />
        <ListRow
          testID="faq.callRow"
          icon={Phone}
          title={FAQ_CONTACT.phone}
          onPress={() => openLink(`tel:${FAQ_CONTACT.phone.replace(/[^\d+]/g, "")}`)}
        />
      </View>

      <View testID="faq.terms" style={styles.terms}>
        <Text style={[textStyles.caption, styles.termsText]}>
          {content.termsPrompt}
          <Text
            testID="faq.termsLink"
            accessibilityRole="link"
            onPress={() => openLink(TERMS_URL)}
            style={styles.termsLink}
          >
            {content.termsLink}
          </Text>
        </Text>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  section: {
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
  list: {
    gap: metrics.rowGap,
  },
  item: {
    backgroundColor: tokens.glassSurface,
    borderWidth: 1,
    borderColor: tokens.glassBorderStrong,
    borderRadius: metrics.radius.card,
    overflow: "hidden",
  },
  itemOpen: {
    borderColor: tokens.violet,
  },
  question: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 56,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  pressed: {
    backgroundColor: "rgba(84,32,255,0.18)",
  },
  questionText: {
    flex: 1,
  },
  chevronOpen: {
    transform: [{ rotate: "180deg" }],
  },
  answer: {
    gap: spacing.sm,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  bullet: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  bulletText: {
    flex: 1,
  },
  terms: {
    marginTop: spacing.xxl,
    paddingHorizontal: spacing.sm,
  },
  termsText: {
    textAlign: "center",
    fontSize: 13,
    lineHeight: 20,
  },
  termsLink: {
    color: tokens.iconAccent,
    fontFamily: fontFamily.semibold,
    textDecorationLine: "underline",
  },
  feesIntro: {
    marginBottom: spacing.md,
  },
  feesNote: {
    marginTop: spacing.md,
  },
});
