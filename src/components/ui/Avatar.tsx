import React from "react";
import { Image, StyleSheet, Text, View, StyleProp, ViewStyle } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { tokens } from "../../theme/colors";
import { fontFamily } from "../../theme/typography";

type Props = {
  /** Nombre del que salen las iniciales */
  name: string;
  /** Foto remota del usuario, si la hay */
  uri?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  const first = words[0][0] ?? "";
  const last = words.length > 1 ? words[words.length - 1][0] ?? "" : "";
  return (first + last).toUpperCase();
}

/** Avatar: la foto si existe; si no, iniciales sobre el degradado de marca. */
export default function Avatar({ name, uri, size = 44, style, testID }: Props) {
  const box = { width: size, height: size, borderRadius: size / 2 };

  if (uri) {
    return <Image testID={testID} source={{ uri }} style={[box, style as object]} />;
  }

  return (
    <View testID={testID} style={[styles.root, box, style]}>
      <LinearGradient
        colors={[tokens.violet, tokens.purple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, box]}
      />
      <Text style={[styles.initials, { fontSize: size * 0.36 }]}>{initialsOf(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontFamily: fontFamily.semibold,
    includeFontPadding: false,
    color: tokens.textPrimary,
  },
});
