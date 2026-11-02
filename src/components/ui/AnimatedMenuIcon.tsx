import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { Menu } from "lucide-react-native";
import { colors } from "../../theme/colors";

type Props = {
  /** Estado `pressed` del Pressable que lo contiene. */
  pressed: boolean;
};

/** Icono del menu lateral: al presionarlo se encoge y gira un poco, y vuelve con un resorte. */
export default function AnimatedMenuIcon({ pressed }: Props) {
  const value = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(value, {
      toValue: pressed ? 1 : 0,
      speed: 24,
      bounciness: pressed ? 0 : 12,
      useNativeDriver: true,
    }).start();
  }, [pressed, value]);

  return (
    <Animated.View
      style={{
        transform: [
          { scale: value.interpolate({ inputRange: [0, 1], outputRange: [1, 0.78] }) },
          { rotate: value.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "90deg"] }) },
        ],
      }}
    >
      <Menu size={22} color={colors.text.primary} strokeWidth={2} />
    </Animated.View>
  );
}
