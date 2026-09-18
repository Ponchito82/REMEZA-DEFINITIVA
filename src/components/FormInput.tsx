import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { styles } from "../theme/styles";

type Props = {
  label: string;
  placeholder?: string;
  keyboardType?: "default" | "email-address" | "number-pad" | "phone-pad";
  defaultValue?: string;
  secureTextEntry?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
  maxLength?: number;
  error?: string;
  secureToggle?: boolean;
  onBlur?: () => void;
  testID?: string;
  inputRef?: (node: TextInput | null) => void;
  highlighted?: boolean;
};

export default function FormInput({
  label,
  placeholder,
  keyboardType = "default",
  defaultValue = "",
  secureTextEntry = false,
  value,
  onChangeText,
  maxLength,
  error,
  secureToggle = false,
  onBlur,
  testID,
  inputRef,
  highlighted = false,
}: Props) {
  const [isRevealed, setIsRevealed] = useState(false);
  const isMasked = secureToggle ? !isRevealed : secureTextEntry;

  return (
    <View style={styles.formField}>
      <Text style={styles.formLabel}>{label}</Text>

      <View style={secureToggle ? styles.passcodeFieldWrap : undefined}>
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          defaultValue={defaultValue}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          keyboardType={keyboardType}
          secureTextEntry={isMasked}
          maxLength={maxLength}
          onBlur={onBlur}
          testID={testID}
          style={[
            styles.formInput,
            secureToggle && { paddingRight: 44 },
            highlighted && styles.fieldHighlighted,
          ]}
        />

        {secureToggle && (
          <Pressable
            onPress={() => setIsRevealed((prev) => !prev)}
            style={styles.eyeToggle}
            hitSlop={8}
          >
            {isRevealed ? (
              <EyeOff size={18} color="#9CA3AF" />
            ) : (
              <Eye size={18} color="#9CA3AF" />
            )}
          </Pressable>
        )}
      </View>

      {error ? <Text style={styles.fieldErrorText}>{error}</Text> : null}
    </View>
  );
}
