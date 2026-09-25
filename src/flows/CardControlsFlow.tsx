import React, { useEffect, useState } from "react";

import CardLimitsScreen from "../screens/card/CardLimitsScreen";
import BlockCardConfirmScreen from "../screens/card/BlockCardConfirmScreen";
import CardBlockedScreen from "../screens/card/CardBlockedScreen";
import DeleteCardScreen from "../screens/card/DeleteCardScreen";
import { MOCK_CARD } from "../mocks/remeza";
import { blockCard, getCard, removeCard, saveSpendingLimit } from "../services/cardControls";
import { useStepStack } from "../hooks/useStepStack";

export type CardEntry = "limits" | "block" | "delete";
type Step = CardEntry | "blocked";

type Props = {
  t: any;
  entry: CardEntry;
  /** La tarjeta quedo bloqueada: el Home la muestra apagada */
  onBlocked: () => void;
  /** La tarjeta se elimino */
  onRemoved: () => void;
  onExit: () => void;
};

/**
 * Tarjeta: limites (47), bloqueo (48 -> 49) y eliminar (50). No toca el
 * Detalle de tarjeta ni el modal "Activar tarjeta" del Home.
 */
export default function CardControlsFlow({ t, entry, onBlocked, onRemoved, onExit }: Props) {
  const { step, replace, pop } = useStepStack<Step>(entry, onExit);
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

  const handleBlock = async () => {
    setBusy(true);
    const result = await blockCard();
    setBusy(false);
    if (result.ok) {
      onBlocked();
      replace("blocked");
    }
  };

  const handleDelete = async () => {
    setBusy(true);
    const result = await removeCard();
    setBusy(false);
    if (result.ok) onRemoved();
  };

  switch (step) {
    case "block":
      return (
        <BlockCardConfirmScreen
          t={t}
          last4={card.last4}
          blocking={busy}
          onBack={pop}
          onConfirm={handleBlock}
        />
      );
    case "blocked":
      return <CardBlockedScreen t={t} last4={card.last4} onDone={onExit} />;
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
