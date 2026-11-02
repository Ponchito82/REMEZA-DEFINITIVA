import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { spacing } from "../../theme/spacing";
import VirtualCardArt from "./VirtualCardArt";
import type { VirtualCardColor } from "./VirtualCardArt";

type Props = {
  color: VirtualCardColor;
  title: string;
  subtitle: string;
  /** Duracion total de la animacion; al terminar llama a `onDone`. */
  duration?: number;
  onDone: () => void;
  testID?: string;
};

const CARD_WIDTH = 270;
const HALO = 340;

/**
 * Animacion de "creando tu tarjeta": halos que laten, la tarjeta que gira
 * hasta quedar de frente, un brillo que la barre y una barra de progreso.
 */
export default function CardGeneratingAnimation({
  color: _color,
  title,
  subtitle,
  duration = 2600,
  onDone,
  testID,
}: Props) {
  const pulse = useRef(new Animated.Value(0)).current;
  const enter = useRef(new Animated.Value(0)).current;
  const shine = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(pulse, {
        toValue: 1,
        duration: 1400,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    );
    loop.start();

    const sequence = Animated.parallel([
      Animated.timing(enter, {
        toValue: 1,
        duration: 1300,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(1100),
        Animated.timing(shine, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(progress, {
        toValue: 1,
        duration,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: false,
      }),
    ]);
    sequence.start();

    const timer = setTimeout(onDone, duration + 250);
    return () => {
      loop.stop();
      sequence.stop();
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const haloScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1.15] });
  const haloOpacity = pulse.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.5, 0.25, 0] });
  const rotateY = enter.interpolate({ inputRange: [0, 1], outputRange: ["-100deg", "0deg"] });
  const scale = enter.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] });
  const opacity = enter.interpolate({ inputRange: [0, 0.35, 1], outputRange: [0, 1, 1] });
  const shineX = shine.interpolate({ inputRange: [0, 1], outputRange: [-CARD_WIDTH, CARD_WIDTH * 1.4] });
  const shineOpacity = shine.interpolate({ inputRange: [0, 0.15, 0.85, 1], outputRange: [0, 1, 1, 0] });
  const barWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });

  return (
    <View testID={testID} style={styles.root}>
      <View style={styles.stage}>
        <Animated.View
          style={[styles.halo, { opacity: haloOpacity, transform: [{ scale: haloScale }] }]}
        />
        <Animated.View
          style={[
            styles.halo,
            styles.haloInner,
            { opacity: Animated.multiply(haloOpacity, 1.4), transform: [{ scale: haloScale }] },
          ]}
        />

        <Animated.View
          style={{
            opacity,
            transform: [{ perspective: 900 }, { rotateY }, { scale }],
          }}
        >
          <VirtualCardArt color="glass" width={CARD_WIDTH} />
          <View style={styles.shineClip} pointerEvents="none">
            <Animated.View
              style={[
                styles.shine,
                { opacity: shineOpacity, transform: [{ translateX: shineX }, { rotate: "18deg" }] },
              ]}
            />
          </View>
        </Animated.View>
      </View>

      <Text style={[typography.h2, styles.title]}>{title}</Text>
      <Text style={[typography.body, styles.subtitle]}>{subtitle}</Text>

      <View style={styles.track}>
        <Animated.View style={[styles.bar, { width: barWidth }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: spacing.xl },
  stage: { width: HALO, height: HALO, alignItems: "center", justifyContent: "center" },
  halo: {
    position: "absolute",
    width: HALO,
    height: HALO,
    borderRadius: HALO / 2,
    backgroundColor: "rgba(75,35,250,0.45)",
  },
  haloInner: {
    width: HALO * 0.72,
    height: HALO * 0.72,
    borderRadius: (HALO * 0.72) / 2,
    backgroundColor: "rgba(130,110,255,0.35)",
  },
  shineClip: { ...StyleSheet.absoluteFillObject, overflow: "hidden", borderRadius: CARD_WIDTH * (30 / 810) },
  shine: {
    position: "absolute",
    top: -40,
    bottom: -40,
    width: 60,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  title: { marginTop: spacing.xl, textAlign: "center" },
  subtitle: { marginTop: spacing.sm, textAlign: "center" },
  track: {
    marginTop: spacing.xxl,
    width: 220,
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    backgroundColor: colors.progressInactive,
  },
  bar: { height: 6, borderRadius: 3, backgroundColor: colors.primaryLight },
});
