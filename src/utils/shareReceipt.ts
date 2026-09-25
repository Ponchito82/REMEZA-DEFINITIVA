import { RefObject, useCallback, useRef } from "react";
import { View } from "react-native";
import { captureRef } from "react-native-view-shot";
import Share from "react-native-share";

/**
 * Convierte el comprobante en una imagen PNG y abre el menu de compartir.
 * Si el usuario cierra el menu sin compartir no es un error.
 */
export async function shareReceiptImage(
  target: RefObject<View | null>,
  fileName: string,
): Promise<void> {
  if (!target.current) return;

  try {
    const uri = await captureRef(target, {
      format: "png",
      quality: 1,
      result: "tmpfile",
      fileName,
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
