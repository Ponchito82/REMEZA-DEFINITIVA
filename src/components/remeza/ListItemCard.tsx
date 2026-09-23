import React from "react";
import { View, Text, Pressable, StyleSheet, StyleProp, ViewStyle } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { ChevronRight } from "lucide-react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { radius, sizes } from "../../theme/radius";
import { spacing } from "../../theme/spacing";
import type { IconComponent } from "../ui";

type Props = {
  icon: IconComponent;
  title: string;
  description: string;
  showChevron?: boolean;
  selected?: boolean;
  /** Sin `onPress` la fila es informativa y no responde al tacto */
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * Fila de lista con icono, titulo y descripcion. La comparten las opciones de
 * *Cancelar o disputar* (seleccionables) y las notas de *Verificacion en dos
 * pasos* (informativas).
 */
export default function ListItemCard({
  icon: Icon,
  title,
  description,
  showChevron = false,
  selected = false,
  onPress,
  style,
  testID,
}: Props) {
  const content = (
    <>
      {/* Degradado morado que entra por la izquierda, como en el diseno. */}
      <LinearGradient
        colors={["rgba(75,35,250,0.18)", "rgba(75,35,250,0)"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <View style={styles.iconCircle}>
        <Icon size={24} color={colors.heroCircle.icon} strokeWidth={2} />
      </View>

      <View style={styles.text}>
        <Text style={typography.listItemTitle} numberOfLines={1}>
          {title}
        </Text>
        <Text style={typography.listItemDescription} numberOfLines={2}>
          {description}
        </Text>
      </View>

      {showChevron ? (
        <ChevronRight size={20} color={colors.text.primary} strokeWidth={2} />
      ) : null}
    </>
  );

  if (!onPress) {
    return (
      <View testID={testID} style={[styles.root, selected && styles.selected, style]}>
        {content}
      </View>
    );
  }

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.root,
        selected && styles.selected,
        pressed && styles.pressed,
        style,
      ]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  selected: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceStrong,
  },
  iconCircle: {
    width: sizes.listIcon,
    height: sizes.listIcon,
    borderRadius: sizes.listIcon / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.iconCircleBg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: {
    flex: 1,
    gap: spacing.xs,
  },
  pressed: {
    opacity: 0.85,
  },
});
