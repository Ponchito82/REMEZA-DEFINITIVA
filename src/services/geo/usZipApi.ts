/**
 * Consulta de codigos postales de Estados Unidos contra Zippopotam.us: API
 * publica y gratuita, sin llave. Solo cubre EE. UU., que es de donde envian
 * los clientes de Remeza.
 *
 * https://api.zippopotam.us/us/{zip5}
 */
const ZIP_API_URL = "https://api.zippopotam.us/us";
const REQUEST_TIMEOUT_MS = 6000;

export type UsZipData = {
  stateCode: string;
  stateName: string;
  cities: string[];
};

export type UsZipResult =
  | { status: "found"; data: UsZipData }
  /** El servicio respondio 404: ese ZIP no existe */
  | { status: "notFound" }
  /** Sin red, timeout o error del servicio: el llamador decide el respaldo */
  | { status: "error" };

type ZippopotamPlace = {
  "place name": string;
  state: string;
  "state abbreviation": string;
};

type ZippopotamResponse = {
  places?: ZippopotamPlace[];
};

const cache = new Map<string, UsZipData>();

export async function lookupUsZip(zip5: string): Promise<UsZipResult> {
  if (!/^\d{5}$/.test(zip5)) return { status: "notFound" };

  const cached = cache.get(zip5);
  if (cached) return { status: "found", data: cached };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${ZIP_API_URL}/${zip5}`, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    if (response.status === 404) return { status: "notFound" };
    if (!response.ok) return { status: "error" };

    const body = (await response.json()) as ZippopotamResponse;
    const places = body.places ?? [];
    if (places.length === 0) return { status: "notFound" };

    const cities = Array.from(new Set(places.map((place) => place["place name"]))).sort((a, b) =>
      a.localeCompare(b),
    );

    const data: UsZipData = {
      stateCode: places[0]["state abbreviation"],
      stateName: places[0].state,
      cities,
    };

    cache.set(zip5, data);
    return { status: "found", data };
  } catch {
    return { status: "error" };
  } finally {
    clearTimeout(timeout);
  }
}
