import React from "react";
import { View, Text, Pressable } from "react-native";
import { Languages } from "lucide-react-native";
import { Language } from "../types/app";
import { styles } from "../theme/styles";
import { PURPLE } from "../theme/colors";

type Props = {
  t: any;
  language: Language;
  setLanguage: (language: Language) => void;
};

export default function LanguageSwitcher({ t, language, setLanguage }: Props) {
  return (
    <View style={styles.languageBox}>
      <View style={styles.languageHeader}>
        <Languages size={16} color={PURPLE} />
        <Text style={styles.languageLabel}>{t.language}</Text>
      </View>

      <View style={styles.languageToggle}>
        <Pressable
          testID="languageSwitcher-enOption"
          onPress={() => setLanguage("en")}
          style={[
            styles.languageOption,
            language === "en" && styles.languageOptionActive,
          ]}
        >
          <Text
            style={[
              styles.languageOptionText,
              language === "en" && styles.languageOptionTextActive,
            ]}
          >
            {t.english}
          </Text>
        </Pressable>

        <Pressable
          testID="languageSwitcher-esOption"
          onPress={() => setLanguage("es")}
          style={[
            styles.languageOption,
            language === "es" && styles.languageOptionActive,
          ]}
        >
          <Text
            style={[
              styles.languageOptionText,
              language === "es" && styles.languageOptionTextActive,
            ]}
          >
            {t.spanish}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}