import React from "react";
import { StyleSheet, View } from "react-native";
import { UserPlus, Users } from "lucide-react-native";

import {
  Avatar,
  InfoCard,
  ListRow,
  PrimaryButton,
  ScreenHeader,
  ScreenLayout,
} from "../../components/ui";
import { tokens } from "../../theme/colors";
import { metrics } from "../../theme/radius";
import { spacing } from "../../theme/spacing";
import { bankFromClabe, last4 } from "../../utils/bank";
import { Beneficiary } from "../../types/app";

type Props = {
  t: any;
  beneficiaries: Beneficiary[];
  onBack: () => void;
  onAdd: () => void;
  onOpen: (id: string) => void;
};

/** Lista de beneficiarios (con lo visual de la pantalla 32). Favoritos primero. */
export default function BeneficiaryListScreen({ t, beneficiaries, onBack, onAdd, onOpen }: Props) {
  const sorted = [...beneficiaries].sort((a, b) => Number(b.favorite) - Number(a.favorite));

  return (
    <ScreenLayout
      showBack
      onBack={onBack}
      backTestID="beneficiaries-backButton"
      backAccessibilityLabel={t.back}
      footer={
        <PrimaryButton
          testID="beneficiaries.addButton"
          title={t.addBeneficiary}
          iconLeft={UserPlus}
          onPress={onAdd}
        />
      }
    >
      <ScreenHeader
        icon={Users}
        title={t.beneficiariesTitle}
        subtitle={t.beneficiariesSubtitle}
        style={styles.header}
      />

      <View style={styles.list}>
        {sorted.length === 0 ? (
          <InfoCard testID="beneficiaries.emptyCard" text={t.noBeneficiaries} />
        ) : (
          sorted.map((beneficiary) => {
            const bank = bankFromClabe(beneficiary.clabe);
            const account = beneficiary.clabe ? `•••• ${last4(beneficiary.clabe)}` : "";
            return (
              <ListRow
                key={beneficiary.id}
                testID={`beneficiaries.item.${beneficiary.id}`}
                leading={<Avatar name={beneficiary.fullName} size={metrics.rowIconCircle} />}
                title={beneficiary.fullName}
                subtitle={[bank, account].filter(Boolean).join(" · ") || beneficiary.phone}
                value={beneficiary.favorite ? "★" : undefined}
                valueColor={tokens.warningText}
                onPress={() => onOpen(beneficiary.id)}
              />
            );
          })
        )}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: spacing.lg,
  },
  list: {
    gap: metrics.rowGap,
  },
});
