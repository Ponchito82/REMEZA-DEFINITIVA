import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { User, Mail, MapPin, Phone, Lock } from "lucide-react-native";

import { Avatar, DetailRow, InfoCard, ScreenHeader, ScreenLayout } from "../components/ui";
import type { IconComponent } from "../components/ui";
import { textStyles } from "../theme/typography";
import { metrics } from "../theme/radius";
import { spacing } from "../theme/spacing";
import { ViewName } from "../types/app";

type Props = {
  t: any;
  setView: (view: ViewName) => void;

  fullName: string;
  email: string;
  phone: string;
  address: string;
};

type ProfileRow = {
  key: string;
  label: string;
  value: string;
  icon: IconComponent;
};

/**
 * Perfil de solo lectura. Los datos vienen del KYC, asi que aqui solo se
 * consultan: cambiarlos pasa por soporte. Por eso no hay "Editar perfil" y
 * cada fila lleva candado en lugar de chevron.
 */
export default function ProfileView({ t, setView, fullName, email, phone, address }: Props) {
  const rows: ProfileRow[] = [
    { key: "fullName", label: t.fullName, value: fullName, icon: User },
    { key: "email", label: t.emailAddress, value: email, icon: Mail },
    { key: "phone", label: t.phoneNumber, value: phone, icon: Phone },
    { key: "address", label: t.homeAddress, value: address, icon: MapPin },
  ];

  const hasName = fullName.trim().length > 0;

  return (
    <ScreenLayout
      showBack
      onBack={() => setView("dashboard")}
      backTestID="profile-backButton"
      backAccessibilityLabel={t.back}
    >
      {hasName ? (
        <View style={styles.identity}>
          <Avatar name={fullName} size={metrics.heroIcon} />
          <Text style={[textStyles.title, styles.name]}>{fullName}</Text>
          {email ? <Text style={[textStyles.subtitle, styles.email]}>{email}</Text> : null}
        </View>
      ) : (
        <ScreenHeader
          icon={User}
          title={t.profileTitle}
          subtitle={email || t.profileSubtitle}
          style={styles.header}
        />
      )}

      <View style={styles.rows}>
        {rows.map((row) => (
          <DetailRow
            key={row.key}
            icon={row.icon}
            label={row.label}
            value={row.value || t.notAvailable}
            right="lock"
            valueTestID={`profile-${row.key}Value`}
          />
        ))}
      </View>

      <InfoCard
        testID="profile-readOnlyNotice"
        icon={Lock}
        text={t.profileReadOnlyNotice}
        style={styles.notice}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: spacing.lg,
  },
  identity: {
    alignItems: "center",
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
  },
  name: {
    marginTop: 20,
  },
  email: {
    marginTop: spacing.sm,
  },
  rows: {
    gap: metrics.rowGap,
  },
  notice: {
    marginTop: spacing.lg,
  },
});
