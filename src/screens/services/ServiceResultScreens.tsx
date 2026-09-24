import React from "react";
import { Check, CircleX, Download, FileText, LoaderCircle, Share2 } from "lucide-react-native";

import { InfoCard, KeyValueCard, StatusScreen } from "../../components/ui";
import type { KeyValueItem } from "../../components/ui";

/** Procesando pago de servicio (pantalla 53). */
export function ServiceProcessingScreen({ t }: { t: any }) {
  return (
    <StatusScreen
      testID="serviceProcessing"
      icon={LoaderCircle}
      iconSpinning
      title={t.servicePayingTitle}
      subtitle={t.servicePayingSubtitle}
    >
      <InfoCard text={t.servicePayingInfo} />
    </StatusScreen>
  );
}

/** ¡Pago exitoso! (pantalla 54). El enlace lleva al comprobante (55). */
export function ServicePaidScreen({
  t,
  summary,
  onDone,
  onViewReceipt,
}: {
  t: any;
  summary: KeyValueItem[];
  onDone: () => void;
  onViewReceipt: () => void;
}) {
  return (
    <StatusScreen
      testID="servicePaid"
      icon={Check}
      iconVariant="ring"
      title={t.servicePaidTitle}
      subtitle={t.servicePaidSubtitle}
      primary={{ testID: "servicePaid.doneButton", title: t.commonDone, onPress: onDone }}
      link={{ testID: "servicePaid.receiptLink", title: t.viewReceipt, onPress: onViewReceipt }}
    >
      <KeyValueCard items={summary} />
    </StatusScreen>
  );
}

/** Comprobante de pago (pantalla 55). */
export function ServiceReceiptScreen({
  t,
  summary,
  onBack,
  onShare,
}: {
  t: any;
  summary: KeyValueItem[];
  onBack: () => void;
  onShare: () => void;
}) {
  return (
    <StatusScreen
      testID="serviceReceipt"
      showBack
      onBack={onBack}
      backTestID="serviceReceipt.backButton"
      backAccessibilityLabel={t.back}
      icon={FileText}
      title={t.serviceReceiptTitle}
      subtitle={t.servicePaidSubtitle}
      primary={{
        testID: "serviceReceipt.downloadButton",
        title: t.downloadReceipt,
        iconLeft: Download,
        onPress: onShare,
      }}
      secondary={{
        testID: "serviceReceipt.shareButton",
        title: t.commonShare,
        iconLeft: Share2,
        onPress: onShare,
      }}
    >
      <KeyValueCard items={summary} />
    </StatusScreen>
  );
}

/** No se pudo realizar el pago (pantalla 56). */
export function ServicePaymentFailedScreen({
  t,
  onRetry,
  onBack,
}: {
  t: any;
  onRetry: () => void;
  onBack: () => void;
}) {
  return (
    <StatusScreen
      testID="serviceFailed"
      icon={CircleX}
      iconVariant="ring"
      iconTone="danger"
      title={t.serviceFailedTitle}
      subtitle={t.serviceFailedSubtitle}
      primary={{ testID: "serviceFailed.retryButton", title: t.commonRetry, onPress: onRetry }}
      secondary={{ testID: "serviceFailed.backButton", title: t.commonGoBack, onPress: onBack }}
    >
      <InfoCard text={t.serviceFailedInfo} />
    </StatusScreen>
  );
}
