import React, { useMemo, useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { ChevronDown, Search } from "lucide-react-native";
import { styles } from "../theme/styles";
import OptionSheet from "./ui/OptionSheet";
import type { IconComponent } from "./ui/GlassInput";

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
  icon?: IconComponent;
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
  icon,
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

      <OptionSheet
        visible={isOpen}
        onClose={() => setIsOpen(false)}
        title={label || placeholder || ""}
        icon={icon}
        options={filteredOptions}
        value={value}
        emptyText={emptyResultsText}
        onSelect={(next) => {
          onSelect(next);
          setIsOpen(false);
        }}
        testID={testID}
      >
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
      </OptionSheet>
    </View>
  );
}
