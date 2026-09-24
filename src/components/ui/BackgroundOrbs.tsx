import React, { useState } from "react";
import { StyleSheet, View, PixelRatio, LayoutChangeEvent, useWindowDimensions } from "react-native";
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  Pattern,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";
import { colors } from "../../theme/colors";
import { remezaGlyph } from "./remezaGlyph";

type Orb = {
  /** Centro relativo al ancho. 0 y 1 dejan media esfera fuera de pantalla. */
  x: number;
  /** Centro relativo al alto */
  y: number;
  /** Radio relativo al ancho */
  r: number;
  /** Opacidad en el centro */
  alpha: number;
  color: string;
};

/** Las cuatro esferas del diseno, cortadas por los bordes de la pantalla. */
const ORBS: Orb[] = [
  { x: 1, y: 0.1, r: 0.72, alpha: 0.3, color: colors.bg.glow },
  { x: 0, y: 0.16, r: 0.66, alpha: 0.18, color: colors.bg.glow },
  { x: 0, y: 0.78, r: 0.72, alpha: 0.2, color: colors.bg.glow },
  { x: 1, y: 0.74, r: 0.72, alpha: 0.14, color: colors.bg.glowPink },
];

/**
 * Caida de cada esfera. Los cinco puntos del diseno (0, 0.35, 0.6, 0.85, 1)
 * son los anclajes; entre ellos se interpolan mas paradas porque a 8 bits un
 * degradado de este tamano avanza un nivel cada ~15 px y el escalon se ve.
 */
const ANCHORS = [
  { at: 0, alpha: 1 },
  { at: 0.35, alpha: 0.55 },
  { at: 0.6, alpha: 0.26 },
  { at: 0.85, alpha: 0.06 },
  { at: 1, alpha: 0 },
];

function falloff(steps = 24) {
  return Array.from({ length: steps + 1 }, (_, index) => {
    const at = index / steps;
    let next = ANCHORS.findIndex((anchor) => anchor.at >= at);
    if (next <= 0) next = 1;
    const a = ANCHORS[next - 1];
    const b = ANCHORS[next];
    const t = (at - a.at) / (b.at - a.at);
    return { offset: at.toFixed(4), alpha: a.alpha + (b.alpha - a.alpha) * t };
  });
}

const FALLOFF = falloff();

/** Lado de la celda del tramado: un pixel fisico exacto, no un dp. */
const DITHER_CELL = 1 / PixelRatio.get();

/**
 * Matriz de Bayer 4x4: reparte el error de cuantizacion en 16 escalones de
 * sub-nivel, y con eso el borde de cada franja se deshace. Es un nivel sobre
 * 255, imperceptible de cerca, pero es la diferencia entre un degradado liso
 * y uno con bandas.
 */
const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

const DITHER_AMPLITUDE = 0.0045;

/** Centro vertical de la marca de agua, relativo al alto */
const WATERMARK_TOP = 0.3;
/** Alto de la marca de agua, relativo al alto de pantalla */
const WATERMARK_SIZE = 0.42;

/**
 * Lineas de luz de las esquinas inferiores (pantallas 31 en adelante del PDF).
 * Cada una es una curva suave que entra por el borde de abajo y se apaga hacia
 * arriba: el degradado va de blanco a violeta y a transparente a lo largo del
 * trazo, asi que no hace falta ningun desenfoque.
 */
function streakPaths(width: number, height: number) {
  const left = [
    { from: [-0.04, 0.99], ctrl: [0.1, 0.95], to: [0.24, 0.84] },
    { from: [-0.04, 0.94], ctrl: [0.05, 0.9], to: [0.15, 0.83] },
  ];
  return left.flatMap(({ from, ctrl, to }) => {
    const d = (mirror: boolean) => {
      const x = (v: number) => (mirror ? 1 - v : v) * width;
      const y = (v: number) => v * height;
      return `M${x(from[0])},${y(from[1])} Q${x(ctrl[0])},${y(ctrl[1])} ${x(to[0])},${y(to[1])}`;
    };
    return [
      { d: d(false), gradient: "streakLeft" },
      { d: d(true), gradient: "streakRight" },
    ];
  });
}

/**
 * Fondo de las pantallas de entrada: base plana, las cuatro esferas violetas
 * y la "R" de marca de agua, todo en **un solo Svg** por detras del contenido.
 *
 * Nada de imagenes ni de Views apilados: un PNG se pixela al estirarlo y las
 * capas con opacidad dibujan anillos.
 */
export default function BackgroundOrbs({
  watermark = true,
  streaks = false,
}: {
  watermark?: boolean;
  /** Lineas de luz diagonales en las esquinas inferiores */
  streaks?: boolean;
}) {
  const window = useWindowDimensions();

  /**
   * El lienzo se mide por layout y no con `useWindowDimensions`: esa devuelve
   * la ventana sin la barra de navegacion, mientras que la vista si pinta por
   * debajo, y las esferas de abajo se cortaban en seco en esa frontera.
   */
  const [canvas, setCanvas] = useState({ width: window.width, height: window.height });
  const { width, height } = canvas;

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width: nextWidth, height: nextHeight } = event.nativeEvent.layout;
    setCanvas((prev) =>
      prev.width === nextWidth && prev.height === nextHeight
        ? prev
        : { width: nextWidth, height: nextHeight },
    );
  };

  const markHeight = height * WATERMARK_SIZE;
  const markWidth = markHeight * (remezaGlyph.width / remezaGlyph.height);
  const markScale = markWidth / remezaGlyph.width;

  return (
    <View style={styles.root} pointerEvents="none" onLayout={handleLayout}>
      <Svg style={StyleSheet.absoluteFill} width={width} height={height}>
        <Defs>
          {ORBS.map((orb, index) => (
            <RadialGradient key={index} id={`orb${index}`} cx="50%" cy="50%" r="50%">
              {FALLOFF.map((stop) => (
                <Stop
                  key={stop.offset}
                  offset={stop.offset}
                  stopColor={orb.color}
                  stopOpacity={orb.alpha * stop.alpha}
                />
              ))}
            </RadialGradient>
          ))}

          {/* El degradado sigue el trazo: blanco en el borde de la pantalla,
              violeta a media curva y transparente al final. */}
          <LinearGradient id="streakLeft" x1="0" y1="1" x2="1" y2="0">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.55} />
            <Stop offset="0.45" stopColor="#7417FF" stopOpacity={0.45} />
            <Stop offset="1" stopColor="#7417FF" stopOpacity={0} />
          </LinearGradient>
          <LinearGradient id="streakRight" x1="1" y1="1" x2="0" y2="0">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.55} />
            <Stop offset="0.45" stopColor="#7417FF" stopOpacity={0.45} />
            <Stop offset="1" stopColor="#7417FF" stopOpacity={0} />
          </LinearGradient>

          <Pattern
            id="orbDither"
            x="0"
            y="0"
            width={DITHER_CELL * 4}
            height={DITHER_CELL * 4}
            patternUnits="userSpaceOnUse"
          >
            {BAYER_4X4.flatMap((row, y) =>
              row.map((level, x) => (
                <Rect
                  key={`${x}-${y}`}
                  x={x * DITHER_CELL}
                  y={y * DITHER_CELL}
                  width={DITHER_CELL}
                  height={DITHER_CELL}
                  fill="#FFFFFF"
                  fillOpacity={((level + 0.5) / 16) * DITHER_AMPLITUDE}
                />
              )),
            )}
          </Pattern>
        </Defs>

        {ORBS.map((orb, index) => (
          <Circle
            key={index}
            cx={orb.x * width}
            cy={orb.y * height}
            r={orb.r * width}
            fill={`url(#orb${index})`}
          />
        ))}

        {streaks
          ? streakPaths(width, height).map((streak, index) => (
              <Path
                key={index}
                d={streak.d}
                stroke={`url(#${streak.gradient})`}
                strokeWidth={1.5}
                strokeLinecap="round"
                fill="none"
              />
            ))
          : null}

        {/* Marca de agua: por encima de la luz y por debajo del contenido. */}
        {watermark ? (
          <G
            translateX={(width - markWidth) / 2}
            translateY={height * WATERMARK_TOP - markHeight / 2}
            scale={markScale}
          >
            <Path d={remezaGlyph.path} fill="#FFFFFF" fillOpacity={0.022} />
          </G>
        ) : null}

        <Rect x="0" y="0" width={width} height={height} fill="url(#orbDither)" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  /** Sin fondo propio: el degradado de `ScreenBackground` va por debajo. */
  root: {
    ...StyleSheet.absoluteFillObject,
  },
});
