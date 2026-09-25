import { EffectCallback, useEffect } from "react";

/** `useEffect` que corre una sola vez, al montar. */
export function useMountEffect(effect: EffectCallback) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, []);
}
