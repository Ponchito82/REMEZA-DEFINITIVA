import React from "react";
import { CircleCheck, KeyRound, Mail, MessageSquareMore, ShieldCheck } from "lucide-react-native";

import { InfoCard, ListRow, StatusScreen } from "../../components/ui";
import type { BiometryKind } from "../../services/biometrics";
import type { TwoFactorMethod } from "../../services/securitySettings";
import { bioText, biometryIcon } from "./biometryKind";

type Props = {
  t: any;
  /** Aviso tras cambiar el codigo de acceso */
  codeChanged: boolean;
  onBack: () => void;
  onChangeAccessCode: () => void;
  onBiometrics: () => void;
  kind: BiometryKind;
  /** SMS y correo electronico: funciones de verificacion independientes entre si. */
  methods: Record<TwoFactorMethod, boolean>;
  /** Activa o desactiva un metodo directo desde su switch, sin entrar a otra pantalla. */
  onToggleMethod: (method: TwoFactorMethod, value: boolean) => void;
  /** Aviso tras activar o desactivar un metodo */
  methodNotice: { method: TwoFactorMethod; enabled: boolean } | null;
};

/**
 * Seguridad: metodos de verificacion (pantalla 57). Codigo SMS y correo
 * electronico son funciones independientes, cada una con su propio switch y
 * su propia pantalla de activacion; ya no forman un bloque de "verificacion
 * en dos pasos". Se suman dos accesos: cambiar el codigo de acceso (58) y
 * biometria (10).
 */
export default function TwoFactorSettingsScreen({
  t,
  codeChanged,
  onBack,
  onChangeAccessCode,
  onBiometrics,
  kind,
  methods,
  onToggleMethod,
  methodNotice,
}: Props) {
  const noticeText = !methodNotice
    ? ""
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
      backTourId="securityBack"
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
    </StatusScreen>
  );
}
