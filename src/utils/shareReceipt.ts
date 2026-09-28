import { RefObject, useCallback, useRef } from "react";
import { View } from "react-native";
import { captureRef } from "react-native-view-shot";
import Share from "react-native-share";
import { RECEIPT_IMAGE_WIDTH } from "../components/ui/ReceiptCard";

/** Tamano en dp de la vista, tal como quedo dibujada. */
function measureView(target: View): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    target.measure((_x, _y, width, height) => {
      if (width > 0 && height > 0) resolve({ width, height });
      else reject(new Error("el comprobante no tiene tamano"));
    });
  });
}

/**
 * Convierte el comprobante en una imagen PNG y abre el menu de compartir.
 * Si el usuario cierra el menu sin compartir no es un error.
 *
 * La imagen sale siempre a `RECEIPT_IMAGE_WIDTH` px de ancho con la misma
 * proporcion de la vista. `ReceiptCard` ya dibuja la copia a ese ancho en
 * pixeles nativos, asi que aqui el reescalado es solo un ajuste de redondeo y
 * no una ampliacion (que en una pantalla de baja densidad saldria borrosa).
 */
export async function shareReceiptImage(
  target: RefObject<View | null>,
  fileName: string,
): Promise<void> {
  if (!target.current) return;

  try {
    const { width, height } = await measureView(target.current);
    const uri = await captureRef(target, {
      format: "png",
      quality: 1,
      result: "tmpfile",
      fileName,
      width: RECEIPT_IMAGE_WIDTH,
      height: Math.round((RECEIPT_IMAGE_WIDTH * height) / width),
    });
    await Share.open({
      url: uri,
      type: "image/png",
      filename: fileName,
      failOnCancel: false,
    });
  } catch (error) {
    console.warn("[receipt] no se pudo compartir el comprobante", error);
  }
}

/** Ref para el `ReceiptCard` y la funcion que lo comparte como imagen. */
export function useReceiptShare(fileName: string) {
  const ref = useRef<View>(null);
  const share = useCallback(() => shareReceiptImage(ref, fileName), [fileName]);
  return { ref, share };
}
