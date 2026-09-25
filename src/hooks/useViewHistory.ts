import { useCallback, useRef, useState } from "react";
import { BackHandler } from "react-native";

import { useMountEffect } from "./useMountEffect";
import { ViewName } from "../types/app";

/** Raices de la navegacion: sin pantalla anterior, el atras cierra la app. */
const ROOT_VIEWS = new Set<ViewName>(["welcome", "login", "dashboard"]);

/**
 * Vistas de antes de iniciar sesion. Al Login se vuelve conservando el
 * historial solo desde ellas; desde cualquier otra (cerrar sesion, sesion
 * vencida) el historial se borra, para que "atras" no regrese a una pantalla
 * de la cuenta.
 */
const PRE_AUTH_VIEWS = new Set<ViewName>(["welcome", "register", "forgotAccessCode", "recoverAccess"]);

/** Pantallas de paso: no se guardan como destino de "atras". */
const TRANSIENT_VIEWS = new Set<ViewName>(["transferProcessing"]);

/** Mientras estan visibles, el atras no hace nada (hay una operacion en curso). */
const BLOCKED_VIEWS = new Set<ViewName>(["transferProcessing"]);

/**
 * Destinos fijos: resultados de una operacion, a los que no se debe "volver"
 * repitiendo el paso anterior (p. ej. reenviar una transferencia ya hecha).
 */
const BACK_TO: Partial<Record<ViewName, ViewName>> = {
  transferSuccess: "dashboard",
  transferFailed: "dashboard",
  beneficiaryAdded: "beneficiaries",
};

/**
 * Vista actual con historial y atras de Android.
 *
 * - `setView` guarda la vista de la que sales; si vas a una que ya estaba en el
 *   historial, lo recorta hasta ahi (igual que pulsar el boton de regreso).
 * - El atras vuelve a la vista anterior. Sin vista anterior no lo atiende, y
 *   Android cierra la app.
 *
 * Las pantallas con pasos internos se registran aparte con `useHardwareBack`;
 * al montarse despues, atienden el atras antes que este historial.
 */
export function useViewHistory(initial: ViewName) {
  const [view, setViewState] = useState<ViewName>(initial);
  const viewRef = useRef<ViewName>(initial);
  const historyRef = useRef<ViewName[]>([]);

  const setView = useCallback((next: ViewName) => {
    const current = viewRef.current;
    if (next === current) return;

    const history = historyRef.current;
    const startsOver =
      next === "dashboard" ||
      next === "welcome" ||
      (next === "login" && !PRE_AUTH_VIEWS.has(current));

    if (startsOver) {
      historyRef.current = [];
    } else {
      const seenAt = history.lastIndexOf(next);
      if (seenAt !== -1) {
        historyRef.current = history.slice(0, seenAt);
      } else if (!TRANSIENT_VIEWS.has(current)) {
        historyRef.current = [...history, current];
      }
    }

    viewRef.current = next;
    setViewState(next);
  }, []);

  useMountEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      const current = viewRef.current;
      if (BLOCKED_VIEWS.has(current)) return true;

      const fixed = BACK_TO[current];
      if (fixed) {
        setView(fixed);
        return true;
      }

      const previous = historyRef.current[historyRef.current.length - 1];
      if (previous) {
        setView(previous);
        return true;
      }

      // Sin pantalla anterior: en las raices Android cierra la app; en
      // cualquier otra, lo mas cercano a "atras" es el inicio.
      if (ROOT_VIEWS.has(current)) return false;
      setView("dashboard");
      return true;
    });
    return () => subscription.remove();
  });

  return [view, setView] as const;
}
