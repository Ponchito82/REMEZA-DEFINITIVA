import React, { useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Truck } from "lucide-react-native";

import { typography } from "../theme/typography";
import { spacing, screenPadding } from "../theme/spacing";
import MainButton from "../components/MainButton";
import {
  CloseButton,
  GlassBanner,
  GlassCard,
  IconCircle,
  ScreenHeader,
} from "../components/ui";
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
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        ref={form.scrollRef}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View ref={form.contentRef} collapsable={false}>
          <CloseButton
            testID="physicalCard-backButton"
            onPress={() => setView("dashboard")}
          />

          <ScreenHeader
            title={t.physicalCardTitle}
            subtitle={t.physicalCardSubtitle}
            style={styles.header}
          />

          {!physicalCardRequested ? (
            <View style={styles.form}>
              <AddressFields
                t={t}
                language={language}
                testIDPrefix="physicalCard"
                withIcons
                value={addressValue}
                onChange={handleAddressChange}
                detail={physicalAddressDetail}
                onDetailChange={setPhysicalAddressDetail}
                onComposedAddressChange={handleComposedAddress}
                form={form}
              />

              {form.pendingMessage ? (
                <GlassBanner
                  testID="physicalCard-validationBanner"
                  message={form.pendingMessage}
                />
              ) : null}

              <MainButton testID="physicalCard-saveAddressButton" onPress={handleSubmit}>
                {t.saveAddress}
              </MainButton>
            </View>
          ) : (
            <View style={styles.status}>
              <IconCircle icon={Truck} size={72} glow />

              <Text style={[typography.h2, styles.statusTitle]}>{t.deliveryInProgress}</Text>
              <Text style={[typography.body, styles.statusText]}>{t.deliveryMessage}</Text>

              <GlassCard style={styles.statusCard}>
                <Text style={typography.label}>{t.cardShippedTo}</Text>
                <Text style={[typography.bodyStrong, styles.statusValue]}>
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
              </GlassCard>

              <GlassCard style={styles.statusCard}>
                <Text style={typography.label}>{t.status}</Text>
                <Text style={[typography.bodyStrong, styles.statusValue]}>
                  {t.pendingShipment}
                </Text>
              </GlassCard>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: screenPadding,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginTop: spacing.xxl,
  },
  form: {
    gap: spacing.lg,
  },
  status: {
    alignItems: "center",
    gap: spacing.md,
  },
  statusTitle: {
    marginTop: spacing.lg,
    textAlign: "center",
  },
  statusText: {
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  statusCard: {
    width: "100%",
  },
  statusValue: {
    marginTop: spacing.xs,
  },
});
