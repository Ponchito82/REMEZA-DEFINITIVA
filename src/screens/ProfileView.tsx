import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  Bell,
  CircleCheck,
  CircleHelp,
  CreditCard,
  Gauge,
  Headset,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Trash2,
  User,
} from "lucide-react-native";

import { Avatar, DetailRow, InfoCard, ListRow, ScreenHeader, ScreenLayout } from "../components/ui";
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

  /** Accesos del perfil (pantalla 19) */
  onOpen: (target: ProfileTarget) => void;
  /** Aviso de una accion recien hecha (p. ej. tarjeta eliminada) */
  notice?: string;
};

export type ProfileTarget =
  | "security"
  | "notifications"
  | "paymentMethods"
  | "helpCenter"
  | "support"
  | "cardLimits"
  | "blockCard"
  | "deleteCard"
  | "logout";

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
 *
 * Debajo van los accesos de ajustes del PDF (19), menos "Editar perfil" y
 * "Preferencias", y una seccion de tarjeta con limites, bloqueo y eliminar.
 */
export default function ProfileView({
  t,
  setView,
  fullName,
  email,
  phone,
  address,
  onOpen,
  notice,
}: Props) {
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

      {notice ? (
        <InfoCard
          testID="profile.actionNotice"
          icon={CircleCheck}
          tone="success"
          text={notice}
          style={styles.notice}
        />
      ) : null}

      <Text style={[textStyles.overline, styles.section]}>{t.profileSettingsSection}</Text>
      <View style={styles.rows}>
        <ListRow
          testID="profile.securityRow"
          icon={ShieldCheck}
          title={t.profileSecurity}
          onPress={() => onOpen("security")}
        />
        <ListRow
          testID="profile.notificationsRow"
          icon={Bell}
          title={t.profileNotifications}
          onPress={() => onOpen("notifications")}
        />
        <ListRow
          testID="profile.paymentMethodsRow"
          icon={CreditCard}
          title={t.profilePaymentMethods}
          onPress={() => onOpen("paymentMethods")}
        />
        <ListRow
          testID="profile.helpCenterRow"
          icon={CircleHelp}
          title={t.profileHelpCenter}
          onPress={() => onOpen("helpCenter")}
        />
        <ListRow
          testID="profile.supportRow"
          icon={Headset}
          title={t.profileContactSupport}
          onPress={() => onOpen("support")}
        />
      </View>

      <Text style={[textStyles.overline, styles.section]}>{t.profileCardSection}</Text>
      <View style={styles.rows}>
        <ListRow
          testID="profile.cardLimitsRow"
          icon={Gauge}
          title={t.profileCardLimits}
          onPress={() => onOpen("cardLimits")}
        />
        <ListRow
          testID="profile.blockCardRow"
          icon={Lock}
          title={t.profileBlockCard}
          onPress={() => onOpen("blockCard")}
        />
        <ListRow
          testID="profile.deleteCardRow"
          icon={Trash2}
          title={t.profileDeleteCard}
          onPress={() => onOpen("deleteCard")}
        />
      </View>

      <ListRow
        testID="profile.logoutRow"
        icon={LogOut}
        title={t.logout}
        tone="danger"
        onPress={() => onOpen("logout")}
        style={styles.logout}
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
  section: {
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
  logout: {
    marginTop: spacing.xxl,
  },
});
