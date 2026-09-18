import React, { useEffect } from "react";
import { View, Text } from "react-native";
import FormInput from "./FormInput";
import SearchableSelect from "./SearchableSelect";
import { styles } from "../theme/styles";
import { Language } from "../types/app";
import { countryOptions } from "../services/geo";
import { POSTAL_CODE_EXAMPLES, POSTAL_CODE_MAX_LENGTH } from "../utils/postalCode";
import { AddressValue, useAddressCascade } from "../hooks/useAddressCascade";
import { useFormFocus } from "../hooks/useFormFocus";

export type AddressDetail = {
  street: string;
  exteriorNumber: string;
  interiorNumber: string;
  neighborhood: string;
  references: string;
};

export const EMPTY_ADDRESS_DETAIL: AddressDetail = {
  street: "",
  exteriorNumber: "",
  interiorNumber: "",
  neighborhood: "",
  references: "",
};

export const ADDRESS_FIELD_KEYS = {
  postalCode: "postalCode",
  country: "country",
  state: "state",
  city: "city",
  street: "street",
  exteriorNumber: "exteriorNumber",
} as const;

type Props = {
  t: any;
  language: Language;
  testIDPrefix: string;
  value: AddressValue;
  onChange: (patch: Partial<AddressValue>) => void;
  detail: AddressDetail;
  onDetailChange: (patch: Partial<AddressDetail>) => void;
  onComposedAddressChange?: (line1: string, line2: string) => void;
  form: ReturnType<typeof useFormFocus>;
};

function composeAddressLines(
  detail: AddressDetail,
  country: "MX" | "US" | null,
): { line1: string; line2: string } {
  const { street, exteriorNumber, interiorNumber, neighborhood, references } = detail;

  if (country === "US") {
    const line1 = [exteriorNumber, street].filter(Boolean).join(" ").trim();
    const line2 = [interiorNumber ? `Apt ${interiorNumber}` : "", references]
      .filter(Boolean)
      .join(", ")
      .trim();
    return { line1, line2 };
  }

  const line1 = [street, exteriorNumber, interiorNumber ? `Int. ${interiorNumber}` : ""]
    .filter(Boolean)
    .join(" ")
    .trim();
  const line2 = [neighborhood ? `Col. ${neighborhood}` : "", references]
    .filter(Boolean)
    .join(", ")
    .trim();
  return { line1, line2 };
}

export default function AddressFields({
  t,
  language,
  testIDPrefix,
  value,
  onChange,
  detail,
  onDetailChange,
  onComposedAddressChange,
  form,
}: Props) {
  const cascade = useAddressCascade({ value, onChange });
  const { country } = cascade;

  useEffect(() => {
    if (!onComposedAddressChange) return;
    const { line1, line2 } = composeAddressLines(detail, country);
    onComposedAddressChange(line1, line2);
  }, [detail, country, onComposedAddressChange]);

  const isMexico = country === "MX";
  const postalExample = country ? POSTAL_CODE_EXAMPLES[country] : POSTAL_CODE_EXAMPLES.MX;
  const highlighted = (key: string) => form.pendingField === key;

  return (
    <View style={styles.stack16}>
      <View ref={form.anchor(ADDRESS_FIELD_KEYS.postalCode)} collapsable={false}>
        <FormInput
          testID={`${testIDPrefix}-zipCodeInput`}
          label={t.zipCode}
          placeholder={`${t.exampleShort} ${postalExample}`}
          value={value.postalCode}
          onChangeText={cascade.setPostalCode}
          keyboardType="number-pad"
          maxLength={country ? POSTAL_CODE_MAX_LENGTH[country] : 10}
          inputRef={form.input(ADDRESS_FIELD_KEYS.postalCode)}
          highlighted={highlighted(ADDRESS_FIELD_KEYS.postalCode)}
          error={
            highlighted(ADDRESS_FIELD_KEYS.postalCode) ? form.pendingMessage : ""
          }
        />
        {value.postalCode.length > 0 && !cascade.postalCodeValid ? (
          <Text style={styles.fieldHintText}>{t.postalCodeHint}</Text>
        ) : null}
        {cascade.detection === "ambiguous" ? (
          <Text style={styles.fieldHintText}>{t.countryAmbiguousHint}</Text>
        ) : null}
        {cascade.detection === "unknown" && cascade.postalCodeValid ? (
          <Text style={styles.fieldHintText}>{t.countryUnknownHint}</Text>
        ) : null}
      </View>

      <View ref={form.anchor(ADDRESS_FIELD_KEYS.country)} collapsable={false}>
        <SearchableSelect
          testID={`${testIDPrefix}-countrySelect`}
          label={t.country}
          placeholder={t.selectCountry}
          searchPlaceholder={t.searchCountry}
          emptyResultsText={t.noResults}
          value={value.country}
          options={countryOptions(language)}
          onSelect={cascade.setCountry}
          highlighted={highlighted(ADDRESS_FIELD_KEYS.country)}
          error={highlighted(ADDRESS_FIELD_KEYS.country) ? form.pendingMessage : ""}
        />
      </View>

      <View ref={form.anchor(ADDRESS_FIELD_KEYS.state)} collapsable={false}>
        <SearchableSelect
          testID={`${testIDPrefix}-stateSelect`}
          label={t.state}
          placeholder={t.selectState}
          searchPlaceholder={t.searchState}
          emptyResultsText={t.noResults}
          value={value.stateCode}
          options={cascade.states}
          disabled={!cascade.isStateEnabled}
          disabledHint={!cascade.isStateEnabled ? t.stateDisabledHint : ""}
          onSelect={cascade.setStateCode}
          highlighted={highlighted(ADDRESS_FIELD_KEYS.state)}
          error={highlighted(ADDRESS_FIELD_KEYS.state) ? form.pendingMessage : ""}
        />
      </View>

      <View ref={form.anchor(ADDRESS_FIELD_KEYS.city)} collapsable={false}>
        <SearchableSelect
          testID={`${testIDPrefix}-citySelect`}
          label={t.city}
          placeholder={t.selectCity}
          searchPlaceholder={t.searchCity}
          emptyResultsText={t.noResults}
          value={value.city}
          options={cascade.cities}
          disabled={!cascade.isCityEnabled}
          disabledHint={!cascade.isCityEnabled ? t.cityDisabledHint : ""}
          onSelect={cascade.setCity}
          highlighted={highlighted(ADDRESS_FIELD_KEYS.city)}
          error={highlighted(ADDRESS_FIELD_KEYS.city) ? form.pendingMessage : ""}
        />
      </View>

      <View ref={form.anchor(ADDRESS_FIELD_KEYS.street)} collapsable={false}>
        <FormInput
          testID={`${testIDPrefix}-streetInput`}
          label={t.street}
          placeholder={isMexico ? t.streetExampleMx : t.streetExampleUs}
          value={detail.street}
          onChangeText={(text) => onDetailChange({ street: text })}
          maxLength={100}
          inputRef={form.input(ADDRESS_FIELD_KEYS.street)}
          highlighted={highlighted(ADDRESS_FIELD_KEYS.street)}
          error={highlighted(ADDRESS_FIELD_KEYS.street) ? form.pendingMessage : ""}
        />
      </View>

      <View style={styles.row2}>
        <View style={styles.flex1} ref={form.anchor(ADDRESS_FIELD_KEYS.exteriorNumber)} collapsable={false}>
          <FormInput
            testID={`${testIDPrefix}-exteriorNumberInput`}
            label={t.exteriorNumber}
            placeholder={isMexico ? "123" : "1600"}
            value={detail.exteriorNumber}
            onChangeText={(text) => onDetailChange({ exteriorNumber: text })}
            maxLength={12}
            inputRef={form.input(ADDRESS_FIELD_KEYS.exteriorNumber)}
            highlighted={highlighted(ADDRESS_FIELD_KEYS.exteriorNumber)}
            error={highlighted(ADDRESS_FIELD_KEYS.exteriorNumber) ? form.pendingMessage : ""}
          />
        </View>

        <View style={styles.flex1}>
          <FormInput
            testID={`${testIDPrefix}-interiorNumberInput`}
            label={isMexico ? t.interiorNumber : t.aptSuite}
            placeholder={isMexico ? `${t.optional} · 4B` : `${t.optional} · Apt 4B`}
            value={detail.interiorNumber}
            onChangeText={(text) => onDetailChange({ interiorNumber: text })}
            maxLength={12}
          />
        </View>
      </View>

      {isMexico ? (
        <FormInput
          testID={`${testIDPrefix}-neighborhoodInput`}
          label={t.neighborhood}
          placeholder={t.neighborhoodExample}
          value={detail.neighborhood}
          onChangeText={(text) => onDetailChange({ neighborhood: text })}
          maxLength={80}
        />
      ) : null}

      <FormInput
        testID={`${testIDPrefix}-referencesInput`}
        label={t.addressReferences}
        placeholder={`${t.optional} · ${isMexico ? t.referencesExampleMx : t.referencesExampleUs}`}
        value={detail.references}
        onChangeText={(text) => onDetailChange({ references: text })}
        maxLength={120}
      />
    </View>
  );
}
