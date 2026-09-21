import React from "react";
import { ScrollView, View, Text, Pressable } from "react-native";
import { X, CheckCircle2, AlertCircle } from "lucide-react-native";

import { styles } from "../theme/styles";
import FormInput from "../components/FormInput";
import MainButton from "../components/MainButton";
import PhoneField from "../components/PhoneField";
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
    <View style={styles.pageScreen}>
      <ScrollView
        ref={form.scrollRef}
        contentContainerStyle={styles.pageContent}
        showsVerticalScrollIndicator={false}
      >
        <View ref={form.contentRef} collapsable={false}>
          <Pressable
            testID="beneficiaries-backButton"
            onPress={() => setView("dashboard")}
            style={styles.backButton}
          >
            <X size={24} color="#111827" />
          </Pressable>

          <Text style={styles.pageTitle}>{t.createBeneficiary}</Text>
          <Text style={styles.pageSubtitle}>{t.beneficiarySubtitle}</Text>

          <View style={styles.stack16}>
            <View ref={form.anchor("firstName")} collapsable={false}>
              <FormInput
                testID="beneficiaries-firstNameInput"
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
              label={t.residenceState}
              placeholder={t.residenceStateExample}
              value={beneficiaryResidenceState}
              onChangeText={setBeneficiaryResidenceState}
            />

            <FormInput
              testID="beneficiaries-residenceCityInput"
              label={t.residenceCity}
              placeholder={t.residenceCityExample}
              value={beneficiaryResidenceCity}
              onChangeText={setBeneficiaryResidenceCity}
            />

            <View ref={form.anchor("email")} collapsable={false}>
              <FormInput
                testID="beneficiaries-emailInput"
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
              <View style={styles.formBanner} testID="beneficiaries-validationBanner">
                <AlertCircle size={18} color="#B91C1C" />
                <Text style={styles.formBannerText}>{form.pendingMessage}</Text>
              </View>
            ) : null}

            <MainButton testID="beneficiaries-saveButton" onPress={handleSave}>
              {t.saveBeneficiary}
            </MainButton>

            {beneficiarySaved && (
              <View style={styles.transferSuccessBox}>
                <CheckCircle2 size={18} color="#16A34A" />
                <Text style={styles.transferSuccessText}>{t.beneficiarySaved}</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
