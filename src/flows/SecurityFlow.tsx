import React, { useEffect, useState } from "react";

import TwoFactorSettingsScreen from "../screens/security/TwoFactorSettingsScreen";
import ChangeAccessCodeScreen from "../screens/security/ChangeAccessCodeScreen";
import EnableBiometricsScreen from "../screens/security/EnableBiometricsScreen";
import BiometricsEnabledScreen from "../screens/security/BiometricsEnabledScreen";
import BiometricsFailedScreen from "../screens/security/BiometricsFailedScreen";
import {
  changeAccessCode,
  enableBiometrics,
  getTwoFactorEnabled,
  setTwoFactorEnabled,
} from "../services/securitySettings";
import { useStepStack } from "../hooks/useStepStack";

type Step = "settings" | "changeCode" | "biometrics" | "biometricsEnabled" | "biometricsFailed";

type Props = {
  t: any;
  onExit: () => void;
  onHome: () => void;
};

/** Seguridad: dos pasos (57), codigo de acceso (58) y biometria (10, 11, 26). */
export default function SecurityFlow({ t, onExit, onHome }: Props) {
  const { step, push, replace, reset, pop } = useStepStack<Step>("settings", onExit);
  const [twoFactor, setTwoFactor] = useState(true);
  const [codeChanged, setCodeChanged] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getTwoFactorEnabled().then(setTwoFactor);
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

  const handleEnableBiometrics = async () => {
    setBusy(true);
    const result = await enableBiometrics();
    setBusy(false);
    replace(result.ok ? "biometricsEnabled" : "biometricsFailed");
  };

  switch (step) {
    case "changeCode":
      return (
        <ChangeAccessCodeScreen t={t} saving={busy} onBack={pop} onSubmit={handleChangeCode} />
      );
    case "biometrics":
      return (
        <EnableBiometricsScreen
          t={t}
          enabling={busy}
          onBack={pop}
          onEnable={handleEnableBiometrics}
        />
      );
    case "biometricsEnabled":
      return <BiometricsEnabledScreen t={t} onContinue={() => reset("settings")} />;
    case "biometricsFailed":
      return (
        <BiometricsFailedScreen
          t={t}
          retrying={busy}
          onRetry={handleEnableBiometrics}
          onUseAccessCode={() => reset("settings")}
          onHome={onHome}
        />
      );
    default:
      return (
        <TwoFactorSettingsScreen
          t={t}
          twoFactorEnabled={twoFactor}
          onToggleTwoFactor={handleToggleTwoFactor}
          codeChanged={codeChanged}
          onBack={pop}
          onChangeAccessCode={() => {
            setCodeChanged(false);
            push("changeCode");
          }}
          onBiometrics={() => push("biometrics")}
        />
      );
  }
}
