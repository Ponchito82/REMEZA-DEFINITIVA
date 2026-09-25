export type CountryCode = "MX" | "US";

export type GeoOption = {
  label: string;
  value: string;
};

export type StateRecord = {
  code: string;
  name: string;
  postalRanges: [number, number][];
  cities: string[];
};

export type CountryDetection =
  | { status: "detected"; country: CountryCode }
  | { status: "ambiguous"; candidates: CountryCode[] }
  | { status: "unknown" };

export type PostalLookup =
  | { status: "found"; stateCode: string; cities: string[] }
  | { status: "notFound" };

export interface GeoProvider {
  /** Estado y ciudades que corresponden a un codigo postal de 5 digitos */
  lookupPostalCode(country: CountryCode, postalCode: string): Promise<PostalLookup>;
  getStates(country: CountryCode): Promise<GeoOption[]>;
  getCities(country: CountryCode, stateCode: string): Promise<GeoOption[]>;
  getStateByPostalCode(country: CountryCode, postalCode: string): Promise<GeoOption | null>;
  detectCountry(postalCode: string): Promise<CountryDetection>;
}
