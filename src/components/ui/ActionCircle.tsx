import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { tokens } from "../../theme/colors";
import { fontFamily } from "../../theme/typography";
import type { IconComponent } from "./GlassInput";

type Props = {
  icon: IconComponent;
  label: string;
  onPress: () => void;
  /** Relleno violeta: accion activa (p. ej. favorito marcado) */
  active?: boolean;
  tone?: "default" | "danger";
  testID?: string;
};

const SIZE = 64;

/** Accion rapida: circulo de 64 con aro violeta y etiqueta debajo. */
export default function ActionCircle({
  icon: Icon,
  label,
  onPress,
  active = false,
  tone = "default",
  testID,
}: Props) {
  const isDanger = tone === "danger";
  const ring = isDanger ? tokens.danger : tokens.violetBright;
  const iconColor = active ? tokens.textPrimary : isDanger ? tokens.dangerText : tokens.iconAccent;

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={styles.root}
    >
      {({ pressed }) => (
        <>
          <View
            style={[
              styles.circle,
              { borderColor: ring },
              (active || pressed) && { backgroundColor: active ? tokens.violet : tokens.indigoDeep },
            ]}
          >
            <Icon size={26} color={iconColor} strokeWidth={1.75} />
          </View>
          <Text style={styles.label} numberOfLines={2}>
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  circle: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.glassSurface,
  },
  label: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 16,
    includeFontPadding: false,
    color: tokens.textSecondary,
    textAlign: "center",
  },
});
