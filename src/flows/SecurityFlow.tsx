import React, { useEffect, useState } from "react";

import TwoFactorSettingsScreen from "../screens/security/TwoFactorSettingsScreen";
import ChangeAccessCodeScreen from "../screens/security/ChangeAccessCodeScreen";
import EnableBiometricsScreen from "../screens/security/EnableBiometricsScreen";
import BiometricsEnabledScreen from "../screens/security/BiometricsEnabledScreen";
import BiometricsFailedScreen from "../screens/security/BiometricsFailedScreen";
import TwoFactorMethodScreen from "../screens/security/TwoFactorMethodScreen";
import TwoFactorCodeScreen from "../screens/security/TwoFactorCodeScreen";
import {
  changeAccessCode,
  enableBiometrics,
  getTwoFactorEnabled,
  getTwoFactorMethods,
  sendTwoFactorCode,
  setTwoFactorEnabled,
  setTwoFactorMethod,
  TwoFactorMethod,
  verifyTwoFactorCode,
} from "../services/securitySettings";
import { useStepStack } from "../hooks/useStepStack";
import { defaultBiometryKind, getBiometryKind } from "../services/biometrics";
import { bioText } from "../screens/security/biometryKind";

type Step =
  | "settings"
  | "changeCode"
  | "biometrics"
  | "biometricsEnabled"
  | "biometricsFailed"
  | "method"
  | "methodCode";

type Props = {
  t: any;
  onExit: () => void;
  onHome: () => void;
  /** Telefono y correo de la cuenta, a donde llegan los codigos de cada metodo */
  phone?: string;
  email?: string;
  /** "biometrics" para entrar directo, p. ej. desde el aviso del dashboard. */
  initialStep?: Step;
  /** Adonde ir tras activar o fallar la biometria si se entro directo (`initialStep`). Por defecto vuelve a "settings". */
  onBiometricsResolved?: () => void;
};

/** Seguridad: dos pasos (57), codigo de acceso (58) y biometria (10, 11, 26). */
export default function SecurityFlow({
  t,
  onExit,
  onHome,
  phone = "",
  email = "",
  initialStep = "settings",
  onBiometricsResolved,
}: Props) {
  const { step, push, replace, reset, pop } = useStepStack<Step>(initialStep, onExit);
  const finishBiometrics = onBiometricsResolved ?? (() => reset("settings"));
  const [twoFactor, setTwoFactor] = useState(true);
  const [codeChanged, setCodeChanged] = useState(false);
  const [busy, setBusy] = useState(false);
  /** Face ID en iOS, huella en Android; se afina con lo que reporte el sensor */
  const [kind, setKind] = useState(defaultBiometryKind);
  /** El fallo fue por falta de sensor o de rostro/huella registrados */
  const [unavailable, setUnavailable] = useState(false);
  const [methods, setMethods] = useState<Record<TwoFactorMethod, boolean>>({ sms: true, email: false });
  const [method, setMethod] = useState<TwoFactorMethod>("sms");
  const [destinations, setDestinations] = useState<Record<TwoFactorMethod, string>>({
    sms: phone,
    email,
  });
  const [wrongCode, setWrongCode] = useState(false);
  const [methodNotice, setMethodNotice] = useState<
    { method: TwoFactorMethod; enabled: boolean; switched?: boolean } | null
  >(null);

  useEffect(() => {
    getTwoFactorEnabled().then(setTwoFactor);
    getBiometryKind().then(setKind);
    getTwoFactorMethods().then(setMethods);
  }, []);

  const handleToggleTwoFactor = async (value: boolean) => {
    setTwoFactor(value);
    setTwoFactor(await setTwoFactorEnabled(value));
  };

  const handleChangeCode = async (current: string, next: string) => {
    setBusy(true);
    const result = await changeAccessCode(current, next);
    setBusy(false);
    if (result.ok) {
      setCodeChanged(true);
      reset("settings");
    }
  };

  /**
   * Prender el switch de un metodo redirige a su pantalla para enviar y
   * verificar el codigo antes de dejarlo activo. Apagarlo es directo: nunca
   * deja los dos inactivos, si el otro ya estaba apagado se enciende solo.
   */
  const handleToggleMethod = (target: TwoFactorMethod, value: boolean) => {
    setCodeChanged(false);

    if (value) {
      setMethod(target);
      setMethodNotice(null);
      push("method");
      return;
    }

    handleDisableMethod(target);
  };

  const handleDisableMethod = async (target: TwoFactorMethod) => {
    setBusy(true);
    const otherMethod: TwoFactorMethod = target === "sms" ? "email" : "sms";
    let next = await setTwoFactorMethod(target, false);
    const switched = !next[otherMethod];
    if (switched) {
      next = await setTwoFactorMethod(otherMethod, true);
    }
    setMethods(next);
    setBusy(false);
    setMethodNotice({ method: target, enabled: false, switched });
  };

  const handleSendMethodCode = async (destination: string) => {
    setBusy(true);
    await sendTwoFactorCode(method, destination);
    setBusy(false);
    setDestinations((prev) => ({ ...prev, [method]: destination }));
    setWrongCode(false);
    push("methodCode");
  };

  const handleVerifyMethodCode = async (code: string) => {
    setBusy(true);
    const result = await verifyTwoFactorCode(method, destinations[method], code);
    if (!result.ok) {
      setBusy(false);
      setWrongCode(true);
      return;
    }
    setMethods(await setTwoFactorMethod(method, true));
    setBusy(false);
    setMethodNotice({ method, enabled: true });
    reset("settings");
  };

  const handleEnableBiometrics = async () => {
    setBusy(true);
    const result = await enableBiometrics(bioText(t, "bioPrompt", kind), t.cancel);
    setBusy(false);
    if (result.ok) return replace("biometricsEnabled");
    // Si cerro el aviso del sistema se queda donde estaba, sin pantalla de error.
    if (result.reason === "cancelled") return;
    setUnavailable(result.reason === "unavailable");
    replace("biometricsFailed");
  };

  switch (step) {
    case "changeCode":
      return (
        <ChangeAccessCodeScreen t={t} saving={busy} onBack={pop} onSubmit={handleChangeCode} />
      );
    case "method":
      return (
        <TwoFactorMethodScreen
          t={t}
          method={method}
          destination={destinations[method]}
          sending={busy}
          onBack={pop}
          onSend={handleSendMethodCode}
        />
      );
    case "methodCode":
      return (
        <TwoFactorCodeScreen
          t={t}
          method={method}
          destination={destinations[method]}
          verifying={busy}
          wrongCode={wrongCode}
          onBack={pop}
          onVerify={handleVerifyMethodCode}
          onResend={() => {
            setWrongCode(false);
            sendTwoFactorCode(method, destinations[method]);
          }}
        />
      );
    case "biometrics":
      return (
        <EnableBiometricsScreen
          t={t}
          kind={kind}
          enabling={busy}
          onBack={pop}
          onEnable={handleEnableBiometrics}
        />
      );
    case "biometricsEnabled":
      return <BiometricsEnabledScreen t={t} kind={kind} onContinue={finishBiometrics} />;
    case "biometricsFailed":
      return (
        <BiometricsFailedScreen
          t={t}
          kind={kind}
          unavailable={unavailable}
          retrying={busy}
          onRetry={handleEnableBiometrics}
          onUseAccessCode={finishBiometrics}
          onHome={onHome}
        />
      );
    default:
      return (
        <TwoFactorSettingsScreen
          t={t}
          kind={kind}
          methods={methods}
          onToggleMethod={handleToggleMethod}
          methodNotice={methodNotice}
          twoFactorEnabled={twoFactor}
          onToggleTwoFactor={handleToggleTwoFactor}
          codeChanged={codeChanged}
          onBack={pop}
          onChangeAccessCode={() => {
            setCodeChanged(false);
            setMethodNotice(null);
            push("changeCode");
          }}
          onBiometrics={() => push("biometrics")}
        />
      );
  }
}
