import React, { useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  ViewStyle,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from "react-native";
import { colors } from "../../theme/colors";
import { fontFamily, typography } from "../../theme/typography";
import { spacing } from "../../theme/spacing";

type Props = {
  value: string[];
  onChange: (next: string[]) => void;
  onComplete?: (code: string) => void;
  length?: number;
  /** `lg` reparte las cajas a lo ancho, como en Verificacion en dos pasos */
  size?: "md" | "lg";
  /** Prefijo de los testID: cada caja queda como `${testID}-<indice>` */
  testID?: string;
  style?: ViewStyle;
};

const BOX_WIDTH = 48;
const BOX_HEIGHT = 56;
const BOX_WIDTH_LG = 52;
const BOX_HEIGHT_LG = 60;

/**
 * Codigo SMS en cajas separadas.
 *
 * Cada caja es un `TextInput` real y no un campo oculto que reparte digitos:
 * la suite de Appium hace `setValue` sobre `${testID}-0..5` por separado, y con
 * un solo input compartido esos localizadores dejan de existir.
 */
export default function OtpInput({
  value,
  onChange,
  onComplete,
  length = 6,
  size = "md",
  testID,
  style,
}: Props) {
  const isLarge = size === "lg";
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChange = (index: number, text: string) => {
    const digit = text.replace(/\D/g, "").slice(-1);
    const next = [...value];
    next[index] = digit;
    onChange(next);

    if (digit && index < length - 1) inputs.current[index + 1]?.focus();

    const code = next.join("");
    if (code.length === length && !next.some((entry) => !entry)) onComplete?.(code);
  };

  const handleKeyPress = (
    index: number,
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => {
    if (event.nativeEvent.key === "Backspace" && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={[styles.root, isLarge && styles.rootLarge, style]}>
      {Array.from({ length }, (_, index) => (
        <TextInput
          key={index}
          ref={(node) => {
            inputs.current[index] = node;
          }}
          testID={testID ? `${testID}-${index}` : undefined}
          accessibilityLabel={`Digit ${index + 1}`}
          value={value[index] ?? ""}
          onChangeText={(text) => handleChange(index, text)}
          onKeyPress={(event) => handleKeyPress(index, event)}
          keyboardType="number-pad"
          maxLength={1}
          /**
           * Sin esto, tocar una caja ya llena deja el cursor **antes** del
           * digito: con `maxLength` a 1 el teclado rechaza la pulsacion y el
           * retroceso no borra nada, asi que el digito se queda atascado.
           * Seleccionarlo al enfocar hace que la siguiente tecla lo sustituya.
           */
          selectTextOnFocus
          textAlign="center"
          style={[
            styles.box,
            isLarge && styles.boxLarge,
            !!value[index] && styles.boxFilled,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.sm + 2,
  },
  rootLarge: {
    justifyContent: "space-between",
  },
  box: {
    ...typography.bodyStrong,
    width: BOX_WIDTH,
    height: BOX_HEIGHT,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingVertical: 0,
  },
  boxLarge: {
    width: BOX_WIDTH_LG,
    height: BOX_HEIGHT_LG,
    fontSize: 24,
    fontFamily: fontFamily.regular,
  },
  boxFilled: {
    borderColor: colors.primary,
  },
});
