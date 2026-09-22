import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Pressable,
  Platform,
} from "react-native";
import { Phone, Lock, User } from "lucide-react-native";
import {
  GlassBanner,
  GlassInput,
  GradientButton,
  LanguageRow,
  LanguageToggle,
  LogoTile,
} from "../components/ui";
import { Language, ViewName } from "../types/app";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
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

/**
 * Parte la cadena de "no tienes cuenta" en pregunta + accion, para pintar la
 * accion en blanco. El signo de cierre es el mismo en ingles y en espanol; el
 * de apertura "¿" es otro caracter y no interfiere.
 */
function splitAccountPrompt(text: string) {
  const mark = text.indexOf("?");
  if (mark < 0) return { question: text, action: "" };
  return { question: text.slice(0, mark + 1), action: text.slice(mark + 1).trim() };
}

export default function LoginScreen({
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

  const accountPrompt = splitAccountPrompt(t.noAccount);

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
    <View style={styles.root}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <LanguageRow label={t.language} />

          <LanguageToggle
            value={language}
            onChange={setLanguage}
            labelFor={(code) => (code === "en" ? t.english : t.spanish)}
            style={styles.toggle}
          />

          <LogoTile size={124} radius={30} style={styles.logo} />

          <Text style={[typography.title, styles.centered]}>{t.welcome}</Text>
          <Text style={[typography.subtitle, styles.subtitle]}>{t.signInSubtitle}</Text>

          {sessionNotice ? (
            <GlassBanner
              testID="login-sessionExpiredBanner"
              message={sessionNotice}
              style={styles.banner}
            />
          ) : null}

          <GlassInput
            testID="login-phoneInput"
            icon={Phone}
            value={phone}
            onChangeText={setPhone}
            onBlur={() => setPhoneTouched(true)}
            placeholder={t.phoneNumber}
            keyboardType="phone-pad"
            error={phoneTouched && !isPhoneValid ? t.invalidPhoneNumber : undefined}
            style={styles.phoneField}
          />

          <GlassInput
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
            style={styles.codeField}
          />

          {error ? <GlassBanner message={error} style={styles.banner} /> : null}

          <GradientButton
            testID="login-signInButton"
            title={isSubmitting ? t.signingIn : t.signIn}
            gradient="diagonal"
            onPress={handleSignIn}
            disabled={isSubmitting || !canSubmit}
            style={styles.cta}
          />

          <Pressable
            testID="login-forgotAccessCodeLink"
            onPress={() => setView("forgotAccessCode")}
            hitSlop={8}
            style={styles.forgot}
          >
            <Text style={typography.link}>{t.forgotAccessCode}</Text>
          </Pressable>

          <Pressable
            testID="login-registerLink"
            onPress={() => {
              setView("register");
              setRegStep(1);
            }}
            hitSlop={8}
            style={styles.register}
          >
            <User size={20} color={colors.textPrimary} strokeWidth={1.75} />
            <Text style={typography.caption}>
              {accountPrompt.question}
              {accountPrompt.action ? (
                <Text style={typography.captionAccent}> {accountPrompt.action}</Text>
              ) : null}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  toggle: {
    marginTop: 12,
  },
  logo: {
    marginTop: 44,
  },
  centered: {
    textAlign: "center",
    marginTop: 28,
  },
  subtitle: {
    textAlign: "center",
    marginTop: 8,
  },
  banner: {
    marginTop: 24,
  },
  phoneField: {
    marginTop: 32,
  },
  codeField: {
    marginTop: 16,
  },
  cta: {
    marginTop: 28,
  },
  forgot: {
    alignSelf: "center",
    marginTop: 24,
  },
  register: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    gap: 10,
    marginTop: 32,
  },
});
