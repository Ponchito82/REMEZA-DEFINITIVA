import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ShieldCheck, MessageSquareText, Smartphone, ShieldEllipsis } from "lucide-react-native";

import {
  Button,
  CloseButton,
  CountdownText,
  IconCircle,
  OtpInput,
  ScreenHeader,
} from "../components/ui";
import { ListItemCard } from "../components/remeza";
import { sizes } from "../theme/radius";
import { spacing, screenPadding } from "../theme/spacing";
import { ViewName } from "../types/app";

const RESEND_SECONDS = 30;
const DEFAULT_PHONE = "+52 55 1234 5678";

type Props = {
  t: any;
  setView: (view: ViewName) => void;
  phone?: string;
};

export default function TwoStepVerificationScreen({
  t,
  setView,
  phone = DEFAULT_PHONE,
}: Props) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const isComplete = code.every((digit) => digit.length === 1);

  const notes = [
    { icon: MessageSquareText, title: t.twoStepNote1Title, description: t.twoStepNote1Desc },
    { icon: Smartphone, title: t.twoStepNote2Title, description: t.twoStepNote2Desc },
    { icon: ShieldEllipsis, title: t.twoStepNote3Title, description: t.twoStepNote3Desc },
  ];

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <CloseButton
          testID="twoStep.backButton"
          accessibilityLabel={t.back}
          icon="arrow"
          onPress={() => setView("login")}
        />

        <IconCircle icon={ShieldCheck} size={sizes.hero} hero glow style={styles.hero} />

        <ScreenHeader
          title={t.twoStepTitle}
          subtitle={t.twoStepSubtitle.replace("{phone}", phone)}
          align="center"
          size="hero"
          testID="twoStep.header"
        />

        <OtpInput
          testID="twoStep.codeInput"
          value={code}
          onChange={setCode}
          size="lg"
          style={styles.otp}
        />

        <CountdownText
          testID="twoStep.resend"
          seconds={RESEND_SECONDS}
          label={t.resendCode}
          onResend={() => console.log("[twoStep] reenviar codigo")}
          style={styles.countdown}
        />

        <Button
          testID="twoStep.verifyButton"
          title={t.twoStepVerifyButton}
          onPress={() => setView("dashboard")}
          disabled={!isComplete}
          variant="gradient"
          deepGradient
          size="lg"
          radius="pill"
          rightAdornment="arrowCircle"
        />

        <View style={styles.notes}>
          {notes.map((note) => (
            <ListItemCard
              key={note.title}
              icon={note.icon}
              title={note.title}
              description={note.description}
            />
          ))}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    paddingHorizontal: screenPadding,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  hero: {
    marginTop: spacing.xxxl,
    marginBottom: spacing.xxl,
  },
  otp: {
    marginTop: spacing.sm,
  },
  countdown: {
    marginVertical: spacing.xl,
  },
  notes: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
});
