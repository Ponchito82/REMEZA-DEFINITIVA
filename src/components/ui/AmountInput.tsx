import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, StyleProp, ViewStyle } from "react-native";
import { tokens } from "../../theme/colors";
import { fontFamily, textStyles } from "../../theme/typography";
import { metrics } from "../../theme/radius";

type Props = {
  label?: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  /** Texto de ayuda bajo el campo ("Limite minimo: $1,000") */
  helper?: string;
  error?: string;
  /** Simbolo de la izquierda */
  symbol?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/** Campo de monto: simbolo y cifra grande. Solo acepta digitos y un punto. */
export default function AmountInput({
  label,
  value,
  onChangeText,
  placeholder = "0",
  helper,
  error,
  symbol = "$",
  style,
  testID,
}: Props) {
  const [focused, setFocused] = useState(false);

  const handleChange = (text: string) => {
    const clean = text.replace(/[^0-9.]/g, "");
    const [whole, ...rest] = clean.split(".");
    onChangeText(rest.length ? `${whole}.${rest.join("").slice(0, 2)}` : whole);
  };

  return (
    <View style={style}>
      {label ? <Text style={[textStyles.rowSubtitle, styles.label]}>{label}</Text> : null}

      <View
        style={[
          styles.field,
          focused && styles.fieldFocused,
          !!error && styles.fieldError,
        ]}
      >
        <Text style={styles.symbol}>{symbol}</Text>
        <TextInput
          testID={testID}
          accessibilityLabel={label}
          value={value}
          onChangeText={handleChange}
          placeholder={placeholder}
          placeholderTextColor={tokens.textDisabled}
          keyboardType="decimal-pad"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          selectionColor={tokens.violet}
          style={styles.input}
        />
      </View>

      {error || helper ? (
        <Text style={[textStyles.caption, styles.helper, !!error && { color: tokens.dangerText }]}>
          {error ?? helper}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 8,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    height: 64,
    paddingHorizontal: 18,
    borderRadius: metrics.radius.input,
    borderWidth: 1,
    borderColor: tokens.glassBorder,
    backgroundColor: tokens.glassSurface,
  },
  fieldFocused: {
    borderColor: tokens.violet,
  },
  fieldError: {
    borderColor: tokens.danger,
  },
  symbol: {
    fontFamily: fontFamily.regular,
    fontSize: 22,
    includeFontPadding: false,
    color: tokens.textSecondary,
  },
  input: {
    flex: 1,
    fontFamily: fontFamily.semibold,
    fontSize: 28,
    includeFontPadding: false,
    color: tokens.textPrimary,
    paddingVertical: 0,
  },
  helper: {
    marginTop: 8,
  },
});
