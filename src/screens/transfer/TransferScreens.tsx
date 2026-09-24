import React from "react";
import { Check, CircleAlert, Download, FileText, Send, Share2 } from "lucide-react-native";

import { InfoCard, StatusScreen } from "../../components/ui";
import { Language } from "../../types/app";
import TransferDetails, { TransferSummary } from "./TransferDetails";

type Base = {
  t: any;
  language: Language;
  summary: TransferSummary;
};

/** Procesando transferencia (pantalla 41). */
export function TransferProcessingScreen({ t, language, summary }: Base) {
  return (
    <StatusScreen
      testID="transferProcessing"
      icon={Send}
      iconSpinning
      title={t.processingTransferTitle}
      subtitle={t.processingTransferSubtitle}
    >
      <TransferDetails
        t={t}
        language={language}
        summary={summary}
        fields={["beneficiary", "bank", "amount", "date"]}
        amountLabel={t.amountLabel}
        testIDPrefix="transferProcessing"
      />
      <InfoCard text={t.notifyWhenDone} />
    </StatusScreen>
  );
}

/** Transferencia exitosa (pantalla 42). */
export function TransferSuccessScreen({
  t,
  language,
  summary,
  onViewReceipt,
  onDone,
}: Base & { onViewReceipt: () => void; onDone: () => void }) {
  return (
    <StatusScreen
      testID="transferSuccess"
      icon={Check}
      iconVariant="ring"
      iconTone="success"
      title={t.transferSuccessTitle}
      subtitle={t.transferSuccessSubtitle}
      primary={{ testID: "transferSuccess.receiptButton", title: t.viewReceipt, onPress: onViewReceipt }}
      secondary={{ testID: "transferSuccess.doneButton", title: t.commonDone, onPress: onDone }}
    >
      <TransferDetails
        t={t}
        language={language}
        summary={summary}
        fields={["beneficiary", "bank", "amount", "received", "date", "folio"]}
        amountLabel={t.amountSent}
        testIDPrefix="transferSuccess"
      />
    </StatusScreen>
  );
}

/** Comprobante de transferencia (pantalla 43). */
export function TransferReceiptScreen({
  t,
  language,
  summary,
  onBack,
  onShare,
}: Base & { onBack: () => void; onShare: () => void }) {
  return (
    <StatusScreen
      testID="transferReceipt"
      showBack
      onBack={onBack}
      backTestID="transferReceipt.backButton"
      backAccessibilityLabel={t.back}
      icon={FileText}
      title={t.receiptTitle}
      subtitle={t.receiptSubtitle}
      primary={{
        testID: "transferReceipt.saveButton",
        title: t.saveReceipt,
        iconLeft: Download,
        onPress: onShare,
      }}
      secondary={{
        testID: "transferReceipt.shareButton",
        title: t.shareReceipt,
        iconLeft: Share2,
        onPress: onShare,
      }}
    >
      <TransferDetails
        t={t}
        language={language}
        summary={summary}
        fields={["beneficiary", "bank", "clabe", "amount", "rate", "received", "date", "folio"]}
        amountLabel={t.amountSent}
        testIDPrefix="transferReceipt"
      />
      <InfoCard text={t.receiptInfo} />
    </StatusScreen>
  );
}

/** Transferencia fallida (pantalla 44). */
export function TransferFailedScreen({
  t,
  language,
  summary,
  reason,
  onRetry,
  onHome,
}: Base & { reason: string; onRetry: () => void; onHome: () => void }) {
  return (
    <StatusScreen
      testID="transferFailed"
      icon={CircleAlert}
      iconVariant="ring"
      iconTone="danger"
      title={t.transferFailedTitle}
      subtitle={t.transferFailedSubtitle}
      primary={{ testID: "transferFailed.retryButton", title: t.commonTryAgain, onPress: onRetry }}
      secondary={{ testID: "transferFailed.homeButton", title: t.commonBackToHome, onPress: onHome }}
    >
      <TransferDetails
        t={t}
        language={language}
        summary={summary}
        fields={["beneficiary", "bank", "amount", "date"]}
        amountLabel={t.attemptedAmount}
        testIDPrefix="transferFailed"
      />
      <InfoCard
        testID="transferFailed.reasonCard"
        icon={CircleAlert}
        tone="danger"
        title={t.rejectionReason}
        text={reason}
      />
    </StatusScreen>
  );
}
