import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ViewStyle,
  KeyboardTypeOptions,
} from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { radius, sizes } from "../../theme/radius";
import { spacing } from "../../theme/spacing";
import FieldLabel from "./FieldLabel";
import type { IconComponent } from "./GlassInput";

type Props = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  /** Se dibuja dentro de un circulo de 36 pegado al borde izquierdo */
  leftIcon?: IconComponent;
  /** Relleno del circulo del icono. El alta lo usa en `primary` solido. */
  iconBackground?: string;
  iconColor?: string;
  /** Se dibuja suelto a la derecha. Lo desplaza el ojo si el campo es seguro. */
  rightIcon?: IconComponent;
  secureTextEntry?: boolean;
  helperText?: string;
  error?: string;
  editable?: boolean;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  onBlur?: () => void;
  /** Resalta el borde: lo usa `useFormFocus` al saltar al campo que falta */
  highlighted?: boolean;
  inputRef?: (node: TextInput | null) => void;
  /** `pill` para los campos del Login */
  shape?: "md" | "pill";
  style?: ViewStyle;
  testID?: string;
  accessibilityLabel?: string;
};

/**
 * Campo de texto del diseno. El icono va dentro de un circulo pegado al borde;
 * con foco solo cambia el **color** del borde, porque engordarlo descuadraria
 * el alto de 52 contra los campos vecinos.
 */
export default function TextField({
  label,
  placeholder,
  value,
  onChangeText,
  leftIcon: LeftIcon,
  iconBackground = colors.surfaceStrong,
  iconColor = colors.primaryLight,
  rightIcon: RightIcon,
  secureTextEntry = false,
  helperText,
  error,
  editable = true,
  keyboardType = "default",
  maxLength,
  autoCapitalize = "none",
  onBlur,
  highlighted = false,
  inputRef,
  shape = "md",
  style,
  testID,
  accessibilityLabel,
}: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const helper = error ?? helperText;

  return (
    <View style={style}>
      {label ? <FieldLabel>{label}</FieldLabel> : null}

      <View
        style={[
          styles.field,
          { borderRadius: shape === "pill" ? radius.pill : radius.md },
          (isFocused || highlighted) && styles.fieldFocused,
          !!error && styles.fieldError,
        ]}
      >
        {LeftIcon ? (
          <View style={[styles.iconCircle, { backgroundColor: iconBackground }]}>
            <LeftIcon size={18} color={iconColor} strokeWidth={2} />
          </View>
        ) : null}

        <TextInput
          ref={inputRef}
          testID={testID}
          accessibilityLabel={accessibilityLabel ?? label ?? placeholder}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.text.placeholder}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry && !isRevealed}
          maxLength={maxLength}
          editable={editable}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          style={[
            editable ? typography.input : typography.bodyStrong,
            styles.input,
            !LeftIcon && styles.inputFlush,
          ]}
        />

        {secureTextEntry ? (
          <Pressable
            testID={testID ? `${testID}-revealToggle` : undefined}
            accessibilityRole="button"
            accessibilityLabel={isRevealed ? "Hide" : "Show"}
            onPress={() => setIsRevealed((prev) => !prev)}
            hitSlop={8}
            style={styles.trailing}
          >
            {isRevealed ? (
              <EyeOff size={18} color={colors.text.placeholder} strokeWidth={2} />
            ) : (
              <Eye size={18} color={colors.text.placeholder} strokeWidth={2} />
            )}
          </Pressable>
        ) : null}

        {RightIcon && !secureTextEntry ? (
          <View style={styles.trailing}>
            <RightIcon size={18} color={colors.text.placeholder} strokeWidth={2} />
          </View>
        ) : null}
      </View>

      {helper ? (
        <Text
          testID={testID ? `${testID}-helperText` : undefined}
          style={[typography.caption, styles.helper, !!error && styles.helperError]}
        >
          {helper}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    width: "100%",
    height: sizes.input,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  fieldFocused: {
    borderColor: colors.primary,
  },
  fieldError: {
    borderColor: colors.danger,
  },
  iconCircle: {
    width: sizes.inputIcon,
    height: sizes.inputIcon,
    borderRadius: sizes.inputIcon / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    height: "100%",
    paddingVertical: 0,
    paddingHorizontal: spacing.md,
  },
  inputFlush: {
    paddingLeft: spacing.sm,
  },
  trailing: {
    paddingHorizontal: spacing.sm,
  },
  helper: {
    marginTop: spacing.sm,
  },
  helperError: {
    color: colors.danger,
  },
});
