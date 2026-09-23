import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import Svg, { Circle, ClipPath, Defs, G, Rect } from "react-native-svg";
import { colors } from "../../theme/colors";
import Glow from "./Glow";

export type FlagCountry = "US" | "MX";

type Props = {
  country: FlagCountry;
  /** Diametro en dp */
  size?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * Bandera dibujada en SVG y recortada en circulo. Nada de PNG ni emoji: el
 * emoji no se pinta igual en todos los Android y el PNG se pixela al escalar.
 *
 * Para agregar un pais, basta con anadirlo a `FLAGS` con su viewBox de 60x60.
 */
const FLAGS: Record<FlagCountry, React.FC> = {
  US: () => (
    <>
      {Array.from({ length: 7 }, (_, index) => (
        <Rect
          key={index}
          x="0"
          y={index * (60 / 7)}
          width="60"
          height={60 / 7}
          fill={index % 2 === 0 ? "#B22234" : "#FFFFFF"}
        />
      ))}
      <Rect x="0" y="0" width="26" height={(60 / 7) * 4} fill="#3C3B6E" />
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => (
          <Circle
            key={`${row}-${col}`}
            cx={5 + col * 8}
            cy={5 + row * 8}
            r="1.6"
            fill="#FFFFFF"
          />
        )),
      )}
    </>
  ),
  MX: () => (
    <>
      <Rect x="0" y="0" width="20" height="60" fill="#006847" />
      <Rect x="20" y="0" width="20" height="60" fill="#FFFFFF" />
      <Rect x="40" y="0" width="20" height="60" fill="#CE1126" />
      <Circle cx="30" cy="30" r="7" fill="#8A6A2F" />
      <Circle cx="30" cy="30" r="3.5" fill="#C89B3C" />
    </>
  ),
};

export default function FlagIcon({ country, size = 52, style, testID }: Props) {
  const Flag = FLAGS[country];

  return (
    <Glow radius={10} opacity={0.3} corner={size / 2} style={style}>
      <View
        testID={testID}
        style={[
          styles.root,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 60 60">
          <Defs>
            <ClipPath id={`flagClip${country}`}>
              <Circle cx="30" cy="30" r="30" />
            </ClipPath>
          </Defs>
          <G clipPath={`url(#flagClip${country})`}>
            <Flag />
          </G>
        </Svg>
      </View>
    </Glow>
  );
}

const styles = StyleSheet.create({
  root: {
    borderWidth: 2,
    borderColor: colors.border,
    overflow: "hidden",
  },
});
