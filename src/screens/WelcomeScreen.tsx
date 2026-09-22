import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  GradientButton,
  LanguageRow,
  LanguageToggle,
  LogoTile,
} from "../components/ui";
import { Language, ViewName } from "../types/app";
import { typography } from "../theme/typography";

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
      <View style={styles.content}>
        <LogoTile size={128} radius={32} />
        <Text style={[typography.titleHero, styles.appName]}>Remeza</Text>
        <Text style={[typography.subtitle, styles.tagline]}>{t.tagline}</Text>

        <GradientButton
          testID="welcome-getStartedButton"
          title={t.getStarted}
          gradient="horizontal"
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
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  /**
   * El bloque entero va centrado en vertical, como en el diseno. Con un
   * espaciador flexible la marca quedaba pegada arriba y el CTA abajo, y
   * entre medias se abria un vacio que no esta en la referencia.
   */
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  appName: {
    marginTop: 28,
    textAlign: "center",
  },
  tagline: {
    marginTop: 8,
    textAlign: "center",
  },
  cta: {
    marginTop: 40,
  },
  languageRow: {
    marginTop: 40,
  },
  toggle: {
    marginTop: 12,
  },
});
