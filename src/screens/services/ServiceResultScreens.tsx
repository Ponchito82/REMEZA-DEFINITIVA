import React from "react";
import { Check, CircleX, FileText, LoaderCircle, Share2 } from "lucide-react-native";

import { InfoCard, KeyValueCard, ReceiptCard, StatusScreen } from "../../components/ui";
import type { KeyValueItem, ReceiptData } from "../../components/ui";
import { useReceiptShare } from "../../utils/shareReceipt";

/** Procesando pago de servicio (pantalla 53). */
export function ServiceProcessingScreen({ t }: { t: any }) {
  return (
    <StatusScreen
      testID="serviceProcessing"
      icon={LoaderCircle}
      iconSpinning
      iconSpinInner
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
      secondary={{
        testID: "servicePaid.receiptButton",
        title: t.viewReceipt,
        onPress: onViewReceipt,
        filled: true,
      }}
    >
      <KeyValueCard items={summary} />
    </StatusScreen>
  );
}

/** Comprobante de pago (pantalla 55): imagen del comprobante y boton para compartirla. */
export function ServiceReceiptScreen({
  t,
  data,
  onBack,
}: {
  t: any;
  data: ReceiptData;
  onBack: () => void;
}) {
  const { ref, share } = useReceiptShare("remeza-comprobante-pago");

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
        testID: "serviceReceipt.shareButton",
        title: t.commonShare,
        iconLeft: Share2,
        onPress: share,
      }}
    >
      <ReceiptCard
        ref={ref}
        testID="serviceReceipt.card"
        data={data}
        title={t.receiptCardTitle}
        statusLabel={t.receiptSuccess}
        footer={t.receiptFooter}
      />
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
