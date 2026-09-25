import React, { useState } from "react";
import { Pressable, StyleSheet, TextInput, View, StyleProp, ViewStyle } from "react-native";
import { Send } from "lucide-react-native";
import { tokens } from "../../theme/colors";
import { fontFamily } from "../../theme/typography";
import { metrics } from "../../theme/radius";

type Props = {
  placeholder: string;
  onSend: (text: string) => void;
  sendAccessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const SEND = 40;

/** Caja para escribir un mensaje, con boton de enviar. */
export default function ChatComposer({
  placeholder,
  onSend,
  sendAccessibilityLabel = "Send",
  style,
  testID,
}: Props) {
  const [text, setText] = useState("");
  const canSend = text.trim().length > 0;

  const submit = () => {
    if (!canSend) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <View style={[styles.root, style]}>
      <TextInput
        testID={testID ? `${testID}-input` : undefined}
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        placeholderTextColor={tokens.textDisabled}
        selectionColor={tokens.violet}
        onSubmitEditing={submit}
        returnKeyType="send"
        style={styles.input}
      />
      <Pressable
        testID={testID ? `${testID}-sendButton` : undefined}
        accessibilityRole="button"
        accessibilityLabel={sendAccessibilityLabel}
        accessibilityState={{ disabled: !canSend }}
        disabled={!canSend}
        onPress={submit}
        style={[styles.send, !canSend && styles.sendDisabled]}
      >
        <Send size={20} color={canSend ? tokens.textPrimary : tokens.textDisabled} strokeWidth={1.75} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: metrics.inputHeight,
    paddingLeft: 16,
    paddingRight: 8,
    borderRadius: metrics.radius.input,
    borderWidth: 1,
    borderColor: tokens.glassBorder,
    backgroundColor: tokens.glassSurface,
  },
  input: {
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: 16,
    includeFontPadding: false,
    color: tokens.textPrimary,
    paddingVertical: 0,
  },
  send: {
    width: SEND,
    height: SEND,
    borderRadius: SEND / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.violet,
  },
  sendDisabled: {
    backgroundColor: tokens.indigoDeep,
  },
});
