import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Modal } from "react-native";
import { ChevronDown, Check } from "lucide-react-native";
import { styles } from "../theme/styles";
import { PURPLE } from "../theme/colors";
import { Language } from "../types/app";
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
      {label ? <Text style={styles.formLabel}>{label}</Text> : null}

      <View style={styles.phoneRow}>
        <Pressable
          testID={testID ? `${testID}-countryButton` : undefined}
          onPress={() => setPickerOpen(true)}
          style={({ pressed }) => [
            styles.prefixBox,
            styles.prefixBoxRow,
            pressed && { opacity: 0.85 },
          ]}
        >
          <Text style={styles.prefixText}>{dialCodeLabel(country)}</Text>
          <ChevronDown size={14} color="#6B7280" />
        </Pressable>

        <TextInput
          ref={inputRef}
          testID={testID}
          value={formatNationalPhone(digits, country)}
          onChangeText={handleChangeText}
          onBlur={onBlur}
          placeholder={PHONE_EXAMPLES[country]}
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
          style={[styles.phoneInput, highlighted && styles.fieldHighlighted]}
        />
      </View>

      {error ? <Text style={styles.fieldErrorText}>{error}</Text> : null}

      <Modal
        visible={isPickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerOpen(false)}
      >
        <Pressable style={styles.pickerOverlay} onPress={() => setPickerOpen(false)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <Text style={styles.pickerTitle}>{t.selectCountry}</Text>

            {countryOptions(language).map((option) => (
              <Pressable
                key={option.value}
                testID={testID ? `${testID}-country-${option.value}` : undefined}
                onPress={() => {
                  if (isCountryCode(option.value)) onCountryChange(option.value);
                  setPickerOpen(false);
                }}
                style={({ pressed }) => [styles.modalOption, pressed && { opacity: 0.7 }]}
              >
                <Text style={styles.modalOptionText}>
                  {COUNTRY_NAMES[option.value as CountryCode][language]}{" "}
                  ({dialCodeLabel(option.value as CountryCode)})
                </Text>
                {option.value === country && <Check size={18} color={PURPLE} />}
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
