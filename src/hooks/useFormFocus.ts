import { useCallback, useRef, useState } from "react";
import { ScrollView, TextInput, View } from "react-native";

export type FieldCheck = {
  key: string;
  valid: boolean;
  message: string;
};

type AnchorMap = Record<string, View | null>;
type InputMap = Record<string, TextInput | null>;

export function useFormFocus() {
  const scrollRef = useRef<ScrollView | null>(null);
  const contentRef = useRef<View | null>(null);
  const anchors = useRef<AnchorMap>({});
  const inputs = useRef<InputMap>({});
  const anchorSetters = useRef<Record<string, (node: View | null) => void>>({});
  const inputSetters = useRef<Record<string, (node: TextInput | null) => void>>({});

  const [pendingField, setPendingField] = useState<string | null>(null);
  const [pendingMessage, setPendingMessage] = useState("");

  const anchor = useCallback((key: string) => {
    if (!anchorSetters.current[key]) {
      anchorSetters.current[key] = (node: View | null) => {
        anchors.current[key] = node;
      };
    }
    return anchorSetters.current[key];
  }, []);

  const input = useCallback((key: string) => {
    if (!inputSetters.current[key]) {
      inputSetters.current[key] = (node: TextInput | null) => {
        inputs.current[key] = node;
      };
    }
    return inputSetters.current[key];
  }, []);

  const focusField = useCallback((key: string) => {
    const anchorNode = anchors.current[key];
    const contentNode = contentRef.current;

    if (anchorNode && contentNode) {
      anchorNode.measureLayout(
        contentNode,
        (_x, y) => {
          scrollRef.current?.scrollTo({ y: Math.max(y - 24, 0), animated: true });
        },
        () => {},
      );
    }

    setTimeout(() => inputs.current[key]?.focus(), 250);
  }, []);

  const validate = useCallback(
    (checks: FieldCheck[]): boolean => {
      const firstInvalid = checks.find((check) => !check.valid);

      if (!firstInvalid) {
        setPendingField(null);
        setPendingMessage("");
        return true;
      }

      setPendingField(firstInvalid.key);
      setPendingMessage(firstInvalid.message);
      focusField(firstInvalid.key);
      return false;
    },
    [focusField],
  );

  const clear = useCallback(() => {
    setPendingField(null);
    setPendingMessage("");
  }, []);

  return {
    scrollRef,
    contentRef,
    anchor,
    input,
    validate,
    focusField,
    clear,
    pendingField,
    pendingMessage,
  };
}
