import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, LayoutChangeEvent, StyleSheet, View, StyleProp, ViewStyle } from "react-native";
import { House, Truck } from "lucide-react-native";
import { tokens } from "../../theme/colors";
import { colorGlow } from "../../theme/shadows";

type Props = {
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const HEIGHT = 112;
const TRUCK = 44;
const HOUSE = 34;
const DASH = 14;
const GAP = 12;
const ROAD_Y = 74;
/** Cuanto dura un viaje completo del camion hasta la casa */
const TRIP_MS = 3800;

/**
 * Camion de entrega: recorre la carretera hasta la casa mientras las rayas
 * del camino corren en sentido contrario. Se usa en "Entrega en proceso" de la
 * tarjeta fisica. Todo corre con el driver nativo.
 */
export default function DeliveryAnimation({ style, testID }: Props) {
  const [width, setWidth] = useState(0);
  const trip = useRef(new Animated.Value(0)).current;
  const road = useRef(new Animated.Value(0)).current;
  const bounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const tripLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(trip, {
          toValue: 1,
          duration: TRIP_MS,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        // Pausa breve frente a la casa antes de volver a salir
        Animated.delay(500),
        Animated.timing(trip, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    );
    const roadLoop = Animated.loop(
      Animated.timing(road, {
        toValue: 1,
        duration: 700,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    const bounceLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, { toValue: 1, duration: 260, useNativeDriver: true }),
        Animated.timing(bounce, { toValue: 0, duration: 260, useNativeDriver: true }),
      ]),
    );

    tripLoop.start();
    roadLoop.start();
    bounceLoop.start();
    return () => {
      tripLoop.stop();
      roadLoop.stop();
      bounceLoop.stop();
    };
  }, [trip, road, bounce]);

  const onLayout = (event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width);

  const travel = Math.max(width - HOUSE - TRUCK - 16, 0);
  const truckX = trip.interpolate({ inputRange: [0, 1], outputRange: [8, 8 + travel] });
  const truckY = bounce.interpolate({ inputRange: [0, 1], outputRange: [0, -2.5] });
  const roadX = road.interpolate({ inputRange: [0, 1], outputRange: [0, -(DASH + GAP)] });
  const dashCount = Math.ceil(width / (DASH + GAP)) + 2;

  return (
    <View testID={testID} onLayout={onLayout} style={[styles.root, style]}>
      <View style={styles.roadClip}>
        <Animated.View style={[styles.dashes, { transform: [{ translateX: roadX }] }]}>
          {Array.from({ length: dashCount }).map((_, index) => (
            <View key={index} style={styles.dash} />
          ))}
        </Animated.View>
      </View>

      <View style={styles.houseWrap}>
        <House size={HOUSE} color={tokens.iconAccent} strokeWidth={1.75} />
      </View>

      <Animated.View
        style={[styles.truck, { transform: [{ translateX: truckX }, { translateY: truckY }] }]}
      >
        <Truck size={TRUCK} color={tokens.textPrimary} strokeWidth={1.75} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    height: HEIGHT,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: tokens.glassBorderStrong,
    backgroundColor: tokens.glassSurface,
    overflow: "hidden",
    ...colorGlow(tokens.violet, 0.25, 16),
  },
  roadClip: {
    position: "absolute",
    left: 0,
    right: 0,
    top: ROAD_Y,
    height: 3,
    overflow: "hidden",
  },
  dashes: {
    flexDirection: "row",
    gap: GAP,
  },
  dash: {
    width: DASH,
    height: 3,
    borderRadius: 2,
    backgroundColor: tokens.violetBright,
    opacity: 0.7,
  },
  houseWrap: {
    position: "absolute",
    right: 14,
    top: ROAD_Y - HOUSE - 2,
  },
  truck: {
    position: "absolute",
    left: 0,
    top: ROAD_Y - TRUCK + 4,
  },
});
