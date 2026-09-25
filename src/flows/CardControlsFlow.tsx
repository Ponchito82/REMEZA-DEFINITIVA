import React, { useEffect, useState } from "react";

import CardLimitsScreen from "../screens/card/CardLimitsScreen";
import DeleteCardScreen from "../screens/card/DeleteCardScreen";
import { MOCK_CARD } from "../mocks/remeza";
import { getCard, removeCard, saveSpendingLimit } from "../services/cardControls";
import { useStepStack } from "../hooks/useStepStack";

export type CardEntry = "limits" | "delete";
type Step = CardEntry;

type Props = {
  t: any;
  entry: CardEntry;
  /** La tarjeta se elimino */
  onRemoved: () => void;
  onExit: () => void;
};

/**
 * Tarjeta: limites (47) y eliminar (50). El bloqueo ya no es una pantalla:
 * se hace desde la fila "Ver datos" del Home.
 */
export default function CardControlsFlow({ t, entry, onRemoved, onExit }: Props) {
  const { step, pop } = useStepStack<Step>(entry, onExit);
  const [card, setCard] = useState(MOCK_CARD);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getCard().then(setCard);
  }, []);

  const handleSaveLimit = async (amount: number) => {
    setBusy(true);
    const result = await saveSpendingLimit(amount);
    setBusy(false);
    if (result.ok) {
      setCard((prev) => ({ ...prev, spendingLimit: amount }));
      setSaved(true);
    }
  };

  const handleDelete = async () => {
    setBusy(true);
    const result = await removeCard();
    setBusy(false);
    if (result.ok) onRemoved();
  };

  switch (step) {
    case "delete":
      return (
        <DeleteCardScreen
          t={t}
          last4={card.last4}
          deleting={busy}
          onBack={pop}
          onConfirm={handleDelete}
        />
      );
    default:
      return (
        <CardLimitsScreen
          t={t}
          initialLimit={card.spendingLimit}
          minLimit={card.minLimit}
          maxLimit={card.maxLimit}
          saving={busy}
          saved={saved}
          onBack={pop}
          onSave={handleSaveLimit}
        />
      );
  }
}
