import React from "react";
import { TextInput } from "react-native";
import TextField from "./ui/TextField";
import type { IconComponent } from "./ui/GlassInput";

type Props = {
  label: string;
  placeholder?: string;
  /**
   * Opcional a proposito: las pantallas de direccion y beneficiario llevan
   * icono, y la de Informacion Personal no.
   */
  leftIcon?: IconComponent;
  keyboardType?: "default" | "email-address" | "number-pad" | "phone-pad";
  secureTextEntry?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
  maxLength?: number;
  error?: string;
  /** Campo enmascarado con ojo para revelarlo */
  secureToggle?: boolean;
  onBlur?: () => void;
  testID?: string;
  inputRef?: (node: TextInput | null) => void;
  highlighted?: boolean;
};

/**
 * Campo de formulario de las pantallas internas. Es una fachada sobre
 * `TextField`: se conserva porque lo importan una docena de pantallas, pero
 * todo el aspecto lo pone ya el componente nuevo.
 *
 * Los formularios del PDF no llevan icono a la izquierda, asi que aqui no se
 * expone `leftIcon`.
 */
export default function FormInput({
  label,
  placeholder,
  leftIcon,
  keyboardType = "default",
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
  return (
    <TextField
      label={label || undefined}
      placeholder={placeholder}
      leftIcon={leftIcon}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      secureTextEntry={secureToggle || secureTextEntry}
      maxLength={maxLength}
      error={error || undefined}
      onBlur={onBlur}
      testID={testID}
      inputRef={inputRef}
      highlighted={highlighted}
    />
  );
}
