import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, ViewStyle } from "react-native";
import { ChevronDown } from "lucide-react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { radius, sizes } from "../../theme/radius";
import { spacing } from "../../theme/spacing";
import FieldLabel from "./FieldLabel";
import OptionSheet, { SheetOption } from "./OptionSheet";
import type { IconComponent } from "./GlassInput";

type Props = {
  label?: string;
  placeholder: string;
  value?: string;
  options: SheetOption[];
  onSelect: (value: string) => void;
  leftIcon?: IconComponent;
  /** Icono de la insignia de la hoja. Por defecto, el mismo que `leftIcon`. */
  sheetIcon?: IconComponent;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  /** Resalta el borde: lo usa `useFormFocus` al saltar al campo que falta */
  highlighted?: boolean;
  /** Titulo de la hoja inferior. Por defecto usa el `label`. */
  sheetTitle?: string;
  emptyText?: string;
  style?: ViewStyle;
  testID?: string;
  accessibilityLabel?: string;
};

/** Campo de seleccion: se ve como un `TextField` y abre una hoja inferior. */
export default function SelectField({
  label,
  placeholder,
  value,
  options,
  onSelect,
  leftIcon: LeftIcon,
  sheetIcon,
  helperText,
  error,
  disabled = false,
  highlighted = false,
  sheetTitle,
  emptyText,
  style,
  testID,
  accessibilityLabel,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const selected = options.find((option) => option.value === value);
  const helper = error ?? helperText;

  return (
    <View style={style}>
      {label ? <FieldLabel>{label}</FieldLabel> : null}

      <Pressable
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label ?? placeholder}
        accessibilityState={{ disabled, expanded: isOpen }}
        onPress={() => setIsOpen(true)}
        disabled={disabled}
        style={({ pressed }) => [
          styles.field,
          highlighted && styles.fieldHighlighted,
          !!error && styles.fieldError,
          disabled && styles.fieldDisabled,
          pressed && !disabled && styles.pressed,
        ]}
      >
        {LeftIcon ? (
          <View style={styles.iconCircle}>
            <LeftIcon size={18} color={colors.primaryLight} strokeWidth={2} />
          </View>
        ) : null}

        <Text
          style={[
            styles.value,
            selected ? typography.bodyStrong : typography.input,
            !selected && styles.placeholder,
          ]}
          numberOfLines={1}
        >
          {selected?.label ?? placeholder}
        </Text>

        <ChevronDown
          size={18}
          color={disabled ? colors.text.placeholder : colors.text.secondary}
          strokeWidth={2}
        />
      </Pressable>

      {helper ? (
        <Text
          testID={testID ? `${testID}-helperText` : undefined}
          style={[typography.caption, styles.helper, !!error && styles.helperError]}
        >
          {helper}
        </Text>
      ) : null}

      <OptionSheet
        visible={isOpen}
        onClose={() => setIsOpen(false)}
        title={sheetTitle ?? label ?? placeholder}
        icon={sheetIcon ?? LeftIcon}
        options={options}
        value={value}
        onSelect={(next) => {
          onSelect(next);
          setIsOpen(false);
        }}
        emptyText={emptyText}
        testID={testID}
      />
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
  helper: {
    marginTop: spacing.sm,
  },
  helperError: {
    color: colors.danger,
  },
  pressed: {
    opacity: 0.75,
  },
});
