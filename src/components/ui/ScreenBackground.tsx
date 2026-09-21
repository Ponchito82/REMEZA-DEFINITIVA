import React, { useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  useWindowDimensions,
  StatusBar,
  PixelRatio,
  LayoutChangeEvent,
} from "react-native";
import Svg, { Defs, Ellipse, G, LinearGradient, Path, Pattern, RadialGradient, Rect, Stop } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { palette } from "../../theme/designSystem";
import { remezaGlyph } from "./remezaGlyph";

type Light = {
  /** Centro relativo al ancho (0 = borde izquierdo, 1 = borde derecho) */
  x: number;
  /** Centro relativo al alto */
  y: number;
  /** Semieje horizontal, relativo al ancho */
  rx: number;
  /** Semieje vertical, relativo al alto */
  ry: number;
  color: string;
  alpha: number;
};

/**
 * Iluminacion ambiental de los costados. Son **elipses verticales** con el
 * centro fuera de pantalla, no circulos: un circulo de radio suficiente para
 * recorrer el costado se mete hasta el centro y lava el negro, que es lo que
 * sostiene todo el tema. Las esquinas de abajo son las mas cargadas.
 */
const LIGHTS: Light[] = [
  { x: -0.08, y: 0.22, rx: 0.67, ry: 0.33, color: palette.violet, alpha: 0.62 },
  { x: -0.1, y: 0.72, rx: 0.54, ry: 0.21, color: palette.purple, alpha: 0.35 },
  { x: -0.06, y: 0.99, rx: 0.71, ry: 0.31, color: palette.violetBright, alpha: 0.66 },
  { x: 1.08, y: 0.08, rx: 0.67, ry: 0.31, color: palette.violetBright, alpha: 0.5 },
  { x: 1.1, y: 0.42, rx: 0.58, ry: 0.28, color: palette.violet, alpha: 0.36 },
  { x: 1.06, y: 0.98, rx: 0.67, ry: 0.28, color: palette.violet, alpha: 0.58 },
];

/**
 * Sigma de la gaussiana, en fracciones del radio. A 0.28 el halo vale
 * `exp(-6.4)` al llegar al borde de la elipse: menos de un nivel de 255, o
 * sea por debajo de lo representable. Eso importa mas de lo que parece — si
 * el halo llega al borde con valor o pendiente apreciables, el contorno de la
 * elipse se dibuja como un anillo, y seis focos dejaban el fondo lleno de
 * circunferencias.
 */
const SIGMA = 0.28;

/** Lado de la celda del tramado: un pixel fisico exacto, no un dp. */
const DITHER_CELL = 1 / PixelRatio.get();

/**
 * Matriz de Bayer 4x4: reparte el error de cuantizacion en 16 escalones de
 * sub-nivel. Un damero de dos celdas solo desplaza el contorno medio nivel y
 * lo deja visible; esta lo difumina a lo ancho de cuatro pixeles.
 */
const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

/** Amplitud del tramado: un nivel de 255 repartido entre los 16 escalones. */
const DITHER_AMPLITUDE = 0.0045;

/** Caida gaussiana pura: sin recortar ni renormalizar, para no crear canto. */
function gaussianFalloff(steps: number) {
  return Array.from({ length: steps + 1 }, (_, index) => {
    const r = index / steps;
    return { offset: r.toFixed(4), alpha: Math.exp(-(r * r) / (2 * SIGMA * SIGMA)) };
  });
}

const FALLOFF = gaussianFalloff(24);

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
  watermarkTop = 0.34,
  watermarkScale = 0.8,
  showWatermark = true,
}: Props) {
  const window = useWindowDimensions();
  const insets = useSafeAreaInsets();

  /**
   * El lienzo se mide por layout, no con `useWindowDimensions`: esa devuelve
   * la ventana sin la barra de navegacion, mientras que la vista si pinta por
   * debajo, y el resplandor de abajo se cortaba en seco en esa frontera. Asi
   * el fondo cubre exactamente lo que ocupa el componente, lo envuelva quien
   * lo envuelva y a cualquier resolucion.
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

  const watermark = useMemo(() => {
    const markWidth = width * watermarkScale;
    const markHeight = markWidth * (remezaGlyph.height / remezaGlyph.width);
    return {
      scale: markWidth / remezaGlyph.width,
      left: (width - markWidth) / 2,
      top: height * watermarkTop - markHeight / 2,
    };
  }, [width, height, watermarkScale, watermarkTop]);

  return (
    <View style={styles.root} onLayout={handleLayout}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <Svg
        style={StyleSheet.absoluteFill}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
      >
        <Defs>
          <LinearGradient id="remezaBase" x1="0" y1="0" x2="0.3" y2="1">
            <Stop offset="0" stopColor={palette.navy} />
            <Stop offset="0.3" stopColor={palette.background} />
            <Stop offset="0.7" stopColor={palette.background} />
            <Stop offset="1" stopColor={palette.navy} />
          </LinearGradient>

          {LIGHTS.map((light, index) => (
            <RadialGradient key={index} id={`remezaLight${index}`} cx="50%" cy="50%" r="50%">
              {FALLOFF.map((stop) => (
                <Stop
                  key={stop.offset}
                  offset={stop.offset}
                  stopColor={light.color}
                  stopOpacity={light.alpha * stop.alpha}
                />
              ))}
            </RadialGradient>
          ))}

          {/*
            Marca de agua: la letra **entera**, rellena de indigo plano. Al ser
            un color fijo y no una transparencia, se lee clara sobre el negro
            del centro y oscura donde le da la luz de los costados, que es como
            se comporta en la referencia. Va por encima de la iluminacion y por
            debajo de los componentes: nunca sobre botones, campos ni textos.
          */}
          <LinearGradient id="remezaWatermark" x1="0.2" y1="0" x2="0.4" y2="1">
            <Stop offset="0" stopColor="#141152" stopOpacity="0.8" />
            <Stop offset="1" stopColor={palette.indigo} stopOpacity="0.55" />
          </LinearGradient>

          {/*
            Tramado ordenado: una rejilla de un pixel fisico que suma un nivel
            de 255 en la mitad de los pixeles. El degradado avanza tan despacio
            que cada nivel ocupa una franja ancha y el escalon se ve; con el
            tramado el borde de cada franja se deshace y desaparece el bandeado.
          */}
          <Pattern
            id="remezaDither"
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

          {/* Nucleo oscuro: hunde el centro y empuja la luz hacia los costados */}
          <RadialGradient id="remezaCore" cx="50%" cy="50%" r="50%">
            {FALLOFF.map((stop) => (
              <Stop
                key={stop.offset}
                offset={stop.offset}
                stopColor={palette.background}
                stopOpacity={0.9 * stop.alpha}
              />
            ))}
          </RadialGradient>
        </Defs>

        <Rect x="0" y="0" width={width} height={height} fill="url(#remezaBase)" />

        {LIGHTS.map((light, index) => (
          <Ellipse
            key={index}
            cx={light.x * width}
            cy={light.y * height}
            rx={light.rx * width}
            ry={light.ry * height}
            fill={`url(#remezaLight${index})`}
          />
        ))}

        <Ellipse
          cx={width * 0.5}
          cy={height * 0.5}
          rx={width * 0.58}
          ry={height * 0.46}
          fill="url(#remezaCore)"
        />

        {showWatermark ? (
          <G translateX={watermark.left} translateY={watermark.top} scale={watermark.scale}>
            <Path d={remezaGlyph.path} fill="url(#remezaWatermark)" />
          </G>
        ) : null}

        <Rect x="0" y="0" width={width} height={height} fill="url(#remezaDither)" />
      </Svg>

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
  content: {
    flex: 1,
  },
});
