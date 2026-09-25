import React from "react";
import { Pressable, StyleSheet, Text, View, StyleProp, ViewStyle } from "react-native";
import { ChevronRight, Lock } from "lucide-react-native";
import { tokens } from "../../theme/colors";
import { textStyles } from "../../theme/typography";
import { metrics } from "../../theme/radius";
import RadioDot from "./RadioDot";
import Toggle from "./Toggle";
import type { IconComponent } from "./GlassInput";

export type ListRowRight = "chevron" | "toggle" | "radio" | "value" | "lock" | "none";

type Props = {
  icon?: IconComponent;
  /** Icono suelto, sin el circulo de fondo */
  bareIcon?: boolean;
  /** Sustituye al circulo de icono: avatar, bandera, etc. */
  leading?: React.ReactNode;
  title: string;
  subtitle?: string;
  right?: ListRowRight;
  /** Texto de la derecha. Con `right="chevron"` va antes del chevron. */
  value?: string;
  valueColor?: string;
  /** Estado del toggle o del radio */
  selected?: boolean;
  tone?: "default" | "danger";
  onPress?: () => void;
  /** Para `right="toggle"` */
  onToggle?: (value: boolean) => void;
  /** `false` quita el borde y el fondo: filas dentro de una card agrupada */
  framed?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
};

/**
 * Fila de lista del diseno: circulo de icono, titulo, subtitulo y un accesorio
 * a la derecha. Sin `onPress` se pinta como fila informativa.
 */
export default function ListRow({
  icon: Icon,
  bareIcon = false,
  leading,
  title,
  subtitle,
  right = "chevron",
  value,
  valueColor,
  selected = false,
  tone = "default",
  onPress,
  onToggle,
  framed = true,
  style,
  testID,
  accessibilityLabel,
}: Props) {
  const isDanger = tone === "danger";
  const iconColor = isDanger ? tokens.dangerText : tokens.iconAccent;

  const content = (
    <>
      {leading ??
        (Icon && bareIcon ? (
          <View style={styles.bareIcon}>
            <Icon size={26} color={iconColor} strokeWidth={1.75} />
          </View>
        ) : Icon ? (
          <View style={[styles.iconCircle, isDanger && styles.iconCircleDanger]}>
            <Icon size={24} color={iconColor} strokeWidth={1.75} />
          </View>
        ) : null)}

      <View style={styles.text}>
        <Text
          style={[textStyles.rowTitle, isDanger && { color: tokens.dangerText }]}
          numberOfLines={2}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text style={textStyles.rowSubtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {right === "chevron" && value ? (
        <Text style={[textStyles.value, valueColor ? { color: valueColor } : null]}>{value}</Text>
      ) : null}
      {right === "chevron" ? (
        <ChevronRight size={20} color={iconColor} strokeWidth={1.75} />
      ) : null}
      {right === "lock" ? (
        <Lock size={18} color={tokens.textDisabled} strokeWidth={1.75} />
      ) : null}
      {right === "value" && value ? (
        <Text style={[textStyles.value, valueColor ? { color: valueColor } : null]}>{value}</Text>
      ) : null}
      {right === "radio" ? <RadioDot selected={selected} /> : null}
      {right === "toggle" ? (
        <Toggle value={selected} onChange={(next) => onToggle?.(next)} />
      ) : null}
    </>
  );

  const rowStyle = [
    styles.root,
    framed && styles.framed,
    framed && isDanger && styles.framedDanger,
    framed && selected && right !== "toggle" && styles.selected,
    style,
  ];

  if (!onPress) {
    return (
      <View testID={testID} style={rowStyle}>
        {content}
      </View>
    );
  }

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [rowStyle, pressed && styles.pressed]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: metrics.listRowMin,
    padding: 12,
  },
  framed: {
    backgroundColor: tokens.glassSurface,
    borderWidth: 1,
    borderColor: tokens.glassBorderStrong,
    borderRadius: metrics.radius.card,
  },
  framedDanger: {
    backgroundColor: tokens.dangerSurface,
    borderColor: "rgba(250,0,110,0.45)",
  },
  selected: {
    borderColor: tokens.violet,
    backgroundColor: "rgba(84,32,255,0.16)",
  },
  pressed: {
    backgroundColor: "rgba(84,32,255,0.18)",
  },
  iconCircle: {
    width: metrics.rowIconCircle,
    height: metrics.rowIconCircle,
    borderRadius: metrics.rowIconCircle / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.iconCircle,
  },
  iconCircleDanger: {
    backgroundColor: "rgba(250,0,110,0.18)",
  },
  bareIcon: {
    width: 40,
    alignItems: "center",
  },
  text: {
    flex: 1,
    gap: 2,
  },
});
