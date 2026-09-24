/** Latencia simulada de los servicios que todavia devuelven mocks. */
export const mockDelay = (ms = 600) => new Promise<void>((resolve) => setTimeout(resolve, ms));
