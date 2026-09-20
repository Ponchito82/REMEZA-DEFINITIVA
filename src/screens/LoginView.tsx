import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Phone, Lock, User } from "lucide-react-native";
import {
  ScreenBackground,
  BrandMark,
  GlassField,
  GlassBanner,
  PrimaryButton,
  LanguageToggle,
  LinkButton,
} from "../components/ui";
import { Language, ViewName } from "../types/app";
import { fontFamily, fontSize, palette, spacing } from "../theme/designSystem";
import { login } from "../api/auth";
import { ApiError } from "../api/client";
import { UnauthorizedReason } from "../api/session";
import { isValidE164Phone } from "../utils/validation";

type Props = {
  t: any;
  language: Language;
  setLanguage: (language: Language) => void;
  setView: (view: ViewName) => void;
  setRegStep: (step: number) => void;
  onLoginSuccess: (customerId: string, token: string, expiresInMs?: number) => void;
  sessionEndedReason?: UnauthorizedReason | null;
  onSessionNoticeDismissed?: () => void;
  prefilledPhone?: string;
};

export default function LoginView({
  t,
  language,
  setLanguage,
  setView,
  setRegStep,
  onLoginSuccess,
  sessionEndedReason = null,
  onSessionNoticeDismissed,
  prefilledPhone = "",
}: Props) {
  const [phone, setPhone] = useState(prefilledPhone);
  const [loginAccessCode, setLoginAccessCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [codeTouched, setCodeTouched] = useState(false);

  const isPhoneValid = isValidE164Phone(phone);
  const isCodeValid = loginAccessCode.length === 6;
  const canSubmit = isPhoneValid && isCodeValid;

  const sessionNotice =
    sessionEndedReason === "expired"
      ? t.sessionExpired
      : sessionEndedReason === "rejected"
        ? t.sessionUnauthorized
        : "";

  const handleSignIn = async () => {
    if (isSubmitting || !canSubmit) return;
    setError("");
    onSessionNoticeDismissed?.();
    setIsSubmitting(true);
    try {
      const auth = await login(phone, loginAccessCode);
      onLoginSuccess(auth.customerId, auth.token, auth.expiresInMs);
      setView("dashboard");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError(t.invalidCredentials);
      } else {
        setError(t.connectionError);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenBackground watermarkTop={0.31} watermarkScale={0.9}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <LanguageToggle
            t={t}
            language={language}
            setLanguage={setLanguage}
            style={styles.language}
          />

          <View style={styles.brand}>
            <BrandMark size={126} />
            <Text style={styles.title}>{t.welcome}</Text>
            <Text style={styles.subtitle}>{t.signInSubtitle}</Text>
          </View>

          {sessionNotice ? (
            <GlassBanner
              testID="login-sessionExpiredBanner"
              message={sessionNotice}
              style={styles.banner}
            />
          ) : null}

          <View style={styles.form}>
            <GlassField
              testID="login-phoneInput"
              icon={Phone}
              value={phone}
              onChangeText={setPhone}
              onBlur={() => setPhoneTouched(true)}
              placeholder={t.phoneNumber}
              keyboardType="phone-pad"
              error={phoneTouched && !isPhoneValid ? t.invalidPhoneNumber : undefined}
            />

            <GlassField
              testID="login-accessCodeInput"
              icon={Lock}
              value={loginAccessCode}
              onChangeText={(text) => setLoginAccessCode(text.replace(/\D/g, "").slice(0, 6))}
              onBlur={() => setCodeTouched(true)}
              placeholder={t.accessCode6}
              keyboardType="number-pad"
              secureTextEntry
              maxLength={6}
              error={codeTouched && !isCodeValid ? t.invalidAccessCode : undefined}
            />

            {error ? <GlassBanner message={error} /> : null}

            <PrimaryButton
              testID="login-signInButton"
              label={isSubmitting ? t.signingIn : t.signIn}
              onPress={handleSignIn}
              disabled={isSubmitting || !canSubmit}
              style={styles.cta}
            />

            <LinkButton
              testID="login-forgotAccessCodeLink"
              label={t.forgotAccessCode}
              onPress={() => setView("forgotAccessCode")}
            />

            <LinkButton
              testID="login-registerLink"
              label={t.noAccount}
              icon={User}
              tone="light"
              onPress={() => {
                setView("register");
                setRegStep(1);
              }}
              style={styles.registerLink}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 26,
    paddingBottom: spacing.xl,
  },
  language: {
    marginTop: spacing.lg,
  },
  brand: {
    alignItems: "center",
    marginTop: spacing.xxl,
  },
  title: {
    fontFamily,
    fontSize: fontSize.display,
    fontWeight: "700",
    color: palette.textPrimary,
    marginTop: spacing.lg,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontFamily,
    fontSize: fontSize.subtitle,
    fontWeight: "400",
    color: palette.textSecondary,
    marginTop: spacing.sm,
    textAlign: "center",
  },
  banner: {
    marginTop: spacing.lg,
  },
  form: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  cta: {
    marginTop: spacing.sm,
  },
  registerLink: {
    marginTop: spacing.xs,
  },
});
