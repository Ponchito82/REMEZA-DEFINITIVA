import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View, StyleProp, ViewStyle } from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import { Check, ChevronRight, Copy, Lock, Pencil } from "lucide-react-native";
import { tokens } from "../../theme/colors";
import { textStyles } from "../../theme/typography";
import { metrics } from "../../theme/radius";
import type { IconComponent } from "./GlassInput";

export type DetailRowRight = "chevron" | "copy" | "edit" | "lock" | "none";

type Props = {
  icon?: IconComponent;
  /** Etiqueta en MAYUSCULAS */
  label: string;
  value: string;
  right?: DetailRowRight;
  valueColor?: string;
  /** Contenido propio en lugar del valor en texto (p. ej. un StatusBadge) */
  valueNode?: React.ReactNode;
  /** Para `chevron` y `edit` */
  onPress?: () => void;
  /** Texto breve que se muestra tras copiar */
  copiedLabel?: string;
  /** Fondo de la fila. Por defecto el vidrio; las pantallas solidas pasan el suyo. */
  surfaceColor?: string;
  /** `false` quita borde y fondo: filas dentro de una card agrupada */
  framed?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  /** testID del Text del valor: las pruebas leen el valor por aqui */
  valueTestID?: string;
};

/**
 * Fila de dato: etiqueta arriba, valor abajo y un accesorio a la derecha.
 * `lock` marca un dato de solo lectura; `copy` lo copia al portapapeles.
 */
export default function DetailRow({
  icon: Icon,
  label,
  value,
  right = "none",
  valueColor,
  valueNode,
  onPress,
  copiedLabel,
  surfaceColor,
  framed = true,
  style,
  testID,
  valueTestID,
}: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const handleCopy = () => {
    Clipboard.setString(value);
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1500);
  };

  const accessory = (() => {
    switch (right) {
      case "chevron":
        return <ChevronRight size={20} color={tokens.iconAccent} strokeWidth={1.75} />;
      case "lock":
        return <Lock size={18} color={tokens.textDisabled} strokeWidth={1.75} />;
      case "edit":
        return (
          <Pressable accessibilityRole="button" onPress={onPress} hitSlop={10}>
            <Pencil size={18} color={tokens.iconAccent} strokeWidth={1.75} />
          </Pressable>
        );
      case "copy":
        return (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={copiedLabel}
            onPress={handleCopy}
            hitSlop={10}
            style={styles.copy}
          >
            {copied ? (
              <>
                <Check size={16} color={tokens.successText} strokeWidth={1.75} />
                {copiedLabel ? <Text style={styles.copied}>{copiedLabel}</Text> : null}
              </>
            ) : (
              <Copy size={18} color={tokens.iconAccent} strokeWidth={1.75} />
            )}
          </Pressable>
        );
      default:
        return null;
    }
  })();

  const body = (
    <>
      {Icon ? <Icon size={20} color={tokens.iconAccent} strokeWidth={1.75} /> : null}

      <View style={styles.text}>
        <Text style={textStyles.overline}>{label}</Text>
        {valueNode ?? (
          <Text
            testID={valueTestID}
            style={[textStyles.value, valueColor ? { color: valueColor } : null]}
            selectable
          >
            {value}
          </Text>
        )}
      </View>

      {accessory}
    </>
  );

  const rowStyle = [
    styles.root,
    framed && styles.framed,
    framed && surfaceColor ? { backgroundColor: surfaceColor } : null,
    style,
  ];

  if (right === "chevron" && onPress) {
    return (
      <Pressable
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={`${label} ${value}`}
        onPress={onPress}
        style={({ pressed }) => [rowStyle, pressed && styles.pressed]}
      >
        {body}
      </Pressable>
    );
  }

  return (
    <View testID={testID} style={rowStyle}>
      {body}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    minHeight: metrics.detailRowMin,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  framed: {
    backgroundColor: tokens.glassSurface,
    borderWidth: 1,
    borderColor: tokens.glassBorderStrong,
    borderRadius: metrics.radius.card,
  },
  pressed: {
    backgroundColor: "rgba(84,32,255,0.18)",
  },
  text: {
    flex: 1,
    gap: 4,
  },
  copy: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  copied: {
    ...textStyles.caption,
    color: tokens.successText,
  },
});
