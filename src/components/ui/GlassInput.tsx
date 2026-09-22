import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  KeyboardTypeOptions,
} from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

export type IconComponent = React.ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number;
}>;

type Props = {
  /** Icono de contorno de lucide-react-native */
  icon?: IconComponent;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  maxLength?: number;
  onBlur?: () => void;
  error?: string;
  testID?: string;
  style?: ViewStyle;
};

const HEIGHT = 64;
const RADIUS = HEIGHT / 2;

/** Campo de vidrio: superficie translucida y badge circular con icono. */
export default function GlassInput({
  icon: Icon,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  secureTextEntry = false,
  maxLength,
  onBlur,
  error,
  testID,
  style,
}: Props) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={style}>
      <View style={[styles.field, isFocused && styles.fieldFocused, !!error && styles.fieldError]}>
        <View style={styles.lightLine} pointerEvents="none" />

        {Icon ? (
          <View style={styles.badge}>
            <Icon size={20} color={colors.textPrimary} strokeWidth={1.75} />
          </View>
        ) : null}

        <TextInput
          testID={testID}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textDisabled}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          maxLength={maxLength}
          autoCapitalize="none"
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          style={[typography.input, styles.input, !Icon && styles.inputNoIcon]}
        />
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    width: "100%",
    height: HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingLeft: 8,
    paddingRight: 20,
    borderRadius: RADIUS,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.glassSurface,
  },
  /** Con foco solo cambia el color del borde: engordarlo descuadra el alto. */
  fieldFocused: {
    borderColor: colors.violet,
  },
  fieldError: {
    borderColor: "rgba(255,107,138,0.35)",
  },
  lightLine: {
    position: "absolute",
    top: 0,
    left: RADIUS,
    right: RADIUS,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  badge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.indigoDeep,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  input: {
    flex: 1,
    height: "100%",
    paddingVertical: 0,
  },
  inputNoIcon: {
    marginLeft: 6,
  },
  errorText: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    color: "#FF6B8A",
    marginTop: 8,
    marginLeft: 24,
    includeFontPadding: false,
  },
});
