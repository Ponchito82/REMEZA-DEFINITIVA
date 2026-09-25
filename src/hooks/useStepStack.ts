import { useCallback, useState } from "react";

import { useHardwareBack } from "./useHardwareBack";

/**
 * Pila de pasos para los flujos de varias pantallas. `pop` en la raiz llama a
 * `onExit`, asi que el boton de atras de la primera pantalla sale del flujo.
 *
 * El atras de Android hace lo mismo que el boton de la pantalla: `pop`. Con
 * `blockBack` se ignora en los pasos donde hay una operacion en curso.
 */
export function useStepStack<Step extends string>(
  initial: Step,
  onExit: () => void,
  blockBack?: (step: Step) => boolean,
) {
  const [stack, setStack] = useState<Step[]>([initial]);

  const push = useCallback((step: Step) => setStack((prev) => [...prev, step]), []);

  /** Sustituye el paso actual: pantallas de resultado que no deben volver atras. */
  const replace = useCallback(
    (step: Step) => setStack((prev) => [...prev.slice(0, -1), step]),
    [],
  );

  /** Vuelve a un solo paso, descartando el historial. */
  const reset = useCallback((step: Step) => setStack([step]), []);

  const pop = useCallback(() => {
    if (stack.length <= 1) {
      onExit();
      return;
    }
    setStack((prev) => prev.slice(0, -1));
  }, [stack.length, onExit]);

  const step = stack[stack.length - 1];

  useHardwareBack(() => {
    if (blockBack?.(step)) return true;
    pop();
    return true;
  });

  return { step, push, replace, reset, pop };
}
