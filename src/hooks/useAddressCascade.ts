import { useCallback, useEffect, useRef, useState } from "react";
import { CountryCode, GeoOption, geo } from "../services/geo";
import { isValidPostalCode, postalCodeBase, sanitizePostalCodeInput } from "../utils/postalCode";

/** Quienes envian estan en Estados Unidos: es el unico pais de direccion. */
export const ADDRESS_COUNTRY: CountryCode = "US";

export type AddressValue = {
  postalCode: string;
  country: string;
  stateCode: string;
  city: string;
};

type Params = {
  value: AddressValue;
  onChange: (patch: Partial<AddressValue>) => void;
};

/** Resultado de la ultima consulta del codigo postal */
export type PostalLookupStatus = "idle" | "loading" | "found" | "notFound";

export type AddressCascade = {
  states: GeoOption[];
  cities: GeoOption[];
  lookupStatus: PostalLookupStatus;
  postalCodeValid: boolean;
  isStateEnabled: boolean;
  isCityEnabled: boolean;
  setPostalCode: (raw: string) => void;
  setStateCode: (code: string) => void;
  setCity: (city: string) => void;
};

export function useAddressCascade({ value, onChange }: Params): AddressCascade {
  const postalCodeValid = isValidPostalCode(value.postalCode, ADDRESS_COUNTRY);
  const zip5 = postalCodeValid ? postalCodeBase(value.postalCode) : "";

  const [states, setStates] = useState<GeoOption[]>([]);
  const [lookupCities, setLookupCities] = useState<string[]>([]);
  const [lookupStateCode, setLookupStateCode] = useState("");
  const [stateCities, setStateCities] = useState<string[]>([]);
  const [lookupStatus, setLookupStatus] = useState<PostalLookupStatus>("idle");

  // La API y el estado local cambian de identidad en cada render del padre;
  // el efecto de consulta solo debe reaccionar al codigo postal.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (value.country !== ADDRESS_COUNTRY) onChangeRef.current({ country: ADDRESS_COUNTRY });
  }, [value.country]);

  useEffect(() => {
    let active = true;
    geo.getStates(ADDRESS_COUNTRY).then((options) => {
      if (active) setStates(options);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!zip5) {
      setLookupCities([]);
      setLookupStateCode("");
      setLookupStatus("idle");
      return;
    }

    let active = true;
    setLookupStatus("loading");

    geo.lookupPostalCode(ADDRESS_COUNTRY, zip5).then((result) => {
      if (!active) return;

      if (result.status === "notFound") {
        setLookupCities([]);
        setLookupStateCode("");
        setLookupStatus("notFound");
        return;
      }

      setLookupCities(result.cities);
      setLookupStateCode(result.stateCode);
      setLookupStatus("found");
      onChangeRef.current({
        stateCode: result.stateCode,
        city: result.cities.length === 1 ? result.cities[0] : "",
      });
    });

    return () => {
      active = false;
    };
  }, [zip5]);

  // Si la persona corrige el estado a mano, las ciudades del ZIP ya no aplican
  // y se ofrecen las del estado elegido.
  useEffect(() => {
    if (!value.stateCode || value.stateCode === lookupStateCode) {
      setStateCities([]);
      return;
    }

    let active = true;
    geo.getCities(ADDRESS_COUNTRY, value.stateCode).then((options) => {
      if (active) setStateCities(options.map((option) => option.value));
    });
    return () => {
      active = false;
    };
  }, [value.stateCode, lookupStateCode]);

  const cityNames = value.stateCode && value.stateCode === lookupStateCode ? lookupCities : stateCities;
  const cities: GeoOption[] = cityNames.map((city) => ({ label: city, value: city }));

  const setPostalCode = useCallback(
    (raw: string) => {
      const sanitized = sanitizePostalCodeInput(raw, ADDRESS_COUNTRY);
      if (sanitized === value.postalCode) return;

      // Agregar o quitar el +4 no cambia el ZIP de 5 digitos: conserva estado y ciudad.
      if (postalCodeBase(sanitized) === postalCodeBase(value.postalCode)) {
        onChangeRef.current({ postalCode: sanitized });
        return;
      }

      onChangeRef.current({ postalCode: sanitized, stateCode: "", city: "" });
    },
    [value.postalCode],
  );

  const setStateCode = useCallback(
    (code: string) => {
      if (code === value.stateCode) return;
      onChangeRef.current({ stateCode: code, city: "" });
    },
    [value.stateCode],
  );

  const setCity = useCallback((city: string) => {
    onChangeRef.current({ city });
  }, []);

  const lookupReady = postalCodeValid && lookupStatus !== "notFound";

  return {
    states,
    cities,
    lookupStatus,
    postalCodeValid,
    isStateEnabled: lookupReady,
    isCityEnabled: lookupReady && !!value.stateCode && cities.length > 0,
    setPostalCode,
    setStateCode,
    setCity,
  };
}
