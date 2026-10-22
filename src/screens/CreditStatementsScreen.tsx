import React, { useMemo, useState } from "react";
import { View, Text, Pressable, ScrollView, Modal, StyleSheet } from "react-native";
import Share from "react-native-share";
import { Download, Eye, FileText, X } from "lucide-react-native";
import ScreenBackground from "../components/ui/ScreenBackground";
import { styles as appStyles } from "../theme/styles";
import { colors } from "../theme/colors";
import { fontFamily, typography } from "../theme/typography";
import { CreditFlowHeader } from "../components/remeza";
import { StatementTable } from "../components/remeza/CreditStatementDocument";
import { spacing, screenPadding } from "../theme/spacing";
import { buildCreditStatements, buildStatementLines } from "../utils/creditStatements";
import type { CreditStatement } from "../utils/creditStatements";
import { buildStatementPdfBase64 } from "../utils/creditStatementPdf";
import type { CreditMovement } from "../utils/creditSimulation";
import type { Language } from "../types/app";

type Props = {
  t: any;
  language: Language;
  holderName: string;
  holderAddress?: string;
  creditLimitUsd: number;
  /** Movimientos reales de la tarjeta; de aqui salen los estados de cuenta. */
  movements: CreditMovement[];
  setIsMenuOpen: (value: boolean) => void;
  onBack: () => void;
};

const MONTH_NAMES: Record<Language, string[]> = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  es: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
};

export default function CreditStatementsScreen({
  t,
  language,
  holderName,
  holderAddress,
  creditLimitUsd,
  movements,
  setIsMenuOpen,
  onBack,
}: Props) {
  const statements = useMemo(() => buildCreditStatements(movements), [movements]);
  const [selected, setSelected] = useState<CreditStatement | null>(null);

  const download = async () => {
    if (!selected) return;
    try {
      const fileName = `estado-de-cuenta-${selected.id}`;
      const base64 = buildStatementPdfBase64({ t, language, holderName, holderAddress, creditLimitUsd, statement: selected });
      await Share.open({
        url: `data:application/pdf;base64,${base64}`,
        type: "application/pdf",
        filename: fileName,
        // La cache externa no esta en los paths del FileProvider de react-native-share.
        useInternalStorage: true,
        failOnCancel: false,
      });
    } catch (error) {
      console.warn("[statement] no se pudo descargar el estado de cuenta", error);
    }
  };

  const label = (s: CreditStatement) => {
    const d = new Date(s.cutoffAt);
    return `${MONTH_NAMES[language][d.getMonth()]} ${d.getFullYear()}`;
  };

  return (
    <View style={appStyles.dashboardScreen}>
      <CreditFlowHeader
        testIDPrefix="creditStatements"
        onMenu={() => setIsMenuOpen(true)}
        onBack={onBack}
        backLabel={t.back}
        title={
          <>
            {t.creditStmtTitle} <Text style={localStyles.accent}>{t.creditStmtTitleAccent}</Text>
          </>
        }
      />

      <ScrollView contentContainerStyle={localStyles.content} showsVerticalScrollIndicator={false}>
        <Text style={localStyles.subtitle}>{t.creditStmtSubtitle}</Text>

        {statements.length === 0 ? <Text style={localStyles.subtitle}>{t.creditEmptyDesc}</Text> : null}

        <View style={localStyles.list}>
          {statements.map((s) => (
            <View key={s.id} testID="creditStatements-item" style={localStyles.item}>
              <View style={localStyles.itemTop}>
                <View style={localStyles.iconBox}>
                  <FileText size={20} color={colors.text.primary} strokeWidth={2} />
                </View>
                <View style={localStyles.flex}>
                  <Text style={localStyles.itemTitle}>{label(s)}</Text>
                </View>
                <Pressable
                  testID="creditStatements-view"
                  accessibilityRole="button"
                  onPress={() => setSelected(s)}
                  style={({ pressed }) => [localStyles.btn, pressed && localStyles.pressed]}
                >
                  <Eye size={16} color={colors.text.primary} strokeWidth={2} />
                  <Text style={localStyles.btnText}>{t.creditStmtView}</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={selected !== null}
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setSelected(null)}
      >
        <ScreenBackground watermark={false}>
          <View style={localStyles.sheetHeader}>
            <Text style={localStyles.sheetTitle}>
              {t.creditStmtMovements} · {selected ? label(selected) : ""}
            </Text>
            <Pressable accessibilityRole="button" onPress={() => setSelected(null)} hitSlop={10}>
              <X size={22} color={colors.text.primary} strokeWidth={2} />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={localStyles.content} showsVerticalScrollIndicator={false}>
            {selected ? (
              <StatementTable t={t} language={language} lines={buildStatementLines(selected)} />
            ) : null}
            <Pressable
              testID="creditStatements-download"
              accessibilityRole="button"
              onPress={download}
              style={({ pressed }) => [localStyles.downloadBtn, pressed && localStyles.pressed]}
            >
              <Download size={18} color="#FFFFFF" strokeWidth={2.2} />
              <Text style={localStyles.downloadText}>{t.creditStmtDownloadHint}</Text>
            </Pressable>
          </ScrollView>
        </ScreenBackground>
      </Modal>

    </View>
  );
}

const localStyles = StyleSheet.create({
  content: { paddingHorizontal: screenPadding, paddingTop: spacing.md, paddingBottom: 40 },
  pressed: { opacity: 0.7 },
  flex: { flex: 1 },
  accent: { color: "#FFFFFF" },
  subtitle: { ...typography.body, marginBottom: spacing.lg },
  list: { gap: spacing.sm, marginTop: spacing.lg },
  item: {
    padding: spacing.md,
    gap: spacing.md,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    backgroundColor: colors.sheetSurface,
  },
  itemTop: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(75,35,250,0.45)",
  },
  itemTitle: { fontFamily: fontFamily.bold, fontSize: 15, color: colors.text.primary },
  itemSub: { ...typography.caption, fontSize: 12 },
  itemAmount: { fontFamily: fontFamily.bold, fontSize: 15, color: colors.text.primary },
  itemActions: { flexDirection: "row", gap: spacing.sm },
  btn: {
    paddingHorizontal: spacing.md,
    height: 40,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    backgroundColor: colors.surfaceStrong,
  },
  btnPrimary: { borderColor: colors.primaryLight, backgroundColor: colors.primary },
  btnText: { fontFamily: fontFamily.semibold, fontSize: 13, color: colors.text.primary },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: screenPadding,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  sheetTitle: { fontFamily: fontFamily.bold, fontSize: 17, color: colors.text.primary },
  downloadBtn: {
    marginTop: spacing.lg,
    height: 52,
    borderRadius: 26,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    backgroundColor: colors.primary,
  },
  downloadText: { fontFamily: fontFamily.bold, fontSize: 15, color: "#FFFFFF" },});
