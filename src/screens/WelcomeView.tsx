import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  BrandMark,
  PrimaryButton,
  LanguageToggle,
} from "../components/ui";
import { Language, ViewName } from "../types/app";
import { fontFamily, fontSize, palette, spacing } from "../theme/designSystem";

type Props = {
  t: any;
  language: Language;
  setLanguage: (language: Language) => void;
  setView: (view: ViewName) => void;
};

/** Pantalla de entrada: marca, claim y seleccion de idioma. */
export default function WelcomeView({ t, language, setLanguage, setView }: Props) {
  return (
      <View style={styles.content}>
        <View style={styles.brand}>
          <BrandMark size={128} />
          <Text style={styles.appName}>Remeza</Text>
          <Text style={styles.tagline}>{t.tagline}</Text>
        </View>

        <View style={styles.footer}>
          <PrimaryButton
            testID="welcome-getStartedButton"
            label={t.getStarted}
            onPress={() => setView("login")}
          />

          <LanguageToggle
            t={t}
            language={language}
            setLanguage={setLanguage}
            order={["es", "en"]}
            style={styles.language}
          />
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 26,
    paddingBottom: spacing.xl,
  },
  brand: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  appName: {
    fontFamily: fontFamily.bold,
    fontSize: 32,
    color: palette.textPrimary,
    marginTop: spacing.lg,
    letterSpacing: -0.5,
  },
  tagline: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.subtitle,
    color: palette.textSecondary,
    marginTop: spacing.sm,
  },
  footer: {
    paddingBottom: spacing.md,
  },
  language: {
    marginTop: spacing.xxl,
  },
});
