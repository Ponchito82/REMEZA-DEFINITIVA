import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { ChevronDown, Globe, Phone } from "lucide-react-native";
import OptionSheet from "./ui/OptionSheet";
import TextField from "./ui/TextField";
import FieldLabel from "./ui/FieldLabel";
import { Language } from "../types/app";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
import { radius, sizes } from "../theme/radius";
import { spacing } from "../theme/spacing";
import { COUNTRY_NAMES, CountryCode, countryOptions, isCountryCode } from "../services/geo";
import {
  PHONE_EXAMPLES,
  detectCountryFromInput,
  dialCodeLabel,
  extractNationalDigits,
  formatNationalPhone,
} from "../utils/phone";

type Props = {
  t: any;
  language: Language;
  label?: string;
  country: CountryCode;
  onCountryChange: (country: CountryCode) => void;
  digits: string;
  onDigitsChange: (digits: string) => void;
  error?: string;
  highlighted?: boolean;
  onBlur?: () => void;
  inputRef?: (node: TextInput | null) => void;
  testID?: string;
};

const SELECTOR_WIDTH = 80;

/**
 * Lada + numero. Conserva la deteccion automatica de pais y el selector con
 * las opciones de `services/geo`; el aspecto lo pone ya `TextField`.
 */
export default function PhoneField({
  t,
  language,
  label,
  country,
  onCountryChange,
  digits,
  onDigitsChange,
  error,
  highlighted = false,
  onBlur,
  inputRef,
  testID,
}: Props) {
  const [isPickerOpen, setPickerOpen] = useState(false);

  const handleChangeText = (text: string) => {
    const detected = detectCountryFromInput(text);
    const effectiveCountry = detected ?? country;

    if (detected && detected !== country) {
      onCountryChange(detected);
    }

    onDigitsChange(extractNationalDigits(text, effectiveCountry));
  };

  return (
    <View>
      {label ? <FieldLabel>{label}</FieldLabel> : null}

      <View style={styles.row}>
        <Pressable
          testID={testID ? `${testID}-countryButton` : undefined}
          accessibilityRole="button"
          accessibilityLabel={t.selectCountry}
          onPress={() => setPickerOpen(true)}
          style={({ pressed }) => [styles.selector, pressed && styles.pressed]}
        >
          <Text style={typography.bodyStrong}>{dialCodeLabel(country)}</Text>
          <ChevronDown size={14} color={colors.text.secondary} />
        </Pressable>

        <TextField
          testID={testID}
          accessibilityLabel={label ?? t.phoneNumber}
          value={formatNationalPhone(digits, country)}
          onChangeText={handleChangeText}
          onBlur={onBlur}
          placeholder={PHONE_EXAMPLES[country]}
          keyboardType="phone-pad"
          leftIcon={Phone}
          iconBackground={colors.primary}
          iconColor={colors.text.primary}
          highlighted={highlighted}
          error={error || undefined}
          inputRef={inputRef}
          style={styles.input}
        />
      </View>

      <OptionSheet
        visible={isPickerOpen}
        onClose={() => setPickerOpen(false)}
        title={t.selectCountry}
        icon={Globe}
        options={countryOptions(language).map((option) => ({
          label: `${COUNTRY_NAMES[option.value as CountryCode][language]} (${dialCodeLabel(option.value as CountryCode)})`,
          value: option.value,
        }))}
        value={country}
        onSelect={(next) => {
          if (isCountryCode(next)) onCountryChange(next);
          setPickerOpen(false);
        }}
        testID={testID ? `${testID}-countryPicker` : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  selector: {
    width: SELECTOR_WIDTH,
    height: sizes.input,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
  },
  pressed: {
    opacity: 0.85,
  },
});
