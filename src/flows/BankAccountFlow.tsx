import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import LinkBankScreen from "../screens/bank/LinkBankScreen";
import BankConnectedScreen from "../screens/bank/BankConnectedScreen";
import LinkBankFailedScreen from "../screens/bank/LinkBankFailedScreen";
import LinkedBankAccountScreen from "../screens/bank/LinkedBankAccountScreen";
import UnlinkBankConfirmScreen from "../screens/bank/UnlinkBankConfirmScreen";
import { BankAccount } from "../mocks/remeza";
import { getLinkedBankAccount, linkBankAccount, unlinkBankAccount } from "../services/bankAccounts";
import { useStepStack } from "../hooks/useStepStack";
import { tokens } from "../theme/colors";
import { Language } from "../types/app";

type Step = "loading" | "link" | "connected" | "failed" | "linked" | "unlink";

type Props = {
  t: any;
  language: Language;
  onExit: () => void;
};

/**
 * Metodos de pago: vincular (6), conectado (7), fallo (27), vinculada (28) y
 * desvincular (29). Arranca en 28 si ya hay cuenta y en 6 si no.
 */
export default function BankAccountFlow({ t, language, onExit }: Props) {
  const { step, push, replace, reset, pop } = useStepStack<Step>("loading", onExit);
  const [account, setAccount] = useState<BankAccount | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    getLinkedBankAccount().then((linked) => {
      if (!alive) return;
      setAccount(linked);
      reset(linked ? "linked" : "link");
    });
    return () => {
      alive = false;
    };
  }, [reset]);

  const handleLink = async () => {
    setBusy(true);
    const result = await linkBankAccount();
    setBusy(false);
    if (result.ok) {
      setAccount(result.account);
      replace("connected");
    } else {
      replace("failed");
    }
  };

  const handleUnlink = async () => {
    setBusy(true);
    await unlinkBankAccount();
    setBusy(false);
    setAccount(null);
    reset("link");
  };

  if (step === "loading") {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={tokens.violetBright} />
      </View>
    );
  }

  if (step === "failed") {
    return (
      <LinkBankFailedScreen
        t={t}
        retrying={busy}
        onRetry={handleLink}
        onCheckDetails={() => reset("link")}
      />
    );
  }

  if (account && step === "connected") {
    return (
      <BankConnectedScreen
        t={t}
        language={language}
        account={account}
        onBack={onExit}
        onContinue={() => reset("linked")}
      />
    );
  }

  if (account && step === "linked") {
    return (
      <LinkedBankAccountScreen
        t={t}
        account={account}
        onBack={pop}
        onUnlink={() => push("unlink")}
      />
    );
  }

  if (account && step === "unlink") {
    return (
      <UnlinkBankConfirmScreen
        t={t}
        account={account}
        unlinking={busy}
        onConfirm={handleUnlink}
        onCancel={pop}
      />
    );
  }

  return <LinkBankScreen t={t} linking={busy} onBack={pop} onLink={handleLink} />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
