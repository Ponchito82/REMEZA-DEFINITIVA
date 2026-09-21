import React, { useState } from "react";
import { ScrollView, View, Text, Pressable } from "react-native";
import { X, CheckCircle2 } from "lucide-react-native";
import { styles } from "../theme/styles";
import FormInput from "../components/FormInput";
import MainButton from "../components/MainButton";
import { ViewName } from "../types/app";
import { formatUsPhoneDisplay, isWeakPasscode } from "../utils/validation";

type Props = {
  t: any;
  setView: (view: ViewName) => void;
};

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
    <View style={styles.pageScreen}>
      <ScrollView contentContainerStyle={styles.pageContent} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => setView("login")} style={styles.backButton}>
          <X size={24} color="#111827" />
        </Pressable>

        <Text style={styles.pageTitle}>{t.forgotAccessCodeTitle}</Text>
        <Text style={styles.pageSubtitle}>{t.forgotAccessCodeSubtitle}</Text>

        {success ? (
          <View style={styles.stack16}>
            <View style={styles.transferSuccessBox}>
              <CheckCircle2 size={18} color="#16A34A" />
              <Text style={styles.transferSuccessText}>{t.accessCodeResetSuccess}</Text>
            </View>
            <MainButton onPress={() => setView("login")}>{t.backToLogin}</MainButton>
          </View>
        ) : (
          <View style={styles.stack16}>
            <FormInput
              label={t.phoneNumber}
              value={formatUsPhoneDisplay(phone)}
              onChangeText={(text) => setPhone(text.replace(/\D/g, "").slice(0, 10))}
              keyboardType="phone-pad"
            />

            {!codeSent ? (
              <MainButton onPress={handleSendCode}>{t.sendRecoveryCode}</MainButton>
            ) : (
              <>
                <View style={styles.infoBox}>
                  <Text style={styles.infoBoxText}>{t.recoveryCodeSentInfo}</Text>
                </View>

                <FormInput
                  label={t.recoveryCodeLabel}
                  value={recoveryCode}
                  onChangeText={(text) => setRecoveryCode(text.replace(/\D/g, "").slice(0, 6))}
                  keyboardType="number-pad"
                  maxLength={6}
                />

                <FormInput
                  label={t.newAccessCode}
                  value={newAccessCode}
                  onChangeText={(text) => setNewAccessCode(text.replace(/\D/g, "").slice(0, 6))}
                  keyboardType="number-pad"
                  maxLength={6}
                  secureToggle
                />

                <FormInput
                  label={t.confirmNewAccessCode}
                  value={confirmAccessCode}
                  onChangeText={(text) => setConfirmAccessCode(text.replace(/\D/g, "").slice(0, 6))}
                  keyboardType="number-pad"
                  maxLength={6}
                  secureToggle
                />

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <MainButton onPress={handleReset}>{t.resetAccessCode}</MainButton>
              </>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
