import { useCallback, useState } from "react";

/**
 * Pila de pasos para los flujos de varias pantallas. `pop` en la raiz llama a
 * `onExit`, asi que el boton de atras de la primera pantalla sale del flujo.
 */
export function useStepStack<Step extends string>(initial: Step, onExit: () => void) {
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

  return { step: stack[stack.length - 1], push, replace, reset, pop };
}
