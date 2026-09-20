import React from "react";
import { View, Image, StyleSheet, useWindowDimensions, StatusBar } from "react-native";
import Svg, { Defs, Ellipse, LinearGradient, RadialGradient, Rect, Stop } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { palette } from "../../theme/designSystem";

type Glow = {
  /** Centro relativo al ancho (0 = borde izquierdo, 1 = borde derecho) */
  x: number;
  /** Centro relativo al alto */
  y: number;
  /** Radio relativo al ancho de pantalla (mismo radio en x e y: circulo real) */
  r: number;
  color: string;
  opacity: number;
};

/**
 * Iluminacion violeta en los extremos: tres focos por costado, con el
 * centro justo sobre el borde para que solo se vea la mitad interior del
 * halo. Radios en proporcion al ancho (iguales en x e y) para que cada
 * foco sea un circulo real y no una elipse distorsionada por el viewBox.
 */
const GLOWS: Glow[] = [
  // Costado izquierdo
  { x: -0.02, y: 0.08, r: 0.33, color: palette.violet, opacity: 0.78 },
  { x: -0.04, y: 0.45, r: 0.35, color: palette.violet, opacity: 0.85 },
  { x: -0.02, y: 0.8, r: 0.31, color: palette.purple, opacity: 0.72 },
  // Costado derecho
  { x: 1.02, y: 0.12, r: 0.33, color: palette.violetBright, opacity: 0.72 },
  { x: 1.04, y: 0.51, r: 0.35, color: palette.violet, opacity: 0.85 },
  { x: 1.02, y: 0.86, r: 0.31, color: palette.violet, opacity: 0.7 },
];

/**
 * Caida del halo. Varios tramos en vez de dos: suaviza el degradado y
 * evita el "banding" (las franjas que se ven como pixelado en Android).
 */
const FALLOFF: { offset: string; alpha: number }[] = [
  { offset: "0", alpha: 1 },
  { offset: "0.22", alpha: 0.74 },
  { offset: "0.42", alpha: 0.44 },
  { offset: "0.62", alpha: 0.22 },
  { offset: "0.82", alpha: 0.07 },
  { offset: "1", alpha: 0 },
];

type Props = {
  children?: React.ReactNode;
  /** Centro vertical de la marca de agua, relativo al alto de pantalla */
  watermarkTop?: number;
  /** Ancho de la marca de agua, relativo al ancho de pantalla */
  watermarkScale?: number;
  /** Oculta la "R" de fondo */
  showWatermark?: boolean;
};

export default function ScreenBackground({
  children,
  watermarkTop = 0.3,
  watermarkScale = 0.78,
  showWatermark = true,
}: Props) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const markSize = width * watermarkScale;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <Svg
        style={StyleSheet.absoluteFill}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
      >
        {/*
          El viewBox usa las mismas unidades que width/height (en vez de un
          lienzo fijo de 100x100 estirado de forma no uniforme). Eso evita
          que Android rasterice los degradados radiales a baja resolucion y
          los reescale, que es lo que los volvia borrosos/pixelados.
        */}
        <Defs>
          <LinearGradient id="remezaBase" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={palette.navy} />
            <Stop offset="0.38" stopColor={palette.background} />
            <Stop offset="0.72" stopColor="#060927" />
            <Stop offset="1" stopColor={palette.navy} />
          </LinearGradient>

          {GLOWS.map((item, index) => (
            <RadialGradient key={index} id={"remezaGlow" + index} cx="50%" cy="50%" r="50%">
              {FALLOFF.map((stop) => (
                <Stop
                  key={stop.offset}
                  offset={stop.offset}
                  stopColor={item.color}
                  stopOpacity={item.opacity * stop.alpha}
                />
              ))}
            </RadialGradient>
          ))}

          {/* Vineta central: conserva el nucleo casi negro del diseno */}
          <RadialGradient id="remezaCore" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={palette.background} stopOpacity="0.92" />
            <Stop offset="0.45" stopColor={palette.background} stopOpacity="0.78" />
            <Stop offset="0.72" stopColor={palette.background} stopOpacity="0.4" />
            <Stop offset="0.9" stopColor={palette.background} stopOpacity="0.12" />
            <Stop offset="1" stopColor={palette.background} stopOpacity="0" />
          </RadialGradient>
        </Defs>

        <Rect x="0" y="0" width={width} height={height} fill="url(#remezaBase)" />

        {GLOWS.map((item, index) => (
          <Ellipse
            key={index}
            cx={item.x * width}
            cy={item.y * height}
            rx={item.r * width}
            ry={item.r * width}
            fill={"url(#remezaGlow" + index + ")"}
          />
        ))}

        {/* Nucleo oscuro: mantiene el centro profundo y empuja la luz a los extremos */}
        <Ellipse
          cx={width * 0.5}
          cy={height * 0.5}
          rx={width * 0.56}
          ry={height * 0.46}
          fill="url(#remezaCore)"
        />
      </Svg>

      {showWatermark ? (
        <Image
          source={require("../../assets/remeza_logo.png")}
          resizeMode="contain"
          style={[
            styles.watermark,
            {
              width: markSize,
              height: markSize,
              left: (width - markSize) / 2,
              top: height * watermarkTop - markSize / 2,
            },
          ]}
        />
      ) : null}

      <View
        style={[
          styles.content,
          { paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 12) },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.background,
  },
  watermark: {
    position: "absolute",
    pointerEvents: "none",
    tintColor: "#4A3AA8",
    opacity: 0.22,
  },
  content: {
    flex: 1,
  },
});
