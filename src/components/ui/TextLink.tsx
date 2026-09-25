import React from "react";
import { Pressable, StyleSheet, Text, View, StyleProp, ViewStyle } from "react-native";
import { tokens } from "../../theme/colors";
import { textStyles } from "../../theme/typography";

type Props = {
  title: string;
  onPress: () => void;
  /** Linea previa en gris ("¿Necesitas ayuda?") */
  prompt?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/** Enlace centrado, con una linea previa opcional. */
export default function TextLink({ title, onPress, prompt, disabled = false, style, testID }: Props) {
  return (
    <View style={[styles.root, style]}>
      {prompt ? <Text style={[textStyles.caption, styles.prompt]}>{prompt}</Text> : null}
      <Pressable
        testID={testID}
        accessibilityRole="link"
        accessibilityLabel={title}
        accessibilityState={{ disabled }}
        onPress={onPress}
        disabled={disabled}
        hitSlop={8}
      >
        {({ pressed }) => (
          <Text
            style={[
              textStyles.link,
              pressed && styles.pressed,
              disabled && styles.disabled,
            ]}
          >
            {title}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    gap: 4,
  },
  prompt: {
    textAlign: "center",
  },
  pressed: {
    color: tokens.iconAccent,
  },
  disabled: {
    color: tokens.textDisabled,
  },
});
