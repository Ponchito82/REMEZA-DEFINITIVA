import React from "react";
import { StyleSheet, Text, View } from "react-native";
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
 * Comprobante de una operacion. Es lo que se ve en pantalla y, tal cual, lo
 * que se comparte: `captureRef` lo convierte en imagen, asi que todo va con
 * superficies solidas (el vidrio translucido sale distinto sobre otro fondo).
 * La estructura sigue a los comprobantes bancarios: marca, tipo de operacion,
 * importe grande y tarjetas de datos.
 */
const ReceiptCard = React.forwardRef<View, Props>(function ReceiptCard(
  { data, title, statusLabel, footer, testID },
  ref,
) {
  return (
    // `collapsable={false}`: sin el, Android puede aplanar la vista y no hay
    // nada que capturar.
    <View ref={ref} collapsable={false} testID={testID} style={styles.root}>
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
        <Text style={styles.brand}>Remeza</Text>
        <View style={styles.status}>
          <CircleCheck size={14} color={tokens.successText} strokeWidth={2} />
          <Text style={styles.statusText}>{statusLabel}</Text>
        </View>
      </View>

      <Text style={styles.title}>{title}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>{data.operationLabel}</Text>
        <Text style={styles.value}>{data.operation}</Text>
      </View>

      <Text style={styles.date}>{data.dateText}</Text>

      <Text style={styles.amountLabel}>{data.amountLabel}</Text>
      <View style={styles.amountRow}>
        <Text style={styles.amount} numberOfLines={1} adjustsFontSizeToFit>
          {`$ ${data.amount}`}
        </Text>
        <Text style={styles.currency}>{data.currency}</Text>
      </View>

      {data.groups.map((rows, index) => (
        <View key={index} style={styles.card}>
          {rows.map((row, rowIndex) => (
            <View key={row.label} style={rowIndex > 0 ? styles.rowGap : undefined}>
              <Text style={styles.label}>{row.label}</Text>
              <Text style={styles.value}>{row.value}</Text>
            </View>
          ))}
        </View>
      ))}

      <View style={styles.divider} />
      <Text style={styles.footer}>{footer}</Text>
    </View>
  );
});

export default ReceiptCard;

const CARD_SURFACE = "#141236";

const styles = StyleSheet.create({
  root: {
    width: "100%",
    borderRadius: 24,
    padding: spacing.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: tokens.glassBorderStrong,
    backgroundColor: colors.bg.base,
    gap: spacing.md,
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
  },
  status: {
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
