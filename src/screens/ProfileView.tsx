import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { User, Mail, MapPin, Phone, Lock } from "lucide-react-native";

import { CloseButton, GlassBanner, GlassCard, ScreenHeader } from "../components/ui";
import type { IconComponent } from "../components/ui";
import { AvatarPicker } from "../components/remeza";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
import { radius, sizes } from "../theme/radius";
import { spacing, screenPadding } from "../theme/spacing";
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
 * consultan: cambiarlos pasa por soporte.
 */
export default function ProfileView({ t, setView, fullName, email, phone, address }: Props) {
  const rows: ProfileRow[] = [
    { key: "fullName", label: t.fullName, value: fullName, icon: User },
    { key: "email", label: t.emailAddress, value: email, icon: Mail },
    { key: "phone", label: t.phoneNumber, value: phone, icon: Phone },
    { key: "address", label: t.homeAddress, value: address, icon: MapPin },
  ];

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <CloseButton testID="profile-backButton" onPress={() => setView("dashboard")} />

      <ScreenHeader
        title={t.profileTitle}
        subtitle={t.profileSubtitle}
        style={styles.header}
      />

      <AvatarPicker style={styles.avatar} />

      <GlassCard size="lg" style={styles.card}>
        {rows.map((row, index) => {
          const Icon = row.icon;
          const isLast = index === rows.length - 1;

          return (
            <View key={row.key} style={[styles.row, !isLast && styles.rowDivider]}>
              <View style={styles.iconCircle}>
                <Icon size={18} color={colors.primaryLight} strokeWidth={2} />
              </View>

              <View style={styles.text}>
                <Text style={typography.caption}>{row.label}</Text>
                <Text
                  testID={`profile-${row.key}Value`}
                  style={typography.bodyStrong}
                  selectable
                >
                  {row.value || t.notAvailable}
                </Text>
              </View>

              <Lock size={16} color={colors.text.placeholder} strokeWidth={2} />
            </View>
          );
        })}
      </GlassCard>

      <GlassBanner
        testID="profile-readOnlyNotice"
        tone="info"
        message={t.profileReadOnlyNotice}
        style={styles.notice}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: screenPadding,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginTop: spacing.xxl,
  },
  avatar: {
    marginBottom: spacing.xxl,
  },
  card: {
    paddingVertical: spacing.xs,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  iconCircle: {
    width: sizes.inputIcon,
    height: sizes.inputIcon,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceStrong,
  },
  text: {
    flex: 1,
    gap: spacing.xs,
  },
  notice: {
    marginTop: spacing.lg,
  },
});
