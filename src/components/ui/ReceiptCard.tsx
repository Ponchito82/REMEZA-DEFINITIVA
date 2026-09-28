import React, { useState } from "react";
import { PixelRatio, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { CircleCheck } from "lucide-react-native";
import { colors, tokens } from "../../theme/colors";
import { fontFamily, textStyles } from "../../theme/typography";
import { spacing } from "../../theme/spacing";
import LogoTile from "./LogoTile";

export type ReceiptRow = { label: string; value: string };

export type ReceiptData = {
  /** "Tipo de operacion" */
  operationLabel: string;
  operation: string;
  /** Fecha larga, ya formateada */
  dateText: string;
  /** "Importe" */
  amountLabel: string;
  /** Monto ya formateado, sin moneda: "800.00" */
  amount: string;
  currency: string;
  /** Cada grupo es una tarjeta con sus filas */
  groups: ReceiptRow[][];
};

type Props = {
  data: ReceiptData;
  /** "Comprobante de la operacion" */
  title: string;
  /** "Operacion exitosa" */
  statusLabel: string;
  footer: string;
  testID?: string;
};

/**
 * Ancho, en dp, al que se dibuja la copia que se convierte en imagen. Es fijo
 * a proposito: la imagen compartida sale igual en un telefono chico que en uno
 * grande, y no depende del ancho de la pantalla ni del tamano de letra.
 */
export const RECEIPT_CAPTURE_WIDTH = 360;

/** Ancho en pixeles de la imagen compartida, igual en todos los telefonos. */
export const RECEIPT_IMAGE_WIDTH = 1080;

/** Tope del comprobante en pantalla, para que no se estire en tablets. */
const RECEIPT_MAX_WIDTH = 480;

/** Debajo de este ancho de pantalla se aprieta el relleno de la tarjeta. */
const NARROW_SCREEN = 340;

type BodyProps = Props & {
  /** Copia de ancho fijo para capturar: sin escalar la letra del sistema. */
  fixed?: boolean;
};

const ReceiptBody = React.forwardRef<View, BodyProps>(function ReceiptBody(
  { data, title, statusLabel, footer, testID, fixed = false },
  ref,
) {
  const { width: screenWidth } = useWindowDimensions();
  const narrow = !fixed && screenWidth < NARROW_SCREEN;
  const scaling = !fixed;

  return (
    // `collapsable={false}`: sin el, Android puede aplanar la vista y no hay
    // nada que capturar.
    <View
      ref={ref}
      collapsable={false}
      testID={testID}
      style={[
        styles.root,
        fixed ? styles.fixed : styles.fluid,
        narrow && styles.rootNarrow,
      ]}
    >
      <LinearGradient
        colors={[colors.bg.deep, colors.bg.base]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Resplandor violeta de la esquina, como el fondo de la app */}
      <View pointerEvents="none" style={styles.glow} />

      <View style={styles.header}>
        <LogoTile size={44} radius={13} style={styles.logo} />
        <Text style={styles.brand} numberOfLines={1} allowFontScaling={scaling}>
          Remeza
        </Text>
        <View style={styles.status}>
          <CircleCheck size={14} color={tokens.successText} strokeWidth={2} />
          <Text style={styles.statusText} numberOfLines={1} allowFontScaling={scaling}>
            {statusLabel}
          </Text>
        </View>
      </View>

      <Text style={styles.title} allowFontScaling={scaling}>
        {title}
      </Text>

      <View style={styles.card}>
        <Text style={styles.label} allowFontScaling={scaling}>
          {data.operationLabel}
        </Text>
        <Text style={styles.value} allowFontScaling={scaling}>
          {data.operation}
        </Text>
      </View>

      <Text style={styles.date} allowFontScaling={scaling}>
        {data.dateText}
      </Text>

      <Text style={styles.amountLabel} allowFontScaling={scaling}>
        {data.amountLabel}
      </Text>
      <View style={styles.amountRow}>
        <Text
          style={styles.amount}
          numberOfLines={1}
          adjustsFontSizeToFit
          allowFontScaling={scaling}
        >
          {`$ ${data.amount}`}
        </Text>
        <Text style={styles.currency} allowFontScaling={scaling}>
          {data.currency}
        </Text>
      </View>

      {data.groups.map((rows, index) => (
        <View key={index} style={styles.card}>
          {rows.map((row, rowIndex) => (
            <View key={row.label} style={rowIndex > 0 ? styles.rowGap : undefined}>
              <Text style={styles.label} allowFontScaling={scaling}>
                {row.label}
              </Text>
              <Text style={styles.value} allowFontScaling={scaling}>
                {row.value}
              </Text>
            </View>
          ))}
        </View>
      ))}

      <View style={styles.divider} />
      <Text style={styles.footer} allowFontScaling={scaling}>
        {footer}
      </Text>
    </View>
  );
});

/**
 * Comprobante de una operacion. Se adapta al ancho de la pantalla, y lo que se
 * comparte no es esa vista sino una copia de ancho fijo, dibujada fuera de
 * pantalla: `captureRef` la convierte en imagen, asi que todo va con
 * superficies solidas (el vidrio translucido sale distinto sobre otro fondo).
 * El `ref` apunta a esa copia.
 *
 * La copia se maqueta a `RECEIPT_CAPTURE_WIDTH` dp y se amplia con un
 * `transform` hasta ocupar exactamente `RECEIPT_IMAGE_WIDTH` px en este
 * equipo. Asi el bitmap nativo ya sale a 1080 px y `captureRef` no tiene que
 * reescalarlo: un telefono de baja densidad (360 px de bitmap) ya no ampliaria
 * la imagen 3 veces y saldria borrosa, y uno de alta densidad no la reduciria.
 * La estructura sigue a los comprobantes bancarios: marca, tipo de operacion,
 * importe grande y tarjetas de datos.
 */
const ReceiptCard = React.forwardRef<View, Props>(function ReceiptCard(props, ref) {
  // dp que ocupan exactamente RECEIPT_IMAGE_WIDTH px en esta pantalla
  const captureDp = RECEIPT_IMAGE_WIDTH / PixelRatio.get();
  const zoom = captureDp / RECEIPT_CAPTURE_WIDTH;
  const [bodyHeight, setBodyHeight] = useState(0);

  return (
    <>
      <ReceiptBody {...props} />

      <View
        pointerEvents="none"
        style={[styles.offscreen, { width: captureDp }]}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        {/* `collapsable={false}`: es la vista que se captura */}
        <View
          ref={ref}
          collapsable={false}
          style={{ width: captureDp, height: bodyHeight * zoom, overflow: "hidden" }}
        >
          <View
            onLayout={(event) => setBodyHeight(event.nativeEvent.layout.height)}
            style={[styles.zoomed, { transform: [{ scale: zoom }] }]}
          >
            <ReceiptBody {...props} testID={undefined} fixed />
          </View>
        </View>
      </View>
    </>
  );
});

export default ReceiptCard;

const CARD_SURFACE = "#141236";

const styles = StyleSheet.create({
  root: {
    borderRadius: 24,
    padding: spacing.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: tokens.glassBorderStrong,
    backgroundColor: colors.bg.base,
    gap: spacing.md,
  },
  /** En pantalla: ocupa el ancho disponible, con tope en pantallas grandes. */
  fluid: {
    width: "100%",
    maxWidth: RECEIPT_MAX_WIDTH,
    alignSelf: "center",
  },
  /** La copia que se captura: siempre del mismo ancho. */
  fixed: {
    width: RECEIPT_CAPTURE_WIDTH,
  },
  rootNarrow: {
    padding: spacing.lg,
  },
  /** Fuera de la pantalla, pero dibujada, para poder capturarla. */
  offscreen: {
    position: "absolute",
    top: 0,
    left: -10000,
  },
  /** El comprobante a su tamano de diseno; el `transform` lo amplia desde la esquina. */
  zoomed: {
    position: "absolute",
    top: 0,
    left: 0,
    width: RECEIPT_CAPTURE_WIDTH,
    transformOrigin: "0% 0%",
  },
  glow: {
    position: "absolute",
    top: -90,
    right: -90,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(84,32,255,0.28)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  logo: {
    alignSelf: "flex-start",
  },
  brand: {
    ...textStyles.sectionTitle,
    flex: 1,
    flexShrink: 1,
  },
  status: {
    flexShrink: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(22,207,153,0.14)",
    borderWidth: 1,
    borderColor: "rgba(22,207,153,0.40)",
  },
  statusText: {
    flexShrink: 1,
    fontFamily: fontFamily.semibold,
    fontSize: 12,
    lineHeight: 16,
    color: tokens.successText,
    includeFontPadding: false,
  },
  title: {
    ...textStyles.rowTitle,
    fontSize: 17,
    marginTop: spacing.sm,
  },
  card: {
    padding: spacing.lg,
    borderRadius: 18,
    backgroundColor: CARD_SURFACE,
    borderWidth: 1,
    borderColor: tokens.glassBorder,
  },
  rowGap: {
    marginTop: spacing.lg,
  },
  label: {
    ...textStyles.rowSubtitle,
    marginBottom: 2,
  },
  value: {
    ...textStyles.rowTitle,
  },
  date: {
    ...textStyles.rowSubtitle,
    marginTop: spacing.xs,
  },
  amountLabel: {
    ...textStyles.rowSubtitle,
    marginTop: spacing.sm,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.sm,
  },
  amount: {
    fontFamily: fontFamily.bold,
    fontSize: 42,
    lineHeight: 50,
    color: tokens.textPrimary,
    includeFontPadding: false,
    flexShrink: 1,
  },
  currency: {
    fontFamily: fontFamily.semibold,
    fontSize: 16,
    lineHeight: 20,
    color: tokens.iconAccent,
    marginBottom: 10,
    includeFontPadding: false,
  },
  divider: {
    height: 1,
    backgroundColor: tokens.glassBorder,
    marginTop: spacing.sm,
  },
  footer: {
    ...textStyles.rowSubtitle,
    fontSize: 12,
    lineHeight: 16,
    textAlign: "center",
  },
});
