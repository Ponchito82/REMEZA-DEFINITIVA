import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { UserPlus } from "lucide-react-native";
import MainButton from "../components/MainButton";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { Language, ViewName } from "../types/app";
import { styles } from "../theme/styles";
import { PURPLE } from "../theme/colors";
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
    <KeyboardAvoidingView
      style={styles.centerScreen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.authCard}>
        <LanguageSwitcher t={t} language={language} setLanguage={setLanguage} />

        <View style={styles.logoBox}>
          <Image
            source={require("../assets/remeza_logo.png")}
            style={{ width: 32, height: 32, tintColor: "#fff" }}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.authTitle}>{t.welcome}</Text>
        <Text style={styles.authSubtitle}>{t.signInSubtitle}</Text>

        {sessionNotice ? (
          <View style={styles.formBanner} testID="login-sessionExpiredBanner">
            <Text style={styles.formBannerText}>{sessionNotice}</Text>
          </View>
        ) : null}

        <View style={styles.stack16}>
          <TextInput
            testID="login-phoneInput"
            value={phone}
            onChangeText={setPhone}
            onBlur={() => setPhoneTouched(true)}
            placeholder={t.phoneNumber}
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
            style={styles.authInput}
          />
          {phoneTouched && !isPhoneValid ? (
            <Text style={styles.fieldErrorText}>{t.invalidPhoneNumber}</Text>
          ) : null}

          <TextInput
            testID="login-accessCodeInput"
            value={loginAccessCode}
            onChangeText={(text) => setLoginAccessCode(text.replace(/\D/g, "").slice(0, 6))}
            onBlur={() => setCodeTouched(true)}
            placeholder={t.accessCode6}
            placeholderTextColor="#9CA3AF"
            keyboardType="number-pad"
            secureTextEntry
            maxLength={6}
            style={styles.authInput}
          />
          {codeTouched && !isCodeValid ? (
            <Text style={styles.fieldErrorText}>{t.invalidAccessCode}</Text>
          ) : null}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <MainButton testID="login-signInButton" onPress={handleSignIn} disabled={isSubmitting || !canSubmit}>
            {isSubmitting ? t.signingIn : t.signIn}
          </MainButton>

          <Pressable
            testID="login-forgotAccessCodeLink"
            onPress={() => setView("forgotAccessCode")}
            style={({ pressed }) => [styles.forgotLink, pressed && { opacity: 0.7 }]}
          >
            <Text style={styles.forgotLinkText}>{t.forgotAccessCode}</Text>
          </Pressable>

          <Pressable
            testID="login-registerLink"
            onPress={() => {
              setView("register");
              setRegStep(1);
            }}
            style={({ pressed }) => [styles.secondaryLinkButton, pressed && { opacity: 0.8 }]}
          >
            <UserPlus size={18} color={PURPLE} />
            <Text style={styles.secondaryLinkText}>{t.noAccount}</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}