import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Check, Eye, Pencil, Wallet } from "lucide-react-native";

import { colors } from "../theme/colors";
import { fontFamily, typography } from "../theme/typography";
import { radius } from "../theme/radius";
import { spacing } from "../theme/spacing";
import { Button, RadioDot, ScreenHeader } from "../components/ui";
import ScreenLayout from "../components/ui/ScreenLayout";
import { VirtualCardArt } from "../components/remeza";
import type { VirtualCardArtColor, VirtualCardColor } from "../components/remeza";

export type CardMovement = {
  id: string;
  label: string;
  /** Positivo: abono; negativo: cargo. */
  amount: number;
  date: number;
};

export type GeneratedCard = {
  id: string;
  name: string;
  color: VirtualCardColor;
  /** Numero completo (16 digitos, sin espacios), vencimiento MM/AA y CVV. */
  number: string;
  last4: string;
  expiry: string;
  cvv: string;
  amount: number;
  createdAt: number;
  /** Tarjeta apagada: no se puede usar hasta volver a encenderla. */
  isOff: boolean;
  /** Se apago porque un cargo supero su saldo: hay que fondearla de nuevo para encenderla. */
  needsFunding?: boolean;
  /** Limite de gasto en USD. */
  spendLimit: number;
  /** Solo los movimientos de esta tarjeta. */
  movements: CardMovement[];
};

export const MAX_GENERATED_CARDS = 3;

const digits = (n: number) => Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join("");

/** Datos de una tarjeta virtual nueva (simulados mientras no haya API). */
export function generateCardData(now: number = Date.now()) {
  const number = `4${digits(15)}`;
  const d = new Date(now);
  const expiry = `${String(d.getMonth() + 1).padStart(2, "0")}/${String((d.getFullYear() + 4) % 100).padStart(
    2,
    "0",
  )}`;
  return { number, last4: number.slice(-4), expiry, cvv: digits(3) };
}

/**
 * Aplica un cargo a la tarjeta. Si supera el saldo, el cargo se rechaza: la
 * tarjeta queda en 0, se apaga y exige fondearse de nuevo.
 */
export function applyCardCharge(card: GeneratedCard, charge: number, label: string, now: number = Date.now()): GeneratedCard {
  if (card.isOff || charge <= 0) return card;
  if (charge > card.amount) return { ...card, isOff: true, needsFunding: true };
  return {
    ...card,
    amount: Number((card.amount - charge).toFixed(2)),
    movements: [{ id: `${now}-charge`, label, amount: -charge, date: now }, ...card.movements],
  };
}

export const groupedNumber = (number: string) => number.replace(/(.{4})(?=.)/g, "$1 ");

export const maskedNumber = (last4: string) => `•••• •••• •••• ${last4}`;

type Props = {
  t: any;
  cards: GeneratedCard[];
  availableUsdBalance: number;
  onBack: () => void;
  /** Boton "ver": abre el detalle (datos y movimientos) de una tarjeta generada. */
  onOpen: (id: string) => void;
  onRename: (id: string, name: string) => void;
  /** Mueve `amount` de la cuenta eje a la tarjeta `id`. */
  onMove: (id: string, amount: number) => void;
};

type Destination = {
  id: string;
  name: string;
  last4: string;
  color: VirtualCardArtColor;
};

const AMOUNTS = [50, 100, 200, 500];

const money = (value: number) =>
  `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

/**
 * "Mover saldo": envia dinero de la cuenta eje a una tarjeta. Solo capa visual,
 * aun no llama al API. Solo lista las tarjetas virtuales generadas.
 */
export default function MyCardsView({
  t,
  cards,
  availableUsdBalance,
  onBack,
  onOpen,
  onRename,
  onMove,
}: Props) {
  const [notice, setNotice] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const saveEdit = () => {
    const name = draft.trim();
    if (editingId && name) onRename(editingId, name);
    setEditingId(null);
  };

  const destinations: Destination[] = cards.map((c) => ({
    id: c.id,
    name: c.name,
    last4: c.last4,
    color: c.color,
  }));

  const [selectedId, setSelectedId] = useState(destinations[0]?.id ?? "");
  const [amount, setAmount] = useState("");
  const input = useRef<TextInput | null>(null);

  const value = Number(amount) || 0;
  const invalid = !selectedId || value <= 0 || value > availableUsdBalance;

  const handleContinue = () => {
    const target = destinations.find((d) => d.id === selectedId);
    if (!target || invalid) return;
    onMove(target.id, value);
    setAmount("");
  };

  return (
    <ScreenLayout
      showBack
      onBack={onBack}
      backTestID="myCards-backButton"
      backAccessibilityLabel={t.back}
      keyboard
      testID="myCards"
    >
      <ScreenHeader title={t.moveBalanceTitle} subtitle={t.moveBalanceSubtitle} style={styles.header} />

      <Text style={styles.section}>{t.moveBalanceFrom}</Text>
      <View style={styles.account}>
        <View style={styles.accountIcon}>
          <Wallet size={22} color={colors.primaryLight} strokeWidth={2} />
        </View>
        <View style={styles.accountText}>
          <Text style={typography.caption}>{t.moveBalanceAvailable}</Text>
          <Text style={styles.accountBalance}>{money(availableUsdBalance)}</Text>
        </View>
      </View>

      <Text style={styles.section}>{t.moveBalanceDestination}</Text>

      <View style={styles.list}>
        {destinations.map((d) => {
          const selected = d.id === selectedId;
          const editing = editingId === d.id;
          return (
            <Pressable
              key={d.id}
              testID={`myCards-card-${d.id}`}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => setSelectedId(d.id)}
              style={[styles.item, selected && styles.itemSelected]}
            >
              <RadioDot selected={selected} />
              <VirtualCardArt color={d.color} width={112} style={styles.thumb} />
              <View style={styles.info}>
                {editing ? (
                  <TextInput
                    testID={`myCards-nameInput-${d.id}`}
                    value={draft}
                    onChangeText={setDraft}
                    autoFocus
                    maxLength={24}
                    onSubmitEditing={saveEdit}
                    returnKeyType="done"
                    placeholderTextColor={colors.text.placeholder}
                    style={styles.nameInput}
                  />
                ) : (
                  <Text style={[typography.bodyStrong, styles.name]} numberOfLines={1}>
                    {d.name}
                  </Text>
                )}
                <Text style={styles.number} numberOfLines={1}>
                  {maskedNumber(d.last4)}
                </Text>
              </View>
              <View style={styles.actions}>
                <Pressable
                  testID={`myCards-details-${d.id}`}
                  accessibilityRole="button"
                  accessibilityLabel={t.myCardsDataTitle}
                  onPress={() => onOpen(d.id)}
                  hitSlop={8}
                  style={styles.iconButton}
                >
                  <Eye size={16} color={colors.primaryLight} strokeWidth={2.2} />
                </Pressable>
                <Pressable
                  testID={editing ? `myCards-saveName-${d.id}` : `myCards-editName-${d.id}`}
                  accessibilityRole="button"
                  accessibilityLabel={editing ? t.myCardsSaveName : t.myCardsEditName}
                  onPress={
                    editing
                      ? saveEdit
                      : () => {
                          setEditingId(d.id);
                          setDraft(d.name);
                        }
                  }
                  hitSlop={8}
                  style={styles.iconButton}
                >
                  {editing ? (
                    <Check size={18} color={colors.primaryLight} strokeWidth={2.4} />
                  ) : (
                    <Pencil size={16} color={colors.primaryLight} strokeWidth={2.2} />
                  )}
                </Pressable>
              </View>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.section}>{t.moveBalanceAmount}</Text>
      <Pressable onPress={() => input.current?.focus()} style={styles.amountField}>
        <Text style={styles.symbol}>$</Text>
        <TextInput
          ref={input}
          testID="myCards-amountInput"
          value={amount}
          onChangeText={(text) => {
            setNotice(null);
            const clean = text.replace(/[^0-9.]/g, "");
            const [whole, ...rest] = clean.split(".");
            setAmount(rest.length ? `${whole}.${rest.join("").slice(0, 2)}` : whole);
          }}
          placeholder="0.00"
          placeholderTextColor={colors.text.placeholder}
          keyboardType="decimal-pad"
          selectionColor={colors.primaryLight}
          style={styles.amountInput}
        />
        <View style={styles.amountBalance}>
          <Text style={typography.caption}>{t.moveBalanceAvailableColon}</Text>
          <Text style={styles.amountBalanceValue}>{money(availableUsdBalance)}</Text>
        </View>
      </Pressable>

      <View style={styles.quick}>
        {AMOUNTS.map((v) => (
          <Pressable
            key={v}
            testID={`myCards-amount-${v}`}
            accessibilityRole="button"
            onPress={() => setAmount(String(v))}
            style={styles.quickItem}
          >
            <Text style={styles.quickText}>${v}</Text>
          </Pressable>
        ))}
        <Pressable
          testID="myCards-amount-other"
          accessibilityRole="button"
          onPress={() => {
            setAmount("");
            input.current?.focus();
          }}
          style={styles.quickItem}
        >
          <Text style={[styles.quickText, styles.quickOther]}>{t.moveBalanceOther}</Text>
        </Pressable>
      </View>

      {notice ? (
        <Text testID="myCards-notice" style={styles.notice}>
          {notice}
        </Text>
      ) : null}

      <Button
        testID="myCards-continueButton"
        title={t.commonContinue}
        disabled={invalid}
        onPress={handleContinue}
        style={styles.cta}
      />
    </ScreenLayout>
  );
}

const BORDER = "rgba(130,110,255,0.28)";

const styles = StyleSheet.create({
  header: { marginBottom: spacing.lg },
  section: {
    ...typography.bodyStrong,
    fontSize: 17,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  account: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: colors.surface,
  },
  accountIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceStrong,
  },
  accountText: { flex: 1, gap: 2 },
  accountBalance: { ...typography.h2, fontFamily: fontFamily.bold },
  list: { gap: spacing.sm },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.sm,
    paddingLeft: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: colors.surface,
  },
  itemSelected: { borderColor: colors.primaryLight, borderWidth: 2 },
  thumb: { elevation: 0, shadowOpacity: 0 },
  info: { flex: 1, gap: spacing.xs },
  name: { fontSize: 17 },
  number: {
    ...typography.body,
    fontSize: 15,
    color: colors.primaryLight,
    letterSpacing: 0.5,
  },
  nameInput: {
    height: 40,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    color: colors.text.primary,
    fontFamily: fontFamily.semibold,
    fontSize: 15,
  },
  actions: { flexDirection: "row", gap: spacing.sm },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceStrong,
  },
  amountField: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    height: 72,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: colors.surface,
  },
  symbol: {
    fontFamily: fontFamily.regular,
    fontSize: 24,
    color: colors.text.primary,
  },
  amountInput: {
    flex: 1,
    fontFamily: fontFamily.semibold,
    fontSize: 32,
    color: colors.text.primary,
    paddingVertical: 0,
  },
  amountBalance: { alignItems: "flex-end" },
  amountBalanceValue: { ...typography.bodyStrong, color: colors.primaryLight },
  quick: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
  quickItem: {
    flex: 1,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
  },
  quickText: { ...typography.bodyStrong },
  quickOther: { color: colors.primaryLight },
  notice: {
    ...typography.bodyStrong,
    color: colors.primaryLight,
    textAlign: "center",
    marginTop: spacing.lg,
  },
  cta: { marginTop: spacing.xl, marginBottom: spacing.xl },
});
