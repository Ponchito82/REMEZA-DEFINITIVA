import React from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { User, MapPin, Building2, Mail, CreditCard } from "lucide-react-native";

import FormInput from "../components/FormInput";
import MainButton from "../components/MainButton";
import PhoneField from "../components/PhoneField";
import { CloseButton, GlassBanner, ScreenHeader } from "../components/ui";
import { spacing, screenPadding } from "../theme/spacing";
import { Language, ViewName } from "../types/app";
import { CountryCode } from "../services/geo";
import { isValidNationalPhone } from "../utils/phone";
import { isValidEmail, isValidPersonName } from "../utils/validation";
import { useFormFocus } from "../hooks/useFormFocus";

type Props = {
  t: any;
  language: Language;
  setView: (view: ViewName) => void;

  beneficiaryFirstName: string;
  setBeneficiaryFirstName: (value: string) => void;

  beneficiaryPaternalLastName: string;
  setBeneficiaryPaternalLastName: (value: string) => void;

  beneficiaryMaternalLastName: string;
  setBeneficiaryMaternalLastName: (value: string) => void;

  beneficiaryPhone: string;
  setBeneficiaryPhone: (value: string) => void;

  beneficiaryPhoneCountry: CountryCode;
  setBeneficiaryPhoneCountry: (value: CountryCode) => void;

  beneficiaryResidenceState: string;
  setBeneficiaryResidenceState: (value: string) => void;

  beneficiaryResidenceCity: string;
  setBeneficiaryResidenceCity: (value: string) => void;

  beneficiaryEmail: string;
  setBeneficiaryEmail: (value: string) => void;

  beneficiaryClabe: string;
  setBeneficiaryClabe: (value: string) => void;

  beneficiarySaved: boolean;
  handleBeneficiarySave: () => void;
};

export default function BeneficiariesView({
  t,
  language,
  setView,
  beneficiaryFirstName,
  setBeneficiaryFirstName,
  beneficiaryPaternalLastName,
  setBeneficiaryPaternalLastName,
  beneficiaryMaternalLastName,
  setBeneficiaryMaternalLastName,
  beneficiaryPhone,
  setBeneficiaryPhone,
  beneficiaryPhoneCountry,
  setBeneficiaryPhoneCountry,
  beneficiaryResidenceState,
  setBeneficiaryResidenceState,
  beneficiaryResidenceCity,
  setBeneficiaryResidenceCity,
  beneficiaryEmail,
  setBeneficiaryEmail,
  beneficiaryClabe,
  setBeneficiaryClabe,
  beneficiarySaved,
  handleBeneficiarySave,
}: Props) {
  const form = useFormFocus();

  const handleSave = () => {
    const isValid = form.validate([
      {
        key: "firstName",
        valid: isValidPersonName(beneficiaryFirstName),
        message: t.requiredFirstName,
      },
      {
        key: "paternalLastName",
        valid: isValidPersonName(beneficiaryPaternalLastName),
        message: t.requiredLastName,
      },
      {
        key: "phone",
        valid: isValidNationalPhone(beneficiaryPhone, beneficiaryPhoneCountry),
        message: beneficiaryPhone.length === 0 ? t.requiredPhone : t.invalidPhoneForCountry,
      },
      {
        key: "email",
        valid: beneficiaryEmail.length === 0 || isValidEmail(beneficiaryEmail),
        message: t.requiredEmail,
      },
      {
        key: "clabe",
        valid: beneficiaryClabe.replace(/\D/g, "").length === 18,
        message: t.requiredClabe,
      },
    ]);

    if (!isValid) return;
    handleBeneficiarySave();
  };

  const highlighted = (key: string) => form.pendingField === key;

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
            testID="beneficiaries-backButton"
            onPress={() => setView("dashboard")}
          />

          <ScreenHeader
            title={t.createBeneficiary}
            subtitle={t.beneficiarySubtitle}
            style={styles.header}
          />

          <View style={styles.form}>
            <View ref={form.anchor("firstName")} collapsable={false}>
              <FormInput
                testID="beneficiaries-firstNameInput"
                leftIcon={User}
                label={t.firstName}
                placeholder={t.firstNameExample}
                value={beneficiaryFirstName}
                onChangeText={setBeneficiaryFirstName}
                inputRef={form.input("firstName")}
                highlighted={highlighted("firstName")}
              />
            </View>

            <View ref={form.anchor("paternalLastName")} collapsable={false}>
              <FormInput
                testID="beneficiaries-paternalLastNameInput"
                leftIcon={User}
                label={t.paternalLastName}
                placeholder={t.paternalLastNameExample}
                value={beneficiaryPaternalLastName}
                onChangeText={setBeneficiaryPaternalLastName}
                inputRef={form.input("paternalLastName")}
                highlighted={highlighted("paternalLastName")}
              />
            </View>

            <FormInput
              testID="beneficiaries-maternalLastNameInput"
              leftIcon={User}
              label={t.maternalLastName}
              placeholder={`${t.optional} · ${t.maternalLastNameExample}`}
              value={beneficiaryMaternalLastName}
              onChangeText={setBeneficiaryMaternalLastName}
            />

            <View ref={form.anchor("phone")} collapsable={false}>
              <PhoneField
                t={t}
                language={language}
                label={t.phoneNumber}
                testID="beneficiaries-phoneInput"
                country={beneficiaryPhoneCountry}
                onCountryChange={setBeneficiaryPhoneCountry}
                digits={beneficiaryPhone}
                onDigitsChange={setBeneficiaryPhone}
                inputRef={form.input("phone")}
                highlighted={highlighted("phone")}
              />
            </View>

            <FormInput
              testID="beneficiaries-residenceStateInput"
              leftIcon={MapPin}
              label={t.residenceState}
              placeholder={t.residenceStateExample}
              value={beneficiaryResidenceState}
              onChangeText={setBeneficiaryResidenceState}
            />

            <FormInput
              testID="beneficiaries-residenceCityInput"
              leftIcon={Building2}
              label={t.residenceCity}
              placeholder={t.residenceCityExample}
              value={beneficiaryResidenceCity}
              onChangeText={setBeneficiaryResidenceCity}
            />

            <View ref={form.anchor("email")} collapsable={false}>
              <FormInput
                testID="beneficiaries-emailInput"
                leftIcon={Mail}
                label={t.emailAddress}
                placeholder={t.emailExample}
                value={beneficiaryEmail}
                onChangeText={setBeneficiaryEmail}
                keyboardType="email-address"
                inputRef={form.input("email")}
                highlighted={highlighted("email")}
              />
            </View>

            <View ref={form.anchor("clabe")} collapsable={false}>
              <FormInput
                testID="beneficiaries-clabeInput"
                leftIcon={CreditCard}
                label={t.clabe}
                placeholder={t.clabeExample}
                value={beneficiaryClabe}
                onChangeText={(text) => setBeneficiaryClabe(text.replace(/\D/g, "").slice(0, 18))}
                keyboardType="number-pad"
                maxLength={18}
                inputRef={form.input("clabe")}
                highlighted={highlighted("clabe")}
              />
            </View>

            {form.pendingMessage ? (
              <GlassBanner
                testID="beneficiaries-validationBanner"
                message={form.pendingMessage}
              />
            ) : null}

            <MainButton testID="beneficiaries-saveButton" onPress={handleSave}>
              {t.saveBeneficiary}
            </MainButton>

            {beneficiarySaved ? (
              <GlassBanner tone="info" message={t.beneficiarySaved} />
            ) : null}
          </View>
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
});
