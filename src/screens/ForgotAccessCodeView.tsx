import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  Phone,
  Lock,
  KeyRound,
  CircleAlert,
  CircleCheck,
  MessageSquareText,
  SearchCheck,
} from "lucide-react-native";
import {
  BackButton,
  InfoCard,
  PrimaryButton,
  ScreenHeader,
  ScreenLayout,
  TextField,
} from "../components/ui";
import { ViewName } from "../types/app";
import { spacing } from "../theme/spacing";
import { formatUsPhoneDisplay, isWeakPasscode } from "../utils/validation";

type Props = {
  t: any;
  setView: (view: ViewName) => void;
};

type Step = "phone" | "code" | "newCode" | "success";

/**
 * Restablecer codigo de acceso, por telefono.
 *
 * Cuatro pasos, cada uno con sus propios campos (nada de campos de un paso
 * conviviendo con los de otro): telefono, codigo de recuperacion, el nuevo
 * codigo con su confirmacion, y el mensaje de exito con "Continuar" hacia el
 * login. `forgotAccessCode.spec.js` ubica los inputs por **indice de
 * `EditText` dentro de cada paso**, asi que el orden de los campos de cada
 * pantalla no se puede alterar.
 */
export default function ForgotAccessCodeView({ t, setView }: Props) {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [newAccessCode, setNewAccessCode] = useState("");
  const [confirmAccessCode, setConfirmAccessCode] = useState("");
  const [error, setError] = useState("");

  const handleSendCode = () => {
    if (phone.replace(/\D/g, "").length < 7) return;
    setStep("code");
  };

  const handleContinueFromCode = () => {
    setError("");
    if (recoveryCode.length !== 6) {
      setError(t.accessCodeMismatch);
      return;
    }
    setStep("newCode");
  };

  const handleReset = () => {
    setError("");

    if (isWeakPasscode(newAccessCode)) {
      setError(t.weakAccessCode);
      return;
    }

    if (newAccessCode !== confirmAccessCode) {
      setError(t.accessCodeMismatch);
      return;
    }

    setStep("success");
  };

  return (
    <ScreenLayout keyboard>
      <BackButton
        testID="forgot-backButton"
        accessibilityLabel={t.back}
        onPress={() => setView("login")}
      />

      {step === "phone" ? (
        <>
          <ScreenHeader
            icon={SearchCheck}
            title={t.forgotAccessCodeTitle}
            subtitle={t.forgotAccessCodeSubtitle}
            style={styles.header}
          />

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

            <PrimaryButton
              testID="forgot-sendCodeButton"
              title={t.sendRecoveryCode}
              showArrow
              onPress={handleSendCode}
            />
          </View>
        </>
      ) : null}

      {step === "code" ? (
        <>
          <ScreenHeader
            icon={SearchCheck}
            title={t.forgotAccessCodeTitle}
            subtitle={t.forgotAccessCodeSubtitle}
            style={styles.header}
          />

          <View style={styles.stack}>
            <InfoCard icon={MessageSquareText} text={t.recoveryCodeSentInfo} />

            <TextField
              testID="forgot-recoveryCodeInput"
              label={t.recoveryCodeLabel}
              leftIcon={KeyRound}
              value={recoveryCode}
              onChangeText={(text) => setRecoveryCode(text.replace(/\D/g, "").slice(0, 6))}
              keyboardType="number-pad"
              maxLength={6}
            />

            {error ? (
              <InfoCard testID="forgot.errorCard" icon={CircleAlert} tone="danger" text={error} />
            ) : null}

            <PrimaryButton
              testID="forgot-codeContinueButton"
              title={t.commonContinue}
              showArrow
              onPress={handleContinueFromCode}
            />
          </View>
        </>
      ) : null}

      {step === "newCode" ? (
        <>
          <ScreenHeader
            icon={Lock}
            title={t.newCodeTitle}
            subtitle={t.newCodeSubtitle}
            style={styles.header}
          />

          <View style={styles.stack}>
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

            {error ? (
              <InfoCard testID="forgot.errorCard" icon={CircleAlert} tone="danger" text={error} />
            ) : null}

            <PrimaryButton testID="forgot-resetButton" title={t.resetAccessCode} onPress={handleReset} />
          </View>
        </>
      ) : null}

      {step === "success" ? (
        <>
          <ScreenHeader
            icon={CircleCheck}
            iconVariant="ring"
            iconTone="success"
            title={t.forgotAccessCodeTitle}
            style={styles.header}
          />

          <View style={styles.stack}>
            <InfoCard icon={CircleCheck} tone="success" text={t.accessCodeResetSuccess} />
            <PrimaryButton
              testID="forgot-continueButton"
              title={t.commonContinue}
              onPress={() => setView("login")}
            />
          </View>
        </>
      ) : null}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: spacing.lg,
  },
  stack: {
    gap: spacing.lg,
  },
});
