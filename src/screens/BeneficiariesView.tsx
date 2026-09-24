import React from "react";
import { View, StyleSheet } from "react-native";
import {
  User,
  UserPlus,
  MapPin,
  Building2,
  Mail,
  CreditCard,
  CircleAlert,
  CircleCheck,
} from "lucide-react-native";

import FormInput from "../components/FormInput";
import PhoneField from "../components/PhoneField";
import {
  BackButton,
  InfoCard,
  PrimaryButton,
  ScreenHeader,
  ScreenLayout,
} from "../components/ui";
import { spacing } from "../theme/spacing";
import { Language, ViewName } from "../types/app";
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

/** Quien recibe siempre es de Mexico: la lada va fija en +52. */
const BENEFICIARY_PHONE_COUNTRY = "MX";

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
        valid: isValidNationalPhone(beneficiaryPhone, BENEFICIARY_PHONE_COUNTRY),
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
    <ScreenLayout keyboard scrollRef={form.scrollRef}>
      {/* El boton va dentro de `contentRef`: `useFormFocus` mide los campos
          contra esta vista para desplazar hasta el que falta. */}
      <View ref={form.contentRef} collapsable={false}>
        <BackButton
          testID="beneficiaries-backButton"
          accessibilityLabel={t.back}
          onPress={() => setView("dashboard")}
        />

        <ScreenHeader
          icon={UserPlus}
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
              country={BENEFICIARY_PHONE_COUNTRY}
              lockCountry
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
            <InfoCard
              testID="beneficiaries-validationBanner"
              icon={CircleAlert}
              tone="danger"
              text={form.pendingMessage}
            />
          ) : null}

          <PrimaryButton
            testID="beneficiaries-saveButton"
            title={t.saveBeneficiary}
            onPress={handleSave}
          />

          {beneficiarySaved ? (
            <InfoCard
              testID="beneficiaries.savedCard"
              icon={CircleCheck}
              tone="success"
              text={t.beneficiarySaved}
            />
          ) : null}
        </View>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: spacing.lg,
  },
  form: {
    gap: spacing.lg,
  },
});
