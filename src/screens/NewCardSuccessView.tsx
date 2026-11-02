import React from "react";

import { CardGeneratingAnimation } from "../components/remeza";
import { useHardwareBack } from "../hooks/useHardwareBack";
import type { VirtualCardColor } from "../components/remeza";

type Props = {
  t: any;
  color: VirtualCardColor;
  /** Al terminar la animacion se pasa directo a "Mis tarjetas virtuales". */
  onViewCards: () => void;
};

/**
 * Tarjeta virtual creada: solo la animacion de generacion. Al terminar lleva
 * a la pantalla de tarjetas, sin pantalla de resumen intermedia.
 */
export default function NewCardSuccessView({ t, color, onViewCards }: Props) {
  // Mientras se genera, atras de Android no hace nada.
  useHardwareBack(() => true);

  return (
    <CardGeneratingAnimation
      testID="newCardGenerating"
      color={color}
      title={t.newCardGenerating}
      subtitle={t.newCardGeneratingSub}
      onDone={onViewCards}
    />
  );
}
