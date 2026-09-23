import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, LanguageRow, LanguageToggle, LogoTile } from "../components/ui";
import { Language, ViewName } from "../types/app";
import { typography } from "../theme/typography";
import { spacing, screenPadding } from "../theme/spacing";

type Props = {
  t: any;
  language: Language;
  setLanguage: (language: Language) => void;
  setView: (view: ViewName) => void;
};

/** Pantalla de entrada: marca arriba, CTA y seleccion de idioma abajo. */
export default function WelcomeScreen({ t, language, setLanguage, setView }: Props) {
  return (
    <View style={styles.root}>
      <LogoTile />

      <Text style={[typography.display, styles.appName]}>Remeza</Text>
      <Text style={[typography.body, styles.tagline]}>{t.tagline}</Text>

      <Button
        testID="welcome-getStartedButton"
        title={t.getStarted}
        variant="gradient"
        onPress={() => setView("login")}
        style={styles.cta}
      />

      <LanguageRow label={t.language} style={styles.languageRow} />

      <LanguageToggle
        value={language}
        onChange={setLanguage}
        order={["es", "en"]}
        labelFor={(code) => (code === "en" ? t.english : t.spanish)}
        style={styles.toggle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  /**
   * El bloque entero va centrado en vertical, como en el diseno. Con un
   * espaciador flexible la marca quedaba pegada arriba y el CTA abajo, y
   * entre medias se abria un vacio que no esta en la referencia.
   */
  root: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: screenPadding,
    paddingBottom: spacing.xxxl,
  },
  appName: {
    marginTop: spacing.xxl,
    textAlign: "center",
  },
  tagline: {
    marginTop: spacing.sm,
    textAlign: "center",
  },
  cta: {
    marginTop: spacing.xxxl,
  },
  languageRow: {
    marginTop: spacing.xxxl,
  },
  toggle: {
    marginTop: spacing.md,
  },
});
