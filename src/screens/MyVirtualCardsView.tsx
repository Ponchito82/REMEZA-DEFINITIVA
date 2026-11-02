import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Check, Pencil, Power } from "lucide-react-native";

import { colors } from "../theme/colors";
import { fontFamily, typography } from "../theme/typography";
import { radius } from "../theme/radius";
import { spacing } from "../theme/spacing";
import { Button, ScreenHeader } from "../components/ui";
import ScreenLayout from "../components/ui/ScreenLayout";
import { VirtualCardArt } from "../components/remeza";
import { tourRef } from "../onboarding/tourTargets";
import { maskedNumber } from "./MyCardsView";
import type { GeneratedCard } from "./MyCardsView";

/** Ancho de la miniatura de cada fila. */
const THUMB_WIDTH = 112;

type Props = {
  t: any;
  cards: GeneratedCard[];
  onBack: () => void;
  onOpen: (id: string) => void;
  onRename: (id: string, name: string) => void;
  /** Abre "Fondear saldo". */
  onFund: () => void;
  /** Apaga o enciende la tarjeta `id`. */
  onToggleOff: (id: string) => void;
  /** Quedan tarjetas por generar (maximo 3). */
  canGenerate: boolean;
  /** Abre "Nueva tarjeta". */
  onGenerate: () => void;
};

/**
 * Mis tarjetas virtuales: mismo estilo de lista que "Fondear saldo", sin cuenta
 * origen ni monto. Cada fila lleva la miniatura a la izquierda, nombre y numero
 * al centro, y lapiz para renombrar y ojo para ver el detalle a la derecha.
 */
export default function MyVirtualCardsView({ t, cards, onBack, onOpen, onRename, onFund, onToggleOff, canGenerate, onGenerate }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const saveEdit = () => {
    const name = draft.trim();
    if (editingId && name) onRename(editingId, name);
    setEditingId(null);
  };

  return (
    <ScreenLayout
      showBack
      onBack={onBack}
      backTestID="virtualCards-backButton"
      backAccessibilityLabel={t.back}
      keyboard
      testID="virtualCards"
    >
      <ScreenHeader title={t.myVirtualCardsTitle} subtitle={t.myCardsSubtitle} style={styles.header} />

      <View style={styles.list}>
        {[...cards].sort((a, b) => a.createdAt - b.createdAt).map((card, index) => {
          const editing = editingId === card.id;
          return (
            <Pressable
              key={card.id}
              testID={`virtualCards-card-${card.id}`}
              accessibilityRole="button"
              onPress={() => onOpen(card.id)}
              ref={index === 0 ? tourRef("vcCard") : undefined}
              collapsable={false}
              style={[styles.item, editing && styles.itemEditing]}
            >
              <VirtualCardArt color={card.color} width={THUMB_WIDTH} style={[styles.thumb, card.isOff && styles.thumbOff]} />
              <View style={styles.info}>
                {editing ? (
                  <TextInput
                    testID={`virtualCards-nameInput-${card.id}`}
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
                    {card.name}
                  </Text>
                )}

                <Text style={styles.number} numberOfLines={1}>
                  {maskedNumber(card.last4)}
                </Text>
              </View>

              <View ref={index === 0 ? tourRef("vcActions") : undefined} collapsable={false} style={styles.actions}>
                <Pressable
                  testID={`virtualCards-toggleOff-${card.id}`}
                  accessibilityRole="button"
                  accessibilityLabel={t.myCardsTurnOff}
                  accessibilityState={{ selected: card.isOff }}
                  onPress={() => onToggleOff(card.id)}
                  hitSlop={8}
                  style={styles.iconButton}
                >
                  <Power size={16} color={card.isOff ? "#F87171" : colors.primaryLight} strokeWidth={2.2} />
                </Pressable>
                <Pressable
                  testID={editing ? `virtualCards-saveName-${card.id}` : `virtualCards-editName-${card.id}`}
                  accessibilityRole="button"
                  accessibilityLabel={editing ? t.myCardsSaveName : t.myCardsEditName}
                  onPress={
                    editing
                      ? saveEdit
                      : () => {
                          setEditingId(card.id);
                          setDraft(card.name);
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

      {canGenerate ? (
        <View ref={tourRef("vcGenerate")} collapsable={false} style={styles.generate}>
          <Button
            testID="virtualCards-generateButton"
            title={t.virtualCardsGenerateCta}
            variant="outline"
            onPress={onGenerate}
          />
        </View>
      ) : null}

      <View ref={tourRef("vcFund")} collapsable={false}>
        <Button testID="virtualCards-fundButton" title={t.moveBalanceTitle} onPress={onFund} style={styles.cta} />
      </View>
    </ScreenLayout>
  );
}

const BORDER = "rgba(130,110,255,0.28)";

const styles = StyleSheet.create({
  header: { marginBottom: spacing.lg },
  list: { gap: spacing.sm },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: colors.surface,
  },
  itemEditing: { borderColor: colors.primaryLight, borderWidth: 2 },
  thumb: { elevation: 0, shadowOpacity: 0 },
  thumbOff: { opacity: 0.45 },
  info: { flex: 1, gap: spacing.xs },
  name: { fontSize: 17 },
  number: { ...typography.body, fontSize: 15, color: colors.primaryLight, letterSpacing: 0.5 },
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
  actions: { gap: spacing.sm },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceStrong,
  },
  generate: { marginTop: spacing.xl },
  cta: { marginTop: spacing.md, marginBottom: spacing.xl },
});
