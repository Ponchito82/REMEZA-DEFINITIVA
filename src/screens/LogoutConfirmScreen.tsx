import React from "react";
import { View, StyleSheet } from "react-native";
import { LogOut, ShieldCheck, Smartphone, User } from "lucide-react-native";

import {
  FeatureRow,
  PrimaryButton,
  ScreenHeader,
  ScreenLayout,
  SecondaryButton,
} from "../components/ui";
import { metrics } from "../theme/radius";
import { spacing } from "../theme/spacing";

type Props = {
  t: any;
  /** Cierra la sesion con el mecanismo de siempre */
  onConfirm: () => void;
  onCancel: () => void;
};

/** Confirmacion antes de cerrar sesion (pantalla 59). */
export default function LogoutConfirmScreen({ t, onConfirm, onCancel }: Props) {
  return (
    <ScreenLayout
      footer={
        <>
          <PrimaryButton
            testID="logoutConfirm.confirmButton"
            title={t.logout}
            onPress={onConfirm}
          />
          <SecondaryButton
            testID="logoutConfirm.cancelButton"
            title={t.cancel}
            onPress={onCancel}
          />
        </>
      }
    >
      <ScreenHeader
        icon={LogOut}
        title={t.logoutConfirmTitle}
        subtitle={t.logoutConfirmSubtitle}
        testID="logoutConfirm.header"
        style={styles.header}
      />

      <View style={styles.rows}>
        <FeatureRow bareIcon icon={User} title={t.logoutInfoSafe} />
        <FeatureRow bareIcon icon={Smartphone} title={t.logoutInfoDevice} />
        <FeatureRow bareIcon icon={ShieldCheck} title={t.logoutInfoSignInAgain} />
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: spacing.xxxl,
  },
  rows: {
    gap: metrics.rowGap,
  },
});
