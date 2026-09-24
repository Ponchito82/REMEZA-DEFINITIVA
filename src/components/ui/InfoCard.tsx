import React from "react";
import { StyleSheet, Text, View, StyleProp, ViewStyle } from "react-native";
import { Info } from "lucide-react-native";
import { tokens } from "../../theme/colors";
import { textStyles } from "../../theme/typography";
import { metrics } from "../../theme/radius";
import type { IconComponent } from "./GlassInput";

export type InfoTone = "default" | "danger" | "warning" | "success";

type Props = {
  icon?: IconComponent;
  title?: string;
  text: string;
  tone?: InfoTone;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  /** testID del Text del mensaje */
  textTestID?: string;
};

const TONES: Record<InfoTone, { surface: string; border: string; accent: string }> = {
  default: {
    surface: tokens.glassSurface,
    border: tokens.glassBorderStrong,
    accent: tokens.iconAccent,
  },
  danger: {
    surface: tokens.dangerSurface,
    border: "rgba(250,0,110,0.45)",
    accent: tokens.dangerText,
  },
  warning: {
    surface: tokens.warningSurface,
    border: "rgba(227,193,56,0.40)",
    accent: tokens.warningText,
  },
  success: {
    surface: "rgba(22,207,153,0.12)",
    border: "rgba(22,207,153,0.40)",
    accent: tokens.successText,
  },
};

/** Aviso con icono: informativo, de error, de advertencia o de exito. */
export default function InfoCard({
  icon: Icon = Info,
  title,
  text,
  tone = "default",
  style,
  testID,
  textTestID,
}: Props) {
  const palette = TONES[tone];

  return (
    <View
      testID={testID}
      style={[styles.root, { backgroundColor: palette.surface, borderColor: palette.border }, style]}
    >
      <Icon size={22} color={palette.accent} strokeWidth={1.75} />

      <View style={styles.text}>
        {title ? <Text style={[textStyles.rowTitle, styles.title]}>{title}</Text> : null}
        <Text testID={textTestID} style={textStyles.caption}>
          {text}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 16,
    borderRadius: metrics.radius.card,
    borderWidth: 1,
  },
  text: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 15,
    lineHeight: 20,
  },
});
