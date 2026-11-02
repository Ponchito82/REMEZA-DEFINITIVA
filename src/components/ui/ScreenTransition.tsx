import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet } from "react-native";

type Props = {
  /** Cambia con la pantalla: cada cambio dispara la transicion. */
  viewKey: string;
  /** Ademas del fundido, sube la pantalla unos dp. Apagarlo si algo mide posiciones (guia). */
  slide?: boolean;
  children: React.ReactNode;
};

/**
 * Transicion leve entre pantallas: fundido de entrada y un pequeno
 * desplazamiento hacia arriba. No remonta nada: solo anima el contenedor.
 */
export default function ScreenTransition({ viewKey, slide = true, children }: Props) {
  const progress = useRef(new Animated.Value(1)).current;
  const lastKey = useRef(viewKey);

  useEffect(() => {
    if (lastKey.current === viewKey) return;
    lastKey.current = viewKey;

    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [viewKey, progress]);

  return (
    <Animated.View
      style={[
        styles.root,
        {
          opacity: progress,
          transform: slide
            ? [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }]
            : [],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
