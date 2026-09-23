import React, { useMemo, useState } from "react";
import { View, Text, Pressable, TextInput, StyleSheet } from "react-native";
import { ChevronDown, Search } from "lucide-react-native";
import OptionSheet from "./ui/OptionSheet";
import FieldLabel from "./ui/FieldLabel";
import type { IconComponent } from "./ui/GlassInput";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
import { radius, sizes } from "../theme/radius";
import { spacing } from "../theme/spacing";

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
  /** Insignia de la hoja inferior */
  icon?: IconComponent;
  /** Icono dentro del campo. Solo lo usan las pantallas que lo piden. */
  fieldIcon?: IconComponent;
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
  fieldIcon: FieldIcon,
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
    <View>
      {label ? <FieldLabel>{label}</FieldLabel> : null}

      <Pressable
        onPress={open}
        disabled={disabled}
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={label || placeholder}
        accessibilityState={{ disabled, expanded: isOpen }}
        style={({ pressed }) => [
          styles.field,
          highlighted && styles.fieldHighlighted,
          !!error && styles.fieldError,
          disabled && styles.fieldDisabled,
          pressed && !disabled && styles.pressed,
        ]}
      >
        {FieldIcon ? (
          <View style={styles.iconCircle}>
            <FieldIcon size={18} color={colors.primaryLight} strokeWidth={2} />
          </View>
        ) : null}

        <Text
          style={[
            styles.value,
            selectedOption ? typography.bodyStrong : typography.input,
            !selectedOption && styles.placeholder,
          ]}
          numberOfLines={1}
        >
          {selectedOption ? selectedOption.label : placeholder || label}
        </Text>

        <ChevronDown
          size={18}
          color={disabled ? colors.text.placeholder : colors.text.secondary}
        />
      </Pressable>

      {disabled && disabledHint ? (
        <Text style={[typography.caption, styles.hint]}>{disabledHint}</Text>
      ) : null}

      {error ? (
        <Text style={[typography.caption, styles.hint, styles.hintError]}>{error}</Text>
      ) : null}

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
          <Search size={16} color={colors.text.placeholder} />
          <TextInput
            testID={testID ? `${testID}-search` : undefined}
            value={query}
            onChangeText={setQuery}
            placeholder={searchPlaceholder}
            placeholderTextColor={colors.text.placeholder}
            autoCorrect={false}
            style={[typography.input, styles.searchInput]}
          />
        </View>
      </OptionSheet>
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
    paddingRight: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  fieldHighlighted: {
    borderColor: colors.primary,
  },
  fieldError: {
    borderColor: colors.danger,
  },
  fieldDisabled: {
    borderColor: colors.borderSubtle,
  },
  iconCircle: {
    width: sizes.inputIcon,
    height: sizes.inputIcon,
    borderRadius: sizes.inputIcon / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceStrong,
  },
  value: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  placeholder: {
    color: colors.text.placeholder,
  },
  hint: {
    marginTop: spacing.sm,
  },
  hintError: {
    color: colors.danger,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    height: sizes.input,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginBottom: spacing.lg,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    paddingVertical: 0,
  },
  pressed: {
    opacity: 0.85,
  },
});
