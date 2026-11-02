import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Check, Eye, EyeOff, Pencil, Power, ShieldOff } from "lucide-react-native";

import { colors } from "../theme/colors";
import { fontFamily, typography } from "../theme/typography";
import { spacing } from "../theme/spacing";
import { Button, GlassCard, ScreenHeader, Toggle } from "../components/ui";
import ScreenLayout from "../components/ui/ScreenLayout";
import { VirtualCardArt } from "../components/remeza";
import { groupedNumber, maskedNumber } from "./MyCardsView";
import type { GeneratedCard } from "./MyCardsView";

type Props = {
  t: any;
  card: GeneratedCard;
  onBack: () => void;
  /** Abre "Fondear saldo". */
  onFund: () => void;
  /** Apagar / encender la tarjeta y cambiar su limite de gasto. */
  onUpdate: (patch: Partial<Pick<GeneratedCard, "isOff" | "spendLimit">>) => void;
};

/** Ancho de la tarjeta en el detalle: pequena para dar prioridad a los movimientos. */
const ART_WIDTH = 220;

const money = (value: number) =>
  `${value < 0 ? "-" : "+"}$${Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (ms: number) => {
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};

/** Datos y movimientos de una tarjeta virtual generada: solo los de esa tarjeta. */
export default function MyCardDetailView({ t, card, onBack, onFund, onUpdate }: Props) {
  const [showData, setShowData] = useState(true);
  const [editingLimit, setEditingLimit] = useState(false);
  const [limitDraft, setLimitDraft] = useState("");

  const saveLimit = () => {
    const value = Number(limitDraft);
    if (value > 0) onUpdate({ spendLimit: Number(value.toFixed(2)) });
    setEditingLimit(false);
  };

  return (
    <ScreenLayout
      showBack
      onBack={onBack}
      backTestID="myCardDetail-backButton"
      backAccessibilityLabel={t.back}
      testID="myCardDetail"
    >
      <ScreenHeader title={card.name} subtitle={maskedNumber(card.last4)} style={styles.header} />

      <View style={styles.art}>
        <VirtualCardArt color={card.color} width={ART_WIDTH} />
        {card.isOff ? (
          <View style={styles.offOverlay} pointerEvents="none" testID="myCardDetail-offOverlay">
            <ShieldOff size={28} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.offText}>{card.needsFunding ? t.myCardsNeedsFunding : t.myCardsOffLabel}</Text>
          </View>
        ) : null}
      </View>

      <GlassCard size="lg" style={styles.panel}>
        <Text style={typography.h2}>{t.myCardsMovements}</Text>

        {card.movements.length === 0 ? (
          <Text testID="myCardDetail-empty" style={typography.caption}>
            {t.myCardsNoMovements}
          </Text>
        ) : (
          card.movements.map((m) => (
            <View key={m.id} style={styles.row} testID={`myCardDetail-movement-${m.id}`}>
              <View style={styles.text}>
                <Text style={typography.bodyStrong}>{m.label}</Text>
                <Text style={typography.caption}>{formatDate(m.date)}</Text>
              </View>
              <Text style={[typography.bodyStrong, m.amount > 0 && styles.credit]}>
                {money(m.amount)}
              </Text>
            </View>
          ))
        )}
      </GlassCard>

      <GlassCard size="lg" style={[styles.panel, styles.dataPanel]}>
        <View style={styles.dataHeader}>
          <Text style={typography.h2}>{t.myCardsDataTitle}</Text>
          <Pressable
            testID="myCardDetail-toggleData"
            accessibilityRole="button"
            accessibilityLabel={showData ? t.myCardsHideData : t.myCardsShowData}
            onPress={() => setShowData((v) => !v)}
            hitSlop={8}
            style={styles.toggle}
          >
            {showData ? (
              <EyeOff size={18} color={colors.primaryLight} />
            ) : (
              <Eye size={18} color={colors.primaryLight} />
            )}
            <Text style={styles.toggleText}>{showData ? t.myCardsHideData : t.myCardsShowData}</Text>
          </Pressable>
        </View>

        <View style={styles.field}>
          <Text style={typography.caption}>{t.myCardsNumber}</Text>
          <Text testID="myCardDetail-number" style={styles.number}>
            {showData ? groupedNumber(card.number) : maskedNumber(card.last4)}
          </Text>
        </View>

        <View style={styles.pair}>
          <View style={styles.field}>
            <Text style={typography.caption}>{t.myCardsExpiry}</Text>
            <Text testID="myCardDetail-expiry" style={styles.value}>
              {showData ? card.expiry : "••/••"}
            </Text>
          </View>
          <View style={styles.field}>
            <Text style={typography.caption}>{t.myCardsCvv}</Text>
            <Text testID="myCardDetail-cvv" style={styles.value}>
              {showData ? card.cvv : "•••"}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.powerBox}>
            <Power size={22} color={colors.primaryLight} strokeWidth={2.2} />
            <Text style={styles.powerText} numberOfLines={1}>
              {t.myCardsTurnOff}
            </Text>
            <Toggle
              testID="myCardDetail-offToggle"
              accessibilityLabel={t.myCardsTurnOff}
              value={card.isOff}
              onChange={(value) => {
                // Apagada por saldo insuficiente: solo vuelve a encenderse fondeandola.
                if (card.needsFunding || (!value && card.amount <= 0)) return;
                onUpdate({ isOff: value });
              }}
            />
          </View>
        </View>

        <View style={styles.limitRow}>
          <Text style={styles.limitLabel}>{t.myCardsSpendLimit}</Text>
          <View style={[styles.limitField, editingLimit && styles.limitFieldEditing]}>
            <Text style={styles.limitSymbol}>$</Text>
            <TextInput
              testID="myCardDetail-limitInput"
              value={editingLimit ? limitDraft : card.spendLimit.toFixed(2)}
              editable={editingLimit}
              onChangeText={(text) => {
                const clean = text.replace(/[^0-9.]/g, "");
                const [whole, ...rest] = clean.split(".");
                setLimitDraft(rest.length ? `${whole}.${rest.join("").slice(0, 2)}` : whole);
              }}
              keyboardType="decimal-pad"
              onSubmitEditing={saveLimit}
              selectionColor={colors.primaryLight}
              style={styles.limitInput}
            />
            <Pressable
              testID={editingLimit ? "myCardDetail-saveLimit" : "myCardDetail-editLimit"}
              accessibilityRole="button"
              accessibilityLabel={editingLimit ? t.myCardsSaveName : t.myCardsEditLimit}
              onPress={
                editingLimit
                  ? saveLimit
                  : () => {
                      setLimitDraft(String(card.spendLimit));
                      setEditingLimit(true);
                    }
              }
              hitSlop={8}
            >
              {editingLimit ? (
                <Check size={20} color={colors.primaryLight} strokeWidth={2.4} />
              ) : (
                <Pencil size={18} color={colors.primaryLight} strokeWidth={2.2} />
              )}
            </Pressable>
          </View>
        </View>
      </GlassCard>

      <Button testID="myCardDetail-fundButton" title={t.moveBalanceTitle} onPress={onFund} style={styles.fund} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: spacing.lg },
  fund: { marginBottom: spacing.xl },
  art: { alignItems: "center", justifyContent: "center", marginBottom: spacing.lg },
  offOverlay: {
    position: "absolute",
    width: ART_WIDTH,
    aspectRatio: 810 / 509,
    borderRadius: ART_WIDTH * 0.045,
    backgroundColor: "rgba(12,12,14,0.72)",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  offText: { fontFamily: fontFamily.bold, fontSize: 11, textAlign: "center", letterSpacing: 0.5, color: "#FFFFFF" },
  divider: { width: 1, alignSelf: "stretch", backgroundColor: "rgba(130,110,255,0.35)" },
  powerBox: { flex: 1, flexDirection: "row", alignItems: "center", gap: spacing.sm },
  powerText: { flex: 1, ...typography.caption, color: colors.primaryLight },
  limitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: "rgba(130,110,255,0.25)",
  },
  limitLabel: { ...typography.caption, color: colors.primaryLight, fontSize: 15 },
  limitField: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    height: 40,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(130,110,255,0.45)",
  },
  limitFieldEditing: { borderColor: colors.primaryLight, borderWidth: 1.5 },
  limitSymbol: { fontFamily: fontFamily.regular, fontSize: 16, color: colors.primaryLight },
  limitInput: {
    flex: 1,
    fontFamily: fontFamily.semibold,
    fontSize: 16,
    color: colors.text.primary,
    paddingVertical: 0,
  },
  dataPanel: { gap: spacing.md },
  panel: { backgroundColor: colors.sheetSurface, gap: spacing.lg, marginBottom: spacing.xl },
  dataHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  toggle: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  toggleText: { ...typography.caption, color: colors.primaryLight },
  field: { gap: spacing.xs },
  pair: { flexDirection: "row", alignItems: "center", gap: spacing.xl },
  number: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    letterSpacing: 1,
    color: colors.text.primary,
  },
  value: { fontFamily: fontFamily.bold, fontSize: 16, color: colors.text.primary },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm },
  text: { flex: 1, gap: 2 },
  credit: { color: "#4ADE80" },
});
