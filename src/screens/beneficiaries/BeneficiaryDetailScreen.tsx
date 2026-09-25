import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { CalendarDays, Pencil, Send, Star, Trash2 } from "lucide-react-native";

import {
  Avatar,
  DetailRow,
  ListRow,
  PrimaryButton,
  ScreenLayout,
  SecondaryButton,
} from "../../components/ui";
import { textStyles } from "../../theme/typography";
import { metrics } from "../../theme/radius";
import { spacing } from "../../theme/spacing";
import { formatLongDate } from "../../utils/date";
import { Beneficiary, Language } from "../../types/app";
import BeneficiaryDetails from "./BeneficiaryDetails";

type Props = {
  t: any;
  language: Language;
  beneficiary: Beneficiary;
  onBack: () => void;
  onSend: () => void;
  onToggleFavorite: (value: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
};

/** Detalle del beneficiario (pantalla 36). */
export default function BeneficiaryDetailScreen({
  t,
  language,
  beneficiary,
  onBack,
  onSend,
  onToggleFavorite,
  onEdit,
  onDelete,
}: Props) {
  return (
    <ScreenLayout
      showBack
      onBack={onBack}
      backTestID="beneficiaryDetail.backButton"
      backAccessibilityLabel={t.back}
    >
      <View style={styles.identity}>
        <Avatar name={beneficiary.fullName} size={metrics.heroIcon} />
        <Text style={[textStyles.title, styles.title]}>{t.beneficiaryDetailTitle}</Text>
        <Text style={[textStyles.subtitle, styles.subtitle]}>{t.beneficiaryDetailSubtitle}</Text>
      </View>

      <View style={styles.rows}>
        <BeneficiaryDetails t={t} beneficiary={beneficiary} testIDPrefix="beneficiaryDetail" />
        <ListRow
          testID="beneficiaryDetail.favoriteToggle"
          icon={Star}
          title={t.favoriteLabel}
          subtitle={beneficiary.favorite ? t.commonYes : t.commonNo}
          right="toggle"
          selected={beneficiary.favorite}
          onToggle={onToggleFavorite}
        />
        <DetailRow
          icon={CalendarDays}
          label={t.createdOn}
          value={formatLongDate(beneficiary.createdAt, language)}
        />
      </View>

      <View style={styles.actions}>
        <PrimaryButton
          testID="beneficiaryDetail.sendButton"
          title={t.sendMoney}
          iconLeft={Send}
          onPress={onSend}
        />
        <View style={styles.pair}>
          <SecondaryButton
            testID="beneficiaryDetail.editButton"
            title={t.editAction}
            iconLeft={Pencil}
            onPress={onEdit}
            style={styles.half}
          />
          <SecondaryButton
            testID="beneficiaryDetail.deleteButton"
            title={t.deleteAction}
            iconLeft={Trash2}
            tone="danger"
            onPress={onDelete}
            style={styles.half}
          />
        </View>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  identity: {
    alignItems: "center",
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  title: {
    marginTop: 20,
  },
  subtitle: {
    marginTop: spacing.sm,
  },
  rows: {
    gap: metrics.rowGap,
  },
  actions: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  pair: {
    flexDirection: "row",
    gap: spacing.md,
  },
  half: {
    flex: 1,
  },
});
