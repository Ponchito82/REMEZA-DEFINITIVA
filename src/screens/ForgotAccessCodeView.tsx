import React, { useState } from "react";
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { Phone, Lock, KeyRound } from "lucide-react-native";
import {
  Button,
  CloseButton,
  GlassBanner,
  ScreenHeader,
  TextField,
} from "../components/ui";
import { ViewName } from "../types/app";
import { spacing, screenPadding } from "../theme/spacing";
import { formatUsPhoneDisplay, isWeakPasscode } from "../utils/validation";

type Props = {
  t: any;
  setView: (view: ViewName) => void;
};

/**
 * Recuperacion del codigo de acceso.
 *
 * El orden de los campos es parte del contrato de prueba: `forgotAccessCode.spec.js`
 * los localiza por **indice de `EditText`** (telefono 0, codigo 1, nuevo 2,
 * confirmacion 3), asi que no se pueden reordenar ni intercalar otro input.
 */
export default function ForgotAccessCodeView({ t, setView }: Props) {
  const [phone, setPhone] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState("");
  const [newAccessCode, setNewAccessCode] = useState("");
  const [confirmAccessCode, setConfirmAccessCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSendCode = () => {
    if (phone.replace(/\D/g, "").length < 7) return;
    setCodeSent(true);
  };

  const handleReset = () => {
    setError("");

    if (recoveryCode.length !== 6) {
      setError(t.accessCodeMismatch);
      return;
    }

    if (isWeakPasscode(newAccessCode)) {
      setError(t.weakAccessCode);
      return;
    }

    if (newAccessCode !== confirmAccessCode) {
      setError(t.accessCodeMismatch);
      return;
    }

    setSuccess(true);
  };

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
        <CloseButton testID="forgot-backButton" onPress={() => setView("login")} />

        <ScreenHeader
          title={t.forgotAccessCodeTitle}
          subtitle={t.forgotAccessCodeSubtitle}
          style={styles.header}
        />

        {success ? (
          <View style={styles.stack}>
            <GlassBanner tone="info" message={t.accessCodeResetSuccess} />
            <Button title={t.backToLogin} onPress={() => setView("login")} />
          </View>
        ) : (
          <View style={styles.stack}>
            <TextField
              testID="forgot-phoneInput"
              label={t.phoneNumber}
              leftIcon={Phone}
              placeholder={t.phoneExample}
              value={formatUsPhoneDisplay(phone)}
              onChangeText={(text) => setPhone(text.replace(/\D/g, "").slice(0, 10))}
              keyboardType="phone-pad"
            />

            {!codeSent ? (
              <Button
                testID="forgot-sendCodeButton"
                title={t.sendRecoveryCode}
                onPress={handleSendCode}
              />
            ) : (
              <>
                <GlassBanner tone="info" message={t.recoveryCodeSentInfo} />

                <TextField
                  testID="forgot-recoveryCodeInput"
                  label={t.recoveryCodeLabel}
                  leftIcon={KeyRound}
                  value={recoveryCode}
                  onChangeText={(text) => setRecoveryCode(text.replace(/\D/g, "").slice(0, 6))}
                  keyboardType="number-pad"
                  maxLength={6}
                />

                <TextField
                  testID="forgot-newAccessCodeInput"
                  label={t.newAccessCode}
                  leftIcon={Lock}
                  value={newAccessCode}
                  onChangeText={(text) => setNewAccessCode(text.replace(/\D/g, "").slice(0, 6))}
                  keyboardType="number-pad"
                  maxLength={6}
                  secureTextEntry
                />

                <TextField
                  testID="forgot-confirmAccessCodeInput"
                  label={t.confirmNewAccessCode}
                  leftIcon={Lock}
                  value={confirmAccessCode}
                  onChangeText={(text) => setConfirmAccessCode(text.replace(/\D/g, "").slice(0, 6))}
                  keyboardType="number-pad"
                  maxLength={6}
                  secureTextEntry
                />

                {error ? <GlassBanner message={error} /> : null}

                <Button
                  testID="forgot-resetButton"
                  title={t.resetAccessCode}
                  onPress={handleReset}
                />
              </>
            )}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: screenPadding,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginTop: spacing.xxl,
  },
  stack: {
    gap: spacing.lg,
  },
});
