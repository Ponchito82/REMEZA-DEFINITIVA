import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import Button from "./ui/Button";

type Props = {
  onPress: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  testID?: string;
};

/**
 * CTA de las pantallas internas. Es una fachada sobre `Button`: se conserva
 * porque lo importan una docena de pantallas con la API de `children`, pero
 * todo el aspecto lo pone ya el componente nuevo.
 */
export default function MainButton({ onPress, children, style, disabled, testID }: Props) {
  return (
    <Button
      testID={testID}
      title={String(children ?? "")}
      onPress={onPress}
      disabled={disabled}
      style={style}
    />
  );
}
