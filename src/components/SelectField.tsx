import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { ChevronDown } from "lucide-react-native";
import { styles } from "../theme/styles";
import OptionSheet from "./ui/OptionSheet";
import type { IconComponent } from "./ui/GlassInput";

type Option = { label: string; value: string };

type Props = {
  label: string;
  value: string;
  options: Option[];
  placeholder?: string;
  /** Titulo de la hoja inferior. Si falta, usa `label` y luego `placeholder`. */
  title?: string;
  icon?: IconComponent;
  highlighted?: boolean;
  onSelect: (value: string) => void;
  testID?: string;
};

export default function SelectField({
  label,
  value,
  options,
  placeholder,
  title,
  icon,
  highlighted = false,
  onSelect,
  testID,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  return (
    <View style={styles.formField}>
      {label ? <Text style={styles.formLabel}>{label}</Text> : null}

      <Pressable
        onPress={() => setIsOpen(true)}
        testID={testID}
        style={({ pressed }) => [
          styles.selectField,
          highlighted && styles.fieldHighlighted,
          pressed && { opacity: 0.85 },
        ]}
      >
        <Text style={selectedOption ? styles.selectFieldText : styles.selectFieldPlaceholder}>
          {selectedOption ? selectedOption.label : placeholder || label}
        </Text>
        <ChevronDown size={18} color="#9CA3AF" />
      </Pressable>

      <OptionSheet
        visible={isOpen}
        onClose={() => setIsOpen(false)}
        title={title || label || placeholder || ""}
        icon={icon}
        options={options}
        value={value}
        onSelect={(next) => {
          onSelect(next);
          setIsOpen(false);
        }}
        testID={testID}
      />
    </View>
  );
}
