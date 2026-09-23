import React from "react";
import { ScrollView, StyleSheet, Linking } from "react-native";
import { ShieldAlert, Smartphone, MapPin, Calendar } from "lucide-react-native";

import {
  Button,
  CloseButton,
  IconCircle,
  LinkText,
  ScreenHeader,
} from "../components/ui";
import { InfoDetailsCard } from "../components/remeza";
import { sizes } from "../theme/radius";
import { spacing, screenPadding } from "../theme/spacing";
import { ViewName } from "../types/app";

const SUPPORT_URL = "https://remeza.app/soporte";

type Props = {
  t: any;
  setView: (view: ViewName) => void;
  device?: string;
  location?: string;
  dateTime?: string;
};

export default function SecurityAlertScreen({
  t,
  setView,
  device = "iPhone 14 Pro",
  location = "Ciudad de México, MX",
  dateTime = "14 Sep 2025, 10:24 a.m.",
}: Props) {
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <CloseButton
        testID="securityAlert.backButton"
        accessibilityLabel={t.back}
        icon="chevron"
        onPress={() => setView("login")}
      />

      <IconCircle
        icon={ShieldAlert}
        size={sizes.hero}
        hero
        glow
        filled
        style={styles.hero}
      />

      <ScreenHeader
        title={t.securityAlertTitle}
        subtitle={t.securityAlertSubtitle}
        align="center"
        size="hero"
        testID="securityAlert.header"
      />

      <InfoDetailsCard
        testID="securityAlert.details"
        items={[
          { icon: Smartphone, label: t.deviceLabel, value: device },
          { icon: MapPin, label: t.locationLabel, value: location },
          { icon: Calendar, label: t.dateTimeLabel, value: dateTime },
        ]}
      />

      <ScreenHeader
        title={t.wasItYouTitle}
        subtitle={t.wasItYouDesc}
        size="section"
        style={styles.section}
      />

      <Button
        testID="securityAlert.confirmButton"
        title={t.yesItWasMe}
        onPress={() => setView("twoStepVerification")}
        variant="gradient"
        deepGradient
        size="lg"
        radius="pill"
        rightAdornment="arrowCircle"
      />

      <Button
        testID="securityAlert.denyButton"
        title={t.noItWasntMe}
        onPress={() => setView("forgotAccessCode")}
        variant="outline"
        size="lg"
        radius="pill"
        rightAdornment="none"
        style={styles.deny}
      />

      <LinkText
        testID="securityAlert.supportLink"
        tone="magenta"
        onPress={() => Linking.openURL(SUPPORT_URL)}
        style={styles.support}
      >
        {t.contactSupport}
      </LinkText>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: screenPadding,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  hero: {
    marginTop: spacing.xxxl,
    marginBottom: spacing.xxl,
  },
  section: {
    marginTop: spacing.xl,
  },
  deny: {
    marginTop: spacing.md,
  },
  support: {
    alignSelf: "center",
    marginTop: spacing.xxl,
  },
});
