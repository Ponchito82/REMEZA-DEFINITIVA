import React, { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, StyleSheet } from "react-native";
import { tokens } from "../../theme/colors";

type Props = {
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  testID?: string;
  accessibilityLabel?: string;
};

const TRACK_W = 52;
const TRACK_H = 30;
const THUMB = 24;
const TRAVEL = TRACK_W - THUMB - (TRACK_H - THUMB);

/** Interruptor del diseno: pista de 52x30 y pulgar blanco de 24, 180 ms. */
export default function Toggle({ value, onChange, disabled = false, testID, accessibilityLabel }: Props) {
  const progress = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: value ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [value, progress]);

  const translateX = progress.interpolate({ inputRange: [0, 1], outputRange: [0, TRAVEL] });

  return (
    <Pressable
      testID={testID}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value, disabled }}
      onPress={() => onChange(!value)}
      disabled={disabled}
      hitSlop={6}
      style={[
        styles.track,
        value ? styles.trackOn : styles.trackOff,
        disabled && styles.trackDisabled,
      ]}
    >
      <Animated.View
        style={[
          styles.thumb,
          disabled && styles.thumbDisabled,
          { transform: [{ translateX }] },
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: TRACK_W,
    height: TRACK_H,
    borderRadius: TRACK_H / 2,
    padding: (TRACK_H - THUMB) / 2,
    justifyContent: "center",
  },
  trackOn: {
    backgroundColor: tokens.violet,
  },
  trackOff: {
    backgroundColor: tokens.indigoDeep,
    borderWidth: 1,
    borderColor: tokens.glassBorder,
  },
  trackDisabled: {
    backgroundColor: tokens.indigoDeep,
  },
  thumb: {
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    backgroundColor: tokens.textPrimary,
  },
  thumbDisabled: {
    backgroundColor: tokens.textDisabled,
  },
});
