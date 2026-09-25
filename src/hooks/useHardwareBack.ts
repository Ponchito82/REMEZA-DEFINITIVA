import { useEffect, useRef } from "react";
import { BackHandler } from "react-native";

/**
 * Atiende el boton/gesto de atras de Android. El `handler` devuelve `true`
 * cuando ya atendio el evento y `false` para dejarlo pasar al siguiente
 * (al historial de vistas de `App` y, al final, al cierre de la app).
 *
 * BackHandler llama primero al ultimo suscrito: lo que se monta despues (una
 * pantalla con pasos) tiene prioridad sobre lo que se monto antes (`App`).
 * El handler se guarda en un ref para suscribirse una sola vez y no perder
 * ese orden en cada render.
 */
export function useHardwareBack(handler: () => boolean, enabled = true) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!enabled) return;
    const subscription = BackHandler.addEventListener("hardwareBackPress", () =>
      handlerRef.current(),
    );
    return () => subscription.remove();
  }, [enabled]);
}
