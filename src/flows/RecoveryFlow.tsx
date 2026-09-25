import React, { useState } from "react";

import RecoverAccessScreen from "../screens/recovery/RecoverAccessScreen";
import type { RecoveryMethod } from "../screens/recovery/RecoverAccessScreen";
import RecoverAccountScreen from "../screens/recovery/RecoverAccountScreen";
import EnterEmailCodeScreen from "../screens/recovery/EnterEmailCodeScreen";
import WrongCodeScreen from "../screens/recovery/WrongCodeScreen";
import NewAccessCodeScreen from "../screens/recovery/NewAccessCodeScreen";
import AccessCodeUpdatedScreen from "../screens/recovery/AccessCodeUpdatedScreen";
import {
  requestEmailRecoveryCode,
  resetAccessCodeByEmail,
  verifyEmailRecoveryCode,
} from "../services/accessRecovery";
import { useStepStack } from "../hooks/useStepStack";

type Step = "options" | "email" | "code" | "wrongCode" | "newCode" | "done";

type Props = {
  t: any;
  /** Recuperacion por telefono: la pantalla que ya existia */
  onByPhone: () => void;
  onSupport: () => void;
  onSignIn: () => void;
  onHome: () => void;
  onExit: () => void;
};

/**
 * Recupera tu acceso (21) y la via por correo: 20, 22, 25, 23 y 24. La via
 * por telefono sigue siendo `ForgotAccessCodeView`.
 */
export default function RecoveryFlow({ t, onByPhone, onSupport, onSignIn, onHome, onExit }: Props) {
  const { step, push, replace, reset, pop } = useStepStack<Step>("options", onExit);
  const [email, setEmail] = useState("");
  const [verifiedCode, setVerifiedCode] = useState("");
  const [busy, setBusy] = useState(false);

  const handleChoose = (method: RecoveryMethod) => {
    if (method === "phone") return onByPhone();
    if (method === "support") return onSupport();
    push("email");
  };

  const handleSend = async (value: string) => {
    setBusy(true);
    await requestEmailRecoveryCode(value);
    setBusy(false);
    setEmail(value);
    push("code");
  };

  const handleVerify = async (code: string) => {
    setBusy(true);
    const result = await verifyEmailRecoveryCode(email, code);
    setBusy(false);
    if (result.ok) {
      setVerifiedCode(code);
      reset("newCode");
    } else {
      replace("wrongCode");
    }
  };

  const handleResend = () => {
    requestEmailRecoveryCode(email);
  };

  const handleNewCode = async (newCode: string) => {
    setBusy(true);
    await resetAccessCodeByEmail(email, verifiedCode, newCode);
    setBusy(false);
    reset("done");
  };

  switch (step) {
    case "email":
      return (
        <RecoverAccountScreen
          t={t}
          sending={busy}
          onBack={pop}
          onSend={handleSend}
          onSupport={onSupport}
        />
      );
    case "code":
      return (
        <EnterEmailCodeScreen
          t={t}
          email={email}
          verifying={busy}
          onBack={pop}
          onVerify={handleVerify}
          onResend={handleResend}
        />
      );
    case "wrongCode":
      return (
        <WrongCodeScreen
          t={t}
          verifying={busy}
          onBack={pop}
          onRetry={handleVerify}
          onResend={handleResend}
        />
      );
    case "newCode":
      return <NewAccessCodeScreen t={t} saving={busy} onSubmit={handleNewCode} />;
    case "done":
      return <AccessCodeUpdatedScreen t={t} onSignIn={onSignIn} onHome={onHome} />;
    default:
      return <RecoverAccessScreen t={t} onBack={pop} onChoose={handleChoose} />;
  }
}
