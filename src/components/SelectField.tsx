import React, { useState } from "react";
import { View, Text, Pressable, Modal, ScrollView } from "react-native";
import { ChevronDown, Check } from "lucide-react-native";
import { styles } from "../theme/styles";
import { PURPLE } from "../theme/colors";

type Option = { label: string; value: string };

type Props = {
  label: string;
  value: string;
  options: Option[];
  placeholder?: string;
  onSelect: (value: string) => void;
  testID?: string;
};

export default function SelectField({ label, value, options, placeholder, onSelect, testID }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  return (
    <View style={styles.formField}>
      {label ? <Text style={styles.formLabel}>{label}</Text> : null}

      <Pressable
        onPress={() => setIsOpen(true)}
        testID={testID}
        style={({ pressed }) => [styles.selectField, pressed && { opacity: 0.85 }]}
      >
        <Text style={selectedOption ? styles.selectFieldText : styles.selectFieldPlaceholder}>
          {selectedOption ? selectedOption.label : placeholder || label}
        </Text>
        <ChevronDown size={18} color="#9CA3AF" />
      </Pressable>

      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)}>
        <Pressable style={styles.pickerOverlay} onPress={() => setIsOpen(false)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <Text style={styles.pickerTitle}>{label || placeholder}</Text>
            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {options.map((option) => (
                <Pressable
                  key={option.value}
                  onPress={() => {
                    onSelect(option.value);
                    setIsOpen(false);
                  }}
                  style={({ pressed }) => [styles.modalOption, pressed && { opacity: 0.7 }]}
                >
                  <Text style={styles.modalOptionText}>{option.label}</Text>
                  {option.value === value && <Check size={18} color={PURPLE} />}
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
