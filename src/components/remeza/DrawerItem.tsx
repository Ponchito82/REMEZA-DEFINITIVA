import React from "react";
import { Text, Pressable, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { colors } from "../../theme/colors";
import { fontFamily } from "../../theme/typography";
import { spacing } from "../../theme/spacing";
import type { IconComponent } from "../ui";

type Props = {
  icon: IconComponent;
  label: string;
  onPress: () => void;
  /** Chevron a la derecha: la fila abre otra capa en vez de navegar */
  showChevron?: boolean;
  /** Ultima fila de su grupo: sin divisor debajo */
  last?: boolean;
  /** Tono destructivo, para "Cerrar sesión" */
  danger?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * Fila del menu lateral: icono, etiqueta y un divisor de 1px debajo. Es el
 * unico bloque del menu, asi que agregar una entrada es una linea.
 */
export default function DrawerItem({
  icon: Icon,
  label,
  onPress,
  showChevron = false,
  last = false,
  danger = false,
  style,
  testID,
}: Props) {
  const tint = danger ? colors.danger : colors.primaryLight;

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.root,
        !last && styles.divided,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Icon size={22} color={tint} strokeWidth={1.75} />

      <Text style={[styles.label, danger && styles.labelDanger]} numberOfLines={1}>
        {label}
      </Text>

      {showChevron ? (
        <ChevronRight size={20} color={colors.primaryLight} strokeWidth={2} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xl,
    paddingVertical: spacing.xl,
  },
  divided: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  label: {
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: 17,
    color: colors.text.primary,
    includeFontPadding: false,
  },
  labelDanger: {
    fontFamily: fontFamily.semibold,
    color: colors.danger,
  },
  pressed: {
    opacity: 0.6,
  },
});
