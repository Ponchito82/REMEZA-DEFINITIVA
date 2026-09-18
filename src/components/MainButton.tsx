import React from "react";
import { Pressable, Text } from "react-native";
import { styles } from "../theme/styles";

type Props = {
  onPress: () => void;
  children: React.ReactNode;
  style?: object;
  textStyle?: object;
  disabled?: boolean;
  testID?: string;
};

export default function MainButton({ onPress, children, style, textStyle, disabled, testID }: Props) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.mainButton,
        pressed && styles.mainButtonPressed,
        disabled && { opacity: 0.6 },
        style,
      ]}
    >
      <Text style={[styles.mainButtonText, textStyle]}>{children}</Text>
    </Pressable>
  );
}