import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
  useWindowDimensions,
  LayoutChangeEvent,
} from "react-native";
import Svg, { G, Path } from "react-native-svg";
import { Clipboard as ClipboardIcon } from "lucide-react-native";
import { fontFamily } from "../../theme/typography";
import { remezaGlyph } from "../ui/remezaGlyph";
import { screenPadding } from "../../theme/spacing";

/** Lienzo del arte nuevo (foto de referencia del reverso): todas las medidas salen de aqui. */
const ART_W = 1574;
const ART_H = 999;

/** Colores muestreados de la referencia; no son tokens de la app. */
const CARD_BG = "#3636B0";
const CARD_BORDER = "#07074A";
const INK = "#FFFFFF";
const LABEL_INK = "rgba(255,255,255,0.62)";

/** Lado del boton de copiar, en dp (no escala con la tarjeta: es un area tactil) */
const COPY_SIZE = 22;
const COPY_ICON = 13;

/** Donde arranca el isotipo "R": ningun dato debe pasar de aqui. El isotipo no se mueve. */
const GLYPH_LEFT = 1145;
const GLYPH_GAP = 40;
const LEFT_MARGIN = 96;
const CONTENT_MAX_WIDTH = GLYPH_LEFT - LEFT_MARGIN - GLYPH_GAP;
/** Columna derecha del bloque inferior (Vencimiento | CVC), sin tocar el isotipo. */
const RIGHT_COL_LEFT = 610;
const RIGHT_COL_MAX_WIDTH = GLYPH_LEFT - RIGHT_COL_LEFT - GLYPH_GAP;

type Props = {
  t: any;
  /** Nombre completo con el que se registro la cuenta. */
  holderName?: string;
  /** Numero completo con espacios. Solo se pinta con `showData`. */
  number: string;
  /** Ultimos 4 digitos, visibles con el numero oculto */
  last4: string;
  expiry: string;
  cvv: string;
  showData?: boolean;
  /** Tarjeta sin activar o bloqueada: se atenua encima del arte */
  dimmed?: boolean;
  onCopyNumber?: () => void;
  copyTestID?: string;
  onCopyCvv?: () => void;
  copyCvvTestID?: string;
  /** Capas encima del arte (p. ej. el aviso de tarjeta apagada) */
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  numberTestID?: string;
};

/**
 * Reverso de la tarjeta Remeza: cada dato lleva su etiqueta chica encima
 * (Nombre, Numero, Vencimiento, CVC), apilados a la izquierda igual que la
 * referencia. El isotipo "R" y "remeza" quedan fijos a la derecha, sin mover:
 * todo el bloque de datos tiene un ancho maximo que se detiene antes de el.
 * Las medidas estan en unidades del arte de 1574x999 y escalan con el ancho
 * real de la tarjeta.
 */
export default function RemezaCardBack({
  t,
  holderName,
  number,
  last4,
  expiry,
  cvv,
  showData = false,
  dimmed = false,
  onCopyNumber,
  copyTestID,
  onCopyCvv,
  copyCvvTestID,
  children,
  style,
  testID,
  numberTestID,
}: Props) {
  const window = useWindowDimensions();
  // Estimacion inicial (95% del carril del Home) para no parpadear antes del onLayout.
  const [width, setWidth] = useState((window.width - screenPadding * 2) * 0.95);
  const s = width / ART_W;

  const handleLayout = (event: LayoutChangeEvent) => {
    const next = event.nativeEvent.layout.width;
    if (next > 0 && Math.abs(next - width) > 0.5) setWidth(next);
  };

  const glyphHeight = 315 * s;
  const glyphWidth = glyphHeight * (remezaGlyph.width / remezaGlyph.height);
  const glyphScale = glyphWidth / remezaGlyph.width;

  const displayNumber = showData ? number : `•••• •••• •••• ${last4}`;
  const displayExpiry = showData ? expiry : "••/••";
  const displayCvv = showData ? cvv : "•••";
  const trimmedName = (holderName ?? "").trim();

  return (
    <View
      testID={testID}
      onLayout={handleLayout}
      style={[
        styles.root,
        { borderRadius: 70 * s, borderWidth: 13 * s },
        style,
      ]}
    >
      {trimmedName ? (
        <>
          <Text
            style={[
              styles.label,
              { left: LEFT_MARGIN * s, top: 100 * s, fontSize: 36 * s, lineHeight: 42 * s },
            ]}
          >
            {t.cardHolderLabel}
          </Text>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.6}
            style={[
              styles.ink,
              styles.absolute,
              {
                left: LEFT_MARGIN * s,
                top: 145 * s,
                width: CONTENT_MAX_WIDTH * s,
                fontFamily: fontFamily.bold,
                fontSize: 64 * s,
                lineHeight: 76 * s,
              },
            ]}
          >
            {trimmedName}
          </Text>
        </>
      ) : null}

      <Text
        style={[
          styles.label,
          { left: LEFT_MARGIN * s, top: 345 * s, fontSize: 36 * s, lineHeight: 42 * s },
        ]}
      >
        {t.cardNumberLabel}
      </Text>

      <View style={[styles.row, { left: LEFT_MARGIN * s, top: 390 * s, maxWidth: CONTENT_MAX_WIDTH * s, gap: 12 * s }]}>
        <Text
          testID={numberTestID}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
          style={[
            styles.ink,
            styles.shrink,
            {
              letterSpacing: 0.5 * s,
              fontFamily: fontFamily.bold,
              fontSize: 86 * s,
              lineHeight: 104 * s,
            },
          ]}
        >
          {displayNumber}
        </Text>

        {showData && onCopyNumber ? (
          <Pressable
            testID={copyTestID}
            accessibilityRole="button"
            onPress={onCopyNumber}
            hitSlop={4}
            style={styles.copy}
          >
            <ClipboardIcon size={COPY_ICON} color={INK} />
          </Pressable>
        ) : null}
      </View>

      {/* Vencimiento: abajo a la izquierda. */}
      <Text
        style={[
          styles.label,
          { left: LEFT_MARGIN * s, top: 620 * s, fontSize: 36 * s, lineHeight: 42 * s },
        ]}
      >
        {t.cardExpiryLabel}
      </Text>
      <Text
        numberOfLines={1}
        style={[
          styles.ink,
          styles.absolute,
          {
            left: LEFT_MARGIN * s,
            top: 665 * s,
            fontFamily: fontFamily.semibold,
            fontSize: 64 * s,
            lineHeight: 76 * s,
          },
        ]}
      >
        {displayExpiry}
      </Text>

      {/* CVC: misma fila, columna derecha, pero sin llegar al isotipo. */}
      <Text
        style={[
          styles.label,
          { left: RIGHT_COL_LEFT * s, top: 620 * s, fontSize: 36 * s, lineHeight: 42 * s },
        ]}
      >
        {t.cardCvvLabel}
      </Text>
      <View
        style={[
          styles.row,
          { left: RIGHT_COL_LEFT * s, top: 665 * s, maxWidth: RIGHT_COL_MAX_WIDTH * s, gap: 12 * s },
        ]}
      >
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
          style={[
            styles.ink,
            styles.shrink,
            {
              fontFamily: fontFamily.semibold,
              fontSize: 64 * s,
              lineHeight: 76 * s,
            },
          ]}
        >
          {displayCvv}
        </Text>

        {showData && onCopyCvv ? (
          <Pressable
            testID={copyCvvTestID}
            accessibilityRole="button"
            onPress={onCopyCvv}
            hitSlop={4}
            style={styles.copy}
          >
            <ClipboardIcon size={COPY_ICON} color={INK} />
          </Pressable>
        ) : null}
      </View>

      {/* Isotipo: no se mueve. */}
      <View style={[styles.glyph, { left: GLYPH_LEFT * s, top: 331 * s }]}>
        <Svg width={glyphWidth} height={glyphHeight}>
          <G scale={glyphScale}>
            <Path d={remezaGlyph.path} fill={INK} />
          </G>
        </Svg>
      </View>

      <Text
        style={[
          styles.ink,
          styles.absolute,
          {
            left: 1110 * s,
            top: 655 * s,
            fontFamily: fontFamily.medium,
            fontSize: 90 * s,
            lineHeight: 108 * s,
          },
        ]}
      >
        remeza
      </Text>

      {dimmed ? <View pointerEvents="none" style={styles.dim} /> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    aspectRatio: ART_W / ART_H,
    backgroundColor: CARD_BG,
    borderColor: CARD_BORDER,
    overflow: "hidden",
    elevation: 10,
    shadowColor: CARD_BG,
    shadowOpacity: 0.4,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 14 },
  },
  ink: {
    color: INK,
    includeFontPadding: false,
  },
  label: {
    position: "absolute",
    color: LABEL_INK,
    includeFontPadding: false,
    fontFamily: fontFamily.medium,
  },
  absolute: {
    position: "absolute",
  },
  row: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
  },
  shrink: {
    flexShrink: 1,
  },
  glyph: {
    position: "absolute",
  },
  copy: {
    width: COPY_SIZE,
    height: COPY_SIZE,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  dim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(2,2,26,0.55)",
  },
});

export { ART_W, ART_H };
