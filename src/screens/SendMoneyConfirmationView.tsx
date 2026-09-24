import React from "react";
import { Info, Send } from "lucide-react-native";

import { InfoCard, StatusScreen } from "../components/ui";
import TransferDetails, { TransferSummary } from "./transfer/TransferDetails";
import { Language, ViewName } from "../types/app";

type Props = {
  t: any;
  language: Language;
  setView: (view: ViewName) => void;
  summary: TransferSummary;
  /** Confirma: pasa a "Procesando transferencia" */
  handleSendMoney: () => void;
};

/**
 * Revisar transferencia (pantalla 40). Todavia no se cobra nada: el envio
 * ocurre al confirmar. El aviso es el de la app (30 minutos para cancelar),
 * no el del PDF, que decia que no se podia cancelar.
 */
export default function SendMoneyConfirmationView({
  t,
  language,
  setView,
  summary,
  handleSendMoney,
}: Props) {
  return (
    <StatusScreen
      testID="reviewTransfer"
      showBack
      onBack={() => setView("dashboard")}
      backTestID="sendMoneyConfirmation-backButton"
      backAccessibilityLabel={t.back}
      icon={Send}
      title={t.reviewTransferTitle}
      subtitle={t.reviewTransferSubtitle}
      primary={{
        testID: "sendMoneyConfirmation-confirmButton",
        title: t.confirmTransfer,
        onPress: handleSendMoney,
      }}
      secondary={{
        testID: "reviewTransfer.cancelButton",
        title: t.cancel,
        onPress: () => setView("sendMoney"),
      }}
    >
      <TransferDetails
        t={t}
        language={language}
        summary={summary}
        fields={["beneficiary", "bank", "clabe", "amount", "rate", "received", "date"]}
        amountLabel={t.amountToSendUsd}
        onEditAmount={() => setView("sendMoney")}
        testIDPrefix="reviewTransfer"
      />
      <InfoCard icon={Info} text={t.sendMoneyConfirmationSubtitle} />
    </StatusScreen>
  );
}
