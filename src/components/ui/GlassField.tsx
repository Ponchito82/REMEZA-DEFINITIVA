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
import { fontFamily, fontSize, palette, radii } from "../../theme/designSystem";

export type IconComponent = React.ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number;
}>;

type Props = {
  /** Icono de lucide-react-native mostrado en el badge circular */
  icon?: IconComponent;
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  /** Anade el ojo para mostrar/ocultar el contenido */
  secureToggle?: boolean;
  maxLength?: number;
  onBlur?: () => void;
  error?: string;
  editable?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  testID?: string;
  style?: ViewStyle;
};

const HEIGHT = 66;

/**
 * Campo Liquid Glass: superficie translucida, borde violeta tenue y
 * badge circular con icono.
 */
export default function GlassField({
  icon: Icon,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  secureTextEntry = false,
  secureToggle = false,
  maxLength,
  onBlur,
  error,
  editable = true,
  autoCapitalize = "none",
  testID,
  style,
}: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const isMasked = secureToggle ? !isRevealed : secureTextEntry;

  return (
    <View style={style}>
      <View style={[styles.field, isFocused && styles.fieldFocused, !!error && styles.fieldError]}>
        {Icon ? (
          <View style={styles.badge}>
            <Icon size={22} color={palette.textPrimary} strokeWidth={2} />
          </View>
        ) : null}

        <TextInput
          testID={testID}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={palette.textDisabled}
          keyboardType={keyboardType}
          secureTextEntry={isMasked}
          maxLength={maxLength}
          editable={editable}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          style={[styles.input, !Icon && styles.inputNoIcon, secureToggle && styles.inputWithToggle]}
        />

        {secureToggle ? (
          <Pressable onPress={() => setIsRevealed((prev) => !prev)} hitSlop={10} style={styles.toggle}>
            {isRevealed ? (
              <EyeOff size={20} color={palette.textSecondary} />
            ) : (
              <Eye size={20} color={palette.textSecondary} />
            )}
          </Pressable>
        ) : null}
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
    paddingLeft: 9,
    paddingRight: 20,
    borderRadius: radii.field,
    borderWidth: 1,
    borderColor: palette.glassBorder,
    backgroundColor: palette.glassSurface,
  },
  fieldFocused: {
    borderColor: "rgba(160,140,255,0.65)",
    backgroundColor: "rgba(35,30,90,0.5)",
  },
  fieldError: {
    borderColor: palette.dangerBorder,
  },
  badge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.glassSurfaceStrong,
    borderWidth: 1,
    borderColor: "rgba(150,130,255,0.22)",
  },
  input: {
    flex: 1,
    height: "100%",
    paddingVertical: 0,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.control,
    color: palette.textPrimary,
  },
  inputNoIcon: {
    marginLeft: 14,
  },
  inputWithToggle: {
    paddingRight: 8,
  },
  toggle: {
    marginLeft: 8,
  },
  errorText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.micro,
    color: palette.danger,
    marginTop: 8,
    marginLeft: 24,
  },
});
