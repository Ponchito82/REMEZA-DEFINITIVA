import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Building2,
  CircleAlert,
  CreditCard,
  Mail,
  MapPin,
  Star,
  User,
  UserPen,
} from "lucide-react-native";

import FormInput from "../../components/FormInput";
import PhoneField from "../../components/PhoneField";
import {
  BackButton,
  InfoCard,
  ListRow,
  PrimaryButton,
  ScreenHeader,
  ScreenLayout,
  SecondaryButton,
} from "../../components/ui";
import { useFormFocus } from "../../hooks/useFormFocus";
import { spacing } from "../../theme/spacing";
import {
  BENEFICIARY_PHONE_COUNTRY,
  beneficiaryRules,
  formatMxPhone,
  mxPhoneDigits,
} from "../../utils/beneficiary";
import { Beneficiary, Language } from "../../types/app";

type Props = {
  t: any;
  language: Language;
  beneficiary: Beneficiary;
  onCancel: () => void;
  onSave: (updated: Beneficiary) => void;
};

/** Editar beneficiario (pantalla 38). Mismos campos y reglas que el alta. */
export default function EditBeneficiaryScreen({ t, language, beneficiary, onCancel, onSave }: Props) {
  const form = useFormFocus();
  const [firstName, setFirstName] = useState(beneficiary.firstName);
  const [paternal, setPaternal] = useState(beneficiary.paternalLastName);
  const [maternal, setMaternal] = useState(beneficiary.maternalLastName ?? "");
  const [phone, setPhone] = useState(mxPhoneDigits(beneficiary.phone));
  const [state, setState] = useState(beneficiary.state);
  const [city, setCity] = useState(beneficiary.city);
  const [email, setEmail] = useState(beneficiary.email ?? "");
  const [clabe, setClabe] = useState(beneficiary.clabe ?? "");
  const [favorite, setFavorite] = useState(beneficiary.favorite);

  const highlighted = (key: string) => form.pendingField === key;

  const handleSave = () => {
    const valid = form.validate(
      beneficiaryRules(t, { firstName, paternalLastName: paternal, phone, email, clabe }),
    );
    if (!valid) return;

    onSave({
      ...beneficiary,
      firstName: firstName.trim(),
      paternalLastName: paternal.trim(),
      maternalLastName: maternal.trim() || undefined,
      fullName: [firstName, paternal, maternal].map((part) => part.trim()).filter(Boolean).join(" "),
      phone: formatMxPhone(phone),
      state: state.trim(),
      city: city.trim(),
      email: email.trim() || undefined,
      clabe,
      favorite,
    });
  };

  return (
    <ScreenLayout keyboard scrollRef={form.scrollRef}>
      <View ref={form.contentRef} collapsable={false}>
        <BackButton
          testID="editBeneficiary.backButton"
          accessibilityLabel={t.back}
          onPress={onCancel}
        />

        <ScreenHeader
          icon={UserPen}
          iconVariant="ring"
          title={t.editBeneficiaryTitle}
          subtitle={t.editBeneficiarySubtitle}
          style={styles.header}
        />

        <View style={styles.form}>
          <View ref={form.anchor("firstName")} collapsable={false}>
            <FormInput
              testID="editBeneficiary.firstNameInput"
              leftIcon={User}
              label={t.firstName}
              value={firstName}
              onChangeText={setFirstName}
              inputRef={form.input("firstName")}
              highlighted={highlighted("firstName")}
            />
          </View>
          <View ref={form.anchor("paternalLastName")} collapsable={false}>
            <FormInput
              testID="editBeneficiary.paternalLastNameInput"
              leftIcon={User}
              label={t.paternalLastName}
              value={paternal}
              onChangeText={setPaternal}
              inputRef={form.input("paternalLastName")}
              highlighted={highlighted("paternalLastName")}
            />
          </View>
          <FormInput
            testID="editBeneficiary.maternalLastNameInput"
            leftIcon={User}
            label={t.maternalLastName}
            placeholder={t.optional}
            value={maternal}
            onChangeText={setMaternal}
          />
          <View ref={form.anchor("phone")} collapsable={false}>
            <PhoneField
              t={t}
              language={language}
              label={t.phoneNumber}
              testID="editBeneficiary.phoneInput"
              country={BENEFICIARY_PHONE_COUNTRY}
              lockCountry
              digits={phone}
              onDigitsChange={setPhone}
              inputRef={form.input("phone")}
              highlighted={highlighted("phone")}
            />
          </View>
          <FormInput
            testID="editBeneficiary.stateInput"
            leftIcon={MapPin}
            label={t.residenceState}
            value={state}
            onChangeText={setState}
          />
          <FormInput
            testID="editBeneficiary.cityInput"
            leftIcon={Building2}
            label={t.residenceCity}
            value={city}
            onChangeText={setCity}
          />
          <View ref={form.anchor("email")} collapsable={false}>
            <FormInput
              testID="editBeneficiary.emailInput"
              leftIcon={Mail}
              label={t.emailAddress}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              inputRef={form.input("email")}
              highlighted={highlighted("email")}
            />
          </View>
          <View ref={form.anchor("clabe")} collapsable={false}>
            <FormInput
              testID="editBeneficiary.clabeInput"
              leftIcon={CreditCard}
              label={t.clabe}
              value={clabe}
              onChangeText={(text) => setClabe(text.replace(/\D/g, "").slice(0, 18))}
              keyboardType="number-pad"
              maxLength={18}
              inputRef={form.input("clabe")}
              highlighted={highlighted("clabe")}
            />
          </View>

          <ListRow
            testID="editBeneficiary.favoriteToggle"
            icon={Star}
            title={t.markAsFavorite}
            right="toggle"
            selected={favorite}
            onToggle={setFavorite}
          />

          {form.pendingMessage ? (
            <InfoCard
              testID="editBeneficiary.validationCard"
              icon={CircleAlert}
              tone="danger"
              text={form.pendingMessage}
            />
          ) : null}

          <PrimaryButton
            testID="editBeneficiary.saveButton"
            title={t.saveChangesButton}
            onPress={handleSave}
          />
          <SecondaryButton
            testID="editBeneficiary.cancelButton"
            title={t.cancel}
            onPress={onCancel}
          />
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
