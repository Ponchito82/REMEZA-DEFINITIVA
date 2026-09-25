import React from "react";
import {
  CircleCheck,
  FileText,
  Fingerprint,
  KeyRound,
  Mail,
  MessageSquareMore,
  ShieldCheck,
  Smartphone,
} from "lucide-react-native";

import { InfoCard, ListRow, StatusScreen } from "../../components/ui";

type Props = {
  t: any;
  twoFactorEnabled: boolean;
  onToggleTwoFactor: (value: boolean) => void;
  /** Aviso tras cambiar el codigo de acceso */
  codeChanged: boolean;
  onBack: () => void;
  onChangeAccessCode: () => void;
  onBiometrics: () => void;
};

/**
 * Seguridad: verificacion en dos pasos (pantalla 57). Los metodos (app, SMS,
 * correo, codigos de respaldo) se muestran como informativos: el PDF no trae
 * pantallas para configurarlos. Se suman dos accesos: cambiar el codigo de
 * acceso (58) y biometria (10).
 */
export default function TwoFactorSettingsScreen({
  t,
  twoFactorEnabled,
  onToggleTwoFactor,
  codeChanged,
  onBack,
  onChangeAccessCode,
  onBiometrics,
}: Props) {
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
        onToggle={onToggleTwoFactor}
      />
      <ListRow bareIcon icon={Smartphone} title={t.authApp} subtitle={t.authAppDesc} right="none" />
      <ListRow
        bareIcon
        icon={MessageSquareMore}
        title={t.twoFactorSms}
        subtitle={t.twoFactorSmsDesc}
        right="none"
      />
      <ListRow
        bareIcon
        icon={Mail}
        title={t.twoFactorEmail}
        subtitle={t.twoFactorEmailDesc}
        right="none"
      />
      <ListRow
        bareIcon
        icon={FileText}
        title={t.backupCodes}
        subtitle={t.backupCodesDesc}
        right="none"
      />
      <ListRow
        testID="twoFactorSettings.changeCodeRow"
        icon={KeyRound}
        title={t.changeAccessCodeRow}
        subtitle={t.changeAccessCodeRowDesc}
        onPress={onChangeAccessCode}
      />
      <ListRow
        testID="twoFactorSettings.biometricsRow"
        icon={Fingerprint}
        title={t.biometricsRow}
        subtitle={t.biometricsRowDesc}
        onPress={onBiometrics}
      />
    </StatusScreen>
  );
}
