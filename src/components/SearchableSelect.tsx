import React, { useMemo, useState } from "react";
import { View, Text, Pressable, Modal, ScrollView, TextInput } from "react-native";
import { ChevronDown, Check, Search } from "lucide-react-native";
import { styles } from "../theme/styles";
import { PURPLE } from "../theme/colors";

type Option = { label: string; value: string };

type Props = {
  label: string;
  value: string;
  options: Option[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyResultsText?: string;
  disabled?: boolean;
  disabledHint?: string;
  error?: string;
  highlighted?: boolean;
  onSelect: (value: string) => void;
  testID?: string;
};

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export default function SearchableSelect({
  label,
  value,
  options,
  placeholder,
  searchPlaceholder,
  emptyResultsText,
  disabled = false,
  disabledHint,
  error,
  highlighted = false,
  onSelect,
  testID,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selectedOption = options.find((option) => option.value === value);

  const filteredOptions = useMemo(() => {
    if (!query.trim()) return options;
    const needle = normalize(query.trim());
    return options.filter((option) => normalize(option.label).includes(needle));
  }, [options, query]);

  const open = () => {
    if (disabled) return;
    setQuery("");
    setIsOpen(true);
  };

  return (
    <View style={styles.formField}>
      {label ? <Text style={styles.formLabel}>{label}</Text> : null}

      <Pressable
        onPress={open}
        disabled={disabled}
        testID={testID}
        accessibilityState={{ disabled }}
        style={({ pressed }) => [
          styles.selectField,
          disabled && styles.selectFieldDisabled,
          highlighted && styles.fieldHighlighted,
          pressed && !disabled && { opacity: 0.85 },
        ]}
      >
        <Text
          style={
            selectedOption
              ? styles.selectFieldText
              : disabled
                ? styles.selectFieldDisabledText
                : styles.selectFieldPlaceholder
          }
          numberOfLines={1}
        >
          {selectedOption ? selectedOption.label : placeholder || label}
        </Text>
        <ChevronDown size={18} color={disabled ? "#D1D5DB" : "#9CA3AF"} />
      </Pressable>

      {disabled && disabledHint ? (
        <Text style={styles.fieldHintText}>{disabledHint}</Text>
      ) : null}

      {error ? <Text style={styles.fieldErrorText}>{error}</Text> : null}

      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)}>
        <Pressable style={styles.pickerOverlay} onPress={() => setIsOpen(false)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <Text style={styles.pickerTitle}>{label || placeholder}</Text>

            <View style={styles.searchRow}>
              <Search size={16} color="#9CA3AF" />
              <TextInput
                testID={testID ? `${testID}-search` : undefined}
                value={query}
                onChangeText={setQuery}
                placeholder={searchPlaceholder}
                placeholderTextColor="#9CA3AF"
                autoCorrect={false}
                style={styles.searchInput}
              />
            </View>

            <ScrollView
              style={styles.modalScroll}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {filteredOptions.length === 0 ? (
                <Text
                  testID={testID ? `${testID}-empty` : undefined}
                  style={styles.emptyResultsText}
                >
                  {emptyResultsText}
                </Text>
              ) : (
                filteredOptions.map((option) => (
                  <Pressable
                    key={option.value}
                    testID={testID ? `${testID}-option-${option.value}` : undefined}
                    onPress={() => {
                      onSelect(option.value);
                      setIsOpen(false);
                    }}
                    style={({ pressed }) => [styles.modalOption, pressed && { opacity: 0.7 }]}
                  >
                    <Text style={styles.modalOptionText}>{option.label}</Text>
                    {option.value === value && <Check size={18} color={PURPLE} />}
                  </Pressable>
                ))
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
