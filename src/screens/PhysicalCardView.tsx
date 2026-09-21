import React, { useCallback } from "react";
import { ScrollView, View, Text, Pressable } from "react-native";
import { X, Truck, AlertCircle } from "lucide-react-native";

import { styles } from "../theme/styles";
import { PURPLE } from "../theme/colors";
import MainButton from "../components/MainButton";
import AddressFields, {
  ADDRESS_FIELD_KEYS,
  AddressDetail,
} from "../components/AddressFields";
import { Language, ViewName } from "../types/app";
import { AddressValue } from "../hooks/useAddressCascade";
import { useFormFocus } from "../hooks/useFormFocus";
import { isValidPostalCode } from "../utils/postalCode";
import { isCountryCode } from "../services/geo";

type Props = {
  t: any;
  language: Language;
  setView: (view: ViewName) => void;

  physicalAddress1: string;
  setPhysicalAddress1: (v: string) => void;

  physicalAddress2: string;
  setPhysicalAddress2: (v: string) => void;

  physicalCity: string;
  setPhysicalCity: (v: string) => void;

  physicalState: string;
  setPhysicalState: (v: string) => void;

  physicalZip: string;
  setPhysicalZip: (v: string) => void;

  physicalCountry: string;
  setPhysicalCountry: (v: string) => void;

  physicalAddressDetail: AddressDetail;
  setPhysicalAddressDetail: (patch: Partial<AddressDetail>) => void;

  physicalCardRequested: boolean;
  handlePhysicalCardSubmit: () => void;
};

export default function PhysicalCardView({
  t,
  language,
  setView,
  physicalAddress1,
  setPhysicalAddress1,
  physicalAddress2,
  setPhysicalAddress2,
  physicalCity,
  setPhysicalCity,
  physicalState,
  setPhysicalState,
  physicalZip,
  setPhysicalZip,
  physicalCountry,
  setPhysicalCountry,
  physicalAddressDetail,
  setPhysicalAddressDetail,
  physicalCardRequested,
  handlePhysicalCardSubmit,
}: Props) {
  const form = useFormFocus();

  const addressValue: AddressValue = {
    postalCode: physicalZip,
    country: physicalCountry,
    stateCode: physicalState,
    city: physicalCity,
  };

  const handleAddressChange = useCallback(
    (patch: Partial<AddressValue>) => {
      if (patch.postalCode !== undefined) setPhysicalZip(patch.postalCode);
      if (patch.country !== undefined) setPhysicalCountry(patch.country);
      if (patch.stateCode !== undefined) setPhysicalState(patch.stateCode);
      if (patch.city !== undefined) setPhysicalCity(patch.city);
    },
    [setPhysicalZip, setPhysicalCountry, setPhysicalState, setPhysicalCity],
  );

  const handleComposedAddress = useCallback(
    (line1: string, line2: string) => {
      setPhysicalAddress1(line1);
      setPhysicalAddress2(line2);
    },
    [setPhysicalAddress1, setPhysicalAddress2],
  );

  const country = isCountryCode(physicalCountry) ? physicalCountry : null;

  const handleSubmit = () => {
    const isValid = form.validate([
      {
        key: ADDRESS_FIELD_KEYS.postalCode,
        valid: isValidPostalCode(physicalZip, country),
        message: t.requiredPostalCode,
      },
      { key: ADDRESS_FIELD_KEYS.country, valid: !!country, message: t.requiredCountry },
      { key: ADDRESS_FIELD_KEYS.state, valid: !!physicalState, message: t.requiredState },
      { key: ADDRESS_FIELD_KEYS.city, valid: !!physicalCity, message: t.requiredCity },
      {
        key: ADDRESS_FIELD_KEYS.street,
        valid: physicalAddressDetail.street.trim().length > 0,
        message: t.requiredStreet,
      },
      {
        key: ADDRESS_FIELD_KEYS.exteriorNumber,
        valid: physicalAddressDetail.exteriorNumber.trim().length > 0,
        message: t.requiredExteriorNumber,
      },
    ]);

    if (!isValid) return;
    handlePhysicalCardSubmit();
  };

  return (
    <View style={styles.pageScreen}>
      <ScrollView
        ref={form.scrollRef}
        contentContainerStyle={styles.pageContent}
        showsVerticalScrollIndicator={false}
      >
        <View ref={form.contentRef} collapsable={false}>
          <Pressable
            testID="physicalCard-backButton"
            onPress={() => setView("dashboard")}
            style={styles.backButton}
          >
            <X size={24} color="#111827" />
          </Pressable>

          <Text style={styles.pageTitle}>{t.physicalCardTitle}</Text>
          <Text style={styles.pageSubtitle}>{t.physicalCardSubtitle}</Text>

          {!physicalCardRequested ? (
            <View style={styles.stack16}>
              <AddressFields
                t={t}
                language={language}
                testIDPrefix="physicalCard"
                value={addressValue}
                onChange={handleAddressChange}
                detail={physicalAddressDetail}
                onDetailChange={setPhysicalAddressDetail}
                onComposedAddressChange={handleComposedAddress}
                form={form}
              />

              {form.pendingMessage ? (
                <View style={styles.formBanner} testID="physicalCard-validationBanner">
                  <AlertCircle size={18} color="#B91C1C" />
                  <Text style={styles.formBannerText}>{form.pendingMessage}</Text>
                </View>
              ) : null}

              <MainButton testID="physicalCard-saveAddressButton" onPress={handleSubmit}>
                {t.saveAddress}
              </MainButton>
            </View>
          ) : (
            <View style={styles.statusCard}>
              <View style={styles.statusIcon}>
                <Truck size={28} color={PURPLE} />
              </View>

              <Text style={styles.statusTitle}>{t.deliveryInProgress}</Text>
              <Text style={styles.statusText}>{t.deliveryMessage}</Text>

              <View style={styles.statusInfoBox}>
                <Text style={styles.statusInfoLabel}>{t.cardShippedTo}</Text>
                <Text style={styles.statusInfoValue}>
                  {[
                    physicalAddress1,
                    physicalAddress2,
                    physicalCity,
                    physicalState,
                    physicalZip,
                    physicalCountry,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </Text>
              </View>

              <View style={styles.statusInfoBox}>
                <Text style={styles.statusInfoLabel}>{t.status}</Text>
                <Text style={styles.statusInfoValue}>{t.pendingShipment}</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
