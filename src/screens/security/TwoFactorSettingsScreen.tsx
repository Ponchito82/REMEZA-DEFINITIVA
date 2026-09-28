import React, { useState } from "react";
import {
  CircleCheck,
  KeyRound,
  Mail,
  MessageSquareMore,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react-native";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { InfoCard, ListRow, PrimaryButton, SecondaryButton, StatusScreen } from "../../components/ui";
import { tokens } from "../../theme/colors";
import { textStyles } from "../../theme/typography";
import { spacing } from "../../theme/spacing";
import { metrics } from "../../theme/radius";
import type { BiometryKind } from "../../services/biometrics";
import type { TwoFactorMethod } from "../../services/securitySettings";
import { bioText, biometryIcon } from "./biometryKind";

type Props = {
  t: any;
  twoFactorEnabled: boolean;
  onToggleTwoFactor: (value: boolean) => void;
  /** Aviso tras cambiar el codigo de acceso */
  codeChanged: boolean;
  onBack: () => void;
  onChangeAccessCode: () => void;
  onBiometrics: () => void;
  kind: BiometryKind;
  /** Metodos activos. Solo se listan con la verificacion en dos pasos activada. */
  methods: Record<TwoFactorMethod, boolean>;
  /** Activa o desactiva un metodo directo desde su switch, sin entrar a otra pantalla. */
  onToggleMethod: (method: TwoFactorMethod, value: boolean) => void;
  /** Aviso tras activar, desactivar o cambiar automaticamente un metodo */
  methodNotice: { method: TwoFactorMethod; enabled: boolean; switched?: boolean } | null;
};

/**
 * Confirmacion antes de apagar la verificacion en dos pasos por completo:
 * es el unico camino para dejar los dos metodos inactivos (el interruptor
 * maestro), asi que se avisa antes de aplicarlo.
 */
function DisableAllModal({
  t,
  visible,
  onConfirm,
  onCancel,
}: {
  t: any;
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={modalStyles.overlay} onPress={onCancel}>
        <Pressable style={modalStyles.sheet} onPress={() => {}}>
          <View style={modalStyles.badge}>
            <ShieldAlert size={22} color={tokens.warningText} strokeWidth={1.75} />
          </View>

          <Text style={modalStyles.title}>{t.twoFactorDisableAllTitle}</Text>
          <Text style={modalStyles.message}>{t.twoFactorDisableAllMessage}</Text>

          <View style={modalStyles.actions}>
            <PrimaryButton
              testID="twoFactorSettings.disableAllCancelButton"
              title={t.twoFactorDisableAllCancel}
              onPress={onCancel}
            />
            <SecondaryButton
              testID="twoFactorSettings.disableAllConfirmButton"
              title={t.twoFactorDisableAllConfirm}
              tone="danger"
              onPress={onConfirm}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

/**
 * Seguridad: verificacion en dos pasos (pantalla 57). Con el interruptor
 * activado se listan sus dos metodos (Codigo SMS y Correo electronico), cada
 * uno con su propia pantalla; desactivado, no aparece ninguno. Se suman dos
 * accesos: cambiar el codigo de acceso (58) y biometria (10).
 */
export default function TwoFactorSettingsScreen({
  t,
  twoFactorEnabled,
  onToggleTwoFactor,
  codeChanged,
  onBack,
  onChangeAccessCode,
  onBiometrics,
  kind,
  methods,
  onToggleMethod,
  methodNotice,
}: Props) {
  const [confirmingDisableAll, setConfirmingDisableAll] = useState(false);

  const handleTogglePress = (value: boolean) => {
    // Apagar del todo solo se aplica tras confirmar en el modal.
    if (!value) {
      setConfirmingDisableAll(true);
      return;
    }
    onToggleTwoFactor(true);
  };

  const noticeText = !methodNotice
    ? ""
    : methodNotice.switched
      ? t.twoFactorMethodAutoSwitchedNote
      : methodNotice.enabled
        ? t.twoFactorMethodEnabledNote
        : t.twoFactorMethodDisabledNote;

  return (
    <StatusScreen
      testID="twoFactorSettings"
      showBack
      onBack={onBack}
      backTestID="twoFactorSettings.backButton"
      backAccessibilityLabel={t.back}
      icon={ShieldCheck}
      title={t.twoFactorSettingsTitle}
      subtitle={t.twoFactorSettingsSubtitle}
    >
      {codeChanged ? (
        <InfoCard
          testID="twoFactorSettings.codeChangedCard"
          icon={CircleCheck}
          tone="success"
          text={t.accessCodeChanged}
        />
      ) : null}

      <ListRow
        testID="twoFactorSettings.toggle"
        title={t.twoFactorToggle}
        subtitle={t.twoFactorToggleDesc}
        right="toggle"
        selected={twoFactorEnabled}
        onToggle={handleTogglePress}
      />
      {twoFactorEnabled ? (
        <>
          {methodNotice ? (
            <InfoCard
              testID="twoFactorSettings.methodNoticeCard"
              icon={CircleCheck}
              tone="success"
              text={noticeText}
            />
          ) : null}
          <ListRow
            testID="twoFactorSettings.smsRow"
            icon={MessageSquareMore}
            title={t.twoFactorSms}
            subtitle={t.twoFactorSmsDesc}
            right="toggle"
            selected={methods.sms}
            onToggle={(value) => onToggleMethod("sms", value)}
          />
          <ListRow
            testID="twoFactorSettings.emailRow"
            icon={Mail}
            title={t.twoFactorEmail}
            subtitle={t.twoFactorEmailDesc}
            right="toggle"
            selected={methods.email}
            onToggle={(value) => onToggleMethod("email", value)}
          />
        </>
      ) : null}
      <ListRow
        testID="twoFactorSettings.changeCodeRow"
        icon={KeyRound}
        title={t.changeAccessCodeRow}
        subtitle={t.changeAccessCodeRowDesc}
        onPress={onChangeAccessCode}
      />
      <ListRow
        testID="twoFactorSettings.biometricsRow"
        icon={biometryIcon(kind)}
        title={t.biometricsRow}
        subtitle={bioText(t, "biometricsRowDesc", kind)}
        onPress={onBiometrics}
      />

      <DisableAllModal
        t={t}
        visible={confirmingDisableAll}
        onCancel={() => setConfirmingDisableAll(false)}
        onConfirm={() => {
          setConfirmingDisableAll(false);
          onToggleTwoFactor(false);
        }}
      />
    </StatusScreen>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(2,3,15,0.72)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  sheet: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: tokens.sheetSurface,
    borderRadius: metrics.radius.card,
    borderWidth: 1,
    borderColor: tokens.glassBorderStrong,
    padding: spacing.xl,
    alignItems: "center",
  },
  badge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.warningSurface,
    marginBottom: spacing.md,
  },
  title: {
    ...textStyles.sectionTitle,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  message: {
    ...textStyles.caption,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  actions: {
    width: "100%",
    gap: spacing.sm,
  },
});
