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
/** Version mas oscura para distinguir la tarjeta virtual de la fisica a simple vista. */
const CARD_BG_VIRTUAL = "#1B1B4D";
/** Contorno/resplandor blanco: refuerza que la virtual es la tarjeta distinta. */
const CARD_GLOW_VIRTUAL = "#FFFFFF";
const INK = "#FFFFFF";
const LABEL_INK = "rgba(255,255,255,0.62)";

/** Lado del boton de copiar, en dp (no escala con la tarjeta: es un area tactil) */
const COPY_SIZE = 22;
const COPY_ICON = 13;

/** Donde arranca el isotipo "R": ningun dato debe pasar de aqui. */
const GLYPH_LEFT = 1145;
const GLYPH_GAP = 40;
const LEFT_MARGIN = 96;
const CONTENT_MAX_WIDTH = GLYPH_LEFT - LEFT_MARGIN - GLYPH_GAP;
/** Columna derecha del bloque inferior (Vencimiento | CVC), sin tocar el isotipo. */
const RIGHT_COL_LEFT = 610;
const RIGHT_COL_MAX_WIDTH = GLYPH_LEFT - RIGHT_COL_LEFT - GLYPH_GAP;

/**
 * Filas de datos, repartidas para que la columna quede centrada en la tarjeta
 * (sin hueco grande arriba ni abajo) y el bloque Numero + Vencimiento/CVC
 * caiga a la altura del isotipo "R" (GLYPH_TOP..GLYPH_TOP+315).
 */
const NAME_LABEL_TOP = 95;
const NAME_TOP = 137;
const NUMBER_LABEL_TOP = 218;
const NUMBER_TOP = 260;
const BOTTOM_LABEL_TOP = 475;
const BOTTOM_TOP = 519;
/** Grupo VIRTUAL + "R" + remeza: la "R" alineada con la etiqueta del Numero. */
const GLYPH_TOP = NUMBER_LABEL_TOP;

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
  /** Fisica (por defecto) o virtual: cambia el color de fondo y la etiqueta sobre el isotipo */
  variant?: "physical" | "virtual";
  onCopyNumber?: () => void;
  copyTestID?: string;
  onCopyCvv?: () => void;
  copyCvvTestID?: string;
  /** Refs de los iconos de copiar, para enmarcarlos en la guia. */
  copyRef?: (node: any) => void;
  copyCvvRef?: (node: any) => void;
  /** Corre todo el contenido hacia abajo (unidades del arte), p. ej. sin controles abajo. */
  offsetY?: number;
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
  variant = "physical",
  offsetY = 0,
  onCopyNumber,
  copyTestID,
  onCopyCvv,
  copyCvvTestID,
  copyRef,
  copyCvvRef,
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
  const isVirtual = variant === "virtual";
  const bg = isVirtual ? CARD_BG_VIRTUAL : CARD_BG;
  const border = isVirtual ? CARD_GLOW_VIRTUAL : CARD_BORDER;
  const glow = isVirtual ? CARD_GLOW_VIRTUAL : bg;
  const variantLabel = isVirtual ? t.virtual : t.physical;

  return (
    <View
      testID={testID}
      onLayout={handleLayout}
      style={[
        styles.root,
        {
          backgroundColor: bg,
          borderColor: border,
          shadowColor: glow,
          borderRadius: 70 * s,
          borderWidth: 13 * s,
        },
        style,
      ]}
    >
      {trimmedName ? (
        <>
          <Text
            style={[
              styles.label,
              { left: LEFT_MARGIN * s, top: (NAME_LABEL_TOP + offsetY) * s, fontSize: 36 * s, lineHeight: 42 * s },
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
                top: (NAME_TOP + offsetY) * s,
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
          { left: LEFT_MARGIN * s, top: (NUMBER_LABEL_TOP + offsetY) * s, fontSize: 36 * s, lineHeight: 42 * s },
        ]}
      >
        {t.cardNumberLabel}
      </Text>

      <View style={[styles.row, { left: LEFT_MARGIN * s, top: (NUMBER_TOP + offsetY) * s, maxWidth: CONTENT_MAX_WIDTH * s, gap: 12 * s }]}>
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
            ref={copyRef}
            collapsable={false}
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
          { left: LEFT_MARGIN * s, top: (BOTTOM_LABEL_TOP + offsetY) * s, fontSize: 36 * s, lineHeight: 42 * s },
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
            top: (BOTTOM_TOP + offsetY) * s,
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
          { left: RIGHT_COL_LEFT * s, top: (BOTTOM_LABEL_TOP + offsetY) * s, fontSize: 36 * s, lineHeight: 42 * s },
        ]}
      >
        {t.cardCvvLabel}
      </Text>
      <View
        style={[
          styles.row,
          { left: RIGHT_COL_LEFT * s, top: (BOTTOM_TOP + offsetY) * s, maxWidth: RIGHT_COL_MAX_WIDTH * s, gap: 12 * s },
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
            ref={copyCvvRef}
            collapsable={false}
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

      {/* Etiqueta fisica/virtual: encima del isotipo, sin tocarlo ni moverlo. */}
      <Text
        numberOfLines={1}
        style={[
          styles.label,
          styles.variantLabel,
          {
            left: GLYPH_LEFT * s,
            top: (GLYPH_TOP - 113 + offsetY) * s,
            width: glyphWidth,
            fontSize: 42 * s,
            lineHeight: 48 * s,
            letterSpacing: 2 * s,
          },
        ]}
      >
        {variantLabel}
      </Text>

      {/* Isotipo: arranca a la altura de la fila del Numero. */}
      <View style={[styles.glyph, { left: GLYPH_LEFT * s, top: (GLYPH_TOP + offsetY) * s }]}>
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
            top: (GLYPH_TOP + 324 + offsetY) * s,
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
    overflow: "hidden",
    elevation: 10,
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
  variantLabel: {
    textAlign: "center",
    textTransform: "uppercase",
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

export { ART_W, ART_H, CARD_BG, CARD_BG_VIRTUAL, CARD_GLOW_VIRTUAL };
