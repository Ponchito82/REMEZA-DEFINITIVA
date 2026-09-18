export type ActivateCardRequest = {
  cardId: string;
  customerId: string;
};

export type ActivateCardResponse = {
  cardId: string;
  status: "active" | "pending" | "failed";
  activatedAt: string;
};

export async function activateCard(request: ActivateCardRequest): Promise<ActivateCardResponse> {
  await new Promise((resolve) => setTimeout(() => resolve(undefined), 500));

  return {
    cardId: request.cardId,
    status: "active",
    activatedAt: new Date().toISOString(),
  };
}
