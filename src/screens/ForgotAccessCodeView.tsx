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

/**
 * Recuperacion del codigo de acceso.
 *
 * El orden de los campos es parte del contrato de prueba: `forgotAccessCode.spec.js`
 * los localiza por **indice de `EditText`** (telefono 0, codigo 1, nuevo 2,
 * confirmacion 3), asi que no se pueden reordenar ni intercalar otro input.
 *
 * Toma lo visual de las pantallas 21 a 25 sin cambiar el mecanismo (telefono,
 * codigo por SMS y nuevo codigo de acceso de 6 digitos). El icono protagonista
 * solo acompana al primer paso y al de exito: con los cuatro campos a la vista,
 * empujaria el ultimo fuera de pantalla y UiAutomator dejaria de encontrarlo.
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

  const showHero = !codeSent || success;

  return (
    <ScreenLayout keyboard>
      <BackButton
        testID="forgot-backButton"
        accessibilityLabel={t.back}
        onPress={() => setView("login")}
      />

      <ScreenHeader
        icon={showHero ? (success ? CircleCheck : SearchCheck) : undefined}
        iconVariant={success ? "ring" : "filled"}
        iconTone={success ? "success" : "default"}
        title={t.forgotAccessCodeTitle}
        subtitle={t.forgotAccessCodeSubtitle}
        style={styles.header}
      />

      {success ? (
        <View style={styles.stack}>
          <InfoCard icon={CircleCheck} tone="success" text={t.accessCodeResetSuccess} />
          <PrimaryButton title={t.backToLogin} onPress={() => setView("login")} />
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
            <PrimaryButton
              testID="forgot-sendCodeButton"
              title={t.sendRecoveryCode}
              showArrow
              onPress={handleSendCode}
            />
          ) : (
            <>
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
                <InfoCard
                  testID="forgot.errorCard"
                  icon={CircleAlert}
                  tone="danger"
                  text={error}
                />
              ) : null}

              <PrimaryButton
                testID="forgot-resetButton"
                title={t.resetAccessCode}
                onPress={handleReset}
              />
            </>
          )}
        </View>
      )}
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
