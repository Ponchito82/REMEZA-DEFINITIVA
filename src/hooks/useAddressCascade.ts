import { useCallback, useEffect, useRef, useState } from "react";
import { CountryCode, CountryDetection, GeoOption, geo, isCountryCode } from "../services/geo";
import { isValidPostalCode, postalCodeBase, sanitizePostalCodeInput } from "../utils/postalCode";

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

export type AddressCascade = {
  states: GeoOption[];
  cities: GeoOption[];
  detection: CountryDetection["status"] | "idle";
  country: CountryCode | null;
  postalCodeValid: boolean;
  isStateEnabled: boolean;
  isCityEnabled: boolean;
  setPostalCode: (raw: string) => void;
  setCountry: (code: string) => void;
  setStateCode: (code: string) => void;
  setCity: (city: string) => void;
};

export function useAddressCascade({ value, onChange }: Params): AddressCascade {
  const country = isCountryCode(value.country) ? value.country : null;
  const postalCodeValid = isValidPostalCode(value.postalCode, country);

  const [states, setStates] = useState<GeoOption[]>([]);
  const [cities, setCities] = useState<GeoOption[]>([]);
  const [detection, setDetection] = useState<CountryDetection["status"] | "idle">("idle");

  const manualCountryRef = useRef(false);
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!isValidPostalCode(value.postalCode, country)) {
      setDetection("idle");
      return;
    }

    const requestId = ++requestIdRef.current;

    geo.detectCountry(value.postalCode).then((result) => {
      if (requestId !== requestIdRef.current) return;

      setDetection(result.status);

      if (result.status === "detected" && !manualCountryRef.current && result.country !== country) {
        onChange({ country: result.country, stateCode: "", city: "" });
      }
    });
  }, [value.postalCode, country, onChange]);

  useEffect(() => {
    if (!country) {
      setStates([]);
      return;
    }

    let active = true;
    geo.getStates(country).then((options) => {
      if (active) setStates(options);
    });

    return () => {
      active = false;
    };
  }, [country]);

  useEffect(() => {
    if (!country || !value.stateCode) {
      setCities([]);
      return;
    }

    let active = true;
    geo.getCities(country, value.stateCode).then((options) => {
      if (active) setCities(options);
    });

    return () => {
      active = false;
    };
  }, [country, value.stateCode]);

  useEffect(() => {
    if (!country || !postalCodeValid || value.stateCode) return;

    let active = true;
    geo.getStateByPostalCode(country, postalCodeBase(value.postalCode)).then((option) => {
      if (active && option) onChange({ stateCode: option.value, city: "" });
    });

    return () => {
      active = false;
    };
  }, [country, postalCodeValid, value.postalCode, value.stateCode, onChange]);

  const setPostalCode = useCallback(
    (raw: string) => {
      const sanitized = sanitizePostalCodeInput(raw, country);
      if (sanitized === value.postalCode) return;

      manualCountryRef.current = false;
      onChange({ postalCode: sanitized, stateCode: "", city: "" });
    },
    [country, value.postalCode, onChange],
  );

  const setCountry = useCallback(
    (code: string) => {
      if (code === value.country) return;
      manualCountryRef.current = true;
      onChange({ country: code, stateCode: "", city: "" });
    },
    [value.country, onChange],
  );

  const setStateCode = useCallback(
    (code: string) => {
      if (code === value.stateCode) return;
      onChange({ stateCode: code, city: "" });
    },
    [value.stateCode, onChange],
  );

  const setCity = useCallback(
    (city: string) => {
      onChange({ city });
    },
    [onChange],
  );

  return {
    states,
    cities,
    detection,
    country,
    postalCodeValid,
    isStateEnabled: postalCodeValid && !!country,
    isCityEnabled: postalCodeValid && !!country && !!value.stateCode,
    setPostalCode,
    setCountry,
    setStateCode,
    setCity,
  };
}
