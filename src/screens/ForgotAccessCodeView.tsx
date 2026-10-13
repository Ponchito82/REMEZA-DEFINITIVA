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
import { ApiError } from "../api/client";
import { confirmNewSecureCode, requestSecureCodeRecovery } from "../api/secureCode";

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
 *
 * Usa `/api/v1/secure-code`: "Enviar codigo" pide el SMS (`recovery`) y el
 * codigo recibido se valida hasta el final (`confirm`), junto con el nuevo
 * codigo de acceso. Si el backend lo rechaza, se regresa al paso del codigo.
 *
 * El telefono acepta E.164 (`+52...`, como en el login) o 10 digitos sin
 * lada, que el backend toma como numero de EE. UU.
 */
export default function ForgotAccessCodeView({ t, setView }: Props) {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [newAccessCode, setNewAccessCode] = useState("");
  const [confirmAccessCode, setConfirmAccessCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const isInternational = phone.startsWith("+");

  const handlePhoneChange = (text: string) => {
    const digits = text.replace(/\D/g, "");
    setPhone(text.trim().startsWith("+") ? `+${digits.slice(0, 15)}` : digits.slice(0, 10));
  };

  const errorMessage = (err: unknown) =>
    err instanceof ApiError && err.status !== 0 && err.message ? err.message : t.connectionError;

  const handleSendCode = async () => {
    if (busy || phone.replace(/\D/g, "").length < 7) return;
    setError("");
    setBusy(true);
    try {
      await requestSecureCodeRecovery(phone);
      setRecoveryCode("");
      setStep("code");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleContinueFromCode = () => {
    setError("");
    if (recoveryCode.length !== 6) {
      setError(t.accessCodeMismatch);
      return;
    }
    setStep("newCode");
  };

  const handleReset = async () => {
    if (busy) return;
    setError("");

    if (isWeakPasscode(newAccessCode)) {
      setError(t.weakAccessCode);
      return;
    }

    if (newAccessCode !== confirmAccessCode) {
      setError(t.accessCodeMismatch);
      return;
    }

    setBusy(true);
    try {
      await confirmNewSecureCode(phone, recoveryCode, newAccessCode);
      setStep("success");
    } catch (err) {
      setError(errorMessage(err));
      // Codigo vencido, equivocado o demasiados intentos: se pide otra vez.
      // Sin conexion se queda aqui para reintentar sin volver a capturar.
      if (err instanceof ApiError && err.status !== 0) {
        setRecoveryCode("");
        setStep("code");
      }
    } finally {
      setBusy(false);
    }
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
              value={isInternational ? phone : formatUsPhoneDisplay(phone)}
              onChangeText={handlePhoneChange}
              keyboardType="phone-pad"
            />

            {error ? (
              <InfoCard testID="forgot.errorCard" icon={CircleAlert} tone="danger" text={error} />
            ) : null}

            <PrimaryButton
              testID="forgot-sendCodeButton"
              title={t.sendRecoveryCode}
              showArrow
              loading={busy}
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

            <PrimaryButton
              testID="forgot-resetButton"
              title={t.resetAccessCode}
              loading={busy}
              onPress={handleReset}
            />
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
