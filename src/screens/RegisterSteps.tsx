import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Check, Lock, Calendar, Globe, CreditCard, User, Images } from "lucide-react-native";
import { launchImageLibrary } from "react-native-image-picker";
import Clipboard from "@react-native-clipboard/clipboard";
import MainButton from "../components/MainButton";
import FormInput from "../components/FormInput";
import DocumentCamera from "../components/DocumentCamera";
import DocumentPreviewCard, { DocumentStatus } from "../components/DocumentPreviewCard";
import SelectField from "../components/SelectField";
import PhoneField from "../components/PhoneField";
import {
  Button,
  CloseButton,
  IconCircle,
  LinkText,
  OptionSheet,
  OtpInput,
  PinDotsInput,
  ScreenHeader,
  StepProgress,
} from "../components/ui";
import { CredentialsSummaryCard } from "../components/remeza";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
import { spacing } from "../theme/spacing";
import AddressFields, { ADDRESS_FIELD_KEYS, AddressDetail } from "../components/AddressFields";
import { Language, ViewName } from "../types/app";
import { styles } from "../theme/styles";
import { CountryCode, isCountryCode, stateNameByCode } from "../services/geo";
import { submitRegistration } from "../api/registration";
import {
  OtpSource,
  checkVerificationCode,
  resendCodeBySms,
  saveOnboardingEmail,
  startOnboarding,
  verifyOnboardingEmail,
  verifyOnboardingPhone,
  verificationErrorMessage,
} from "../api/verification";
import { dialCodeLabel, formatNationalPhone, isValidNationalPhone, toE164 } from "../utils/phone";
import { isValidPostalCode } from "../utils/postalCode";
import { AddressValue } from "../hooks/useAddressCascade";
import { useFormFocus } from "../hooks/useFormFocus";
import {
  isValidEmail,
  isWeakPasscode,
  isValidPersonName,
  isValidForeignId,
  isValidSsnLast4,
  DAY_OPTIONS,
  MONTH_OPTIONS,
  MONTH_OPTIONS_ES,
  buildYearOptions,
  GENDER_OPTIONS,
  GENDER_OPTIONS_ES,
  FOREIGN_ID_TYPE_OPTIONS,
  FOREIGN_ID_TYPE_OPTIONS_ES,
  NATIONALITY_OPTIONS,
  NATIONALITY_OPTIONS_ES,
} from "../utils/validation";

const YEAR_OPTIONS = buildYearOptions();
const RESEND_SECONDS = 45;

const GENDER_CODES: Record<string, string> = {
  male: "M",
  female: "F",
  other: "O",
  unspecified: "U",
};

type Props = {
  t: any;
  language: Language;
  regStep: number;
  setRegStep: (step: number) => void;
  setView: (view: ViewName) => void;
  registerPhone: string;
  setRegisterPhone: (value: string) => void;
  registerPhoneCountry: CountryCode;
  setRegisterPhoneCountry: (value: CountryCode) => void;
  otp: string[];
  setOtp: (value: string[]) => void;
  registerAccessCode: string;
  setRegisterAccessCode: (value: string) => void;
  identificationFrontFile: string | null;
  identificationBackFile: string | null;
  setIdentificationFrontFile: (value: string | null) => void;
  setIdentificationBackFile: (value: string | null) => void;

  registerFirstName: string;
  setRegisterFirstName: (value: string) => void;
  registerPaternalLastName: string;
  setRegisterPaternalLastName: (value: string) => void;
  registerMaternalLastName: string;
  setRegisterMaternalLastName: (value: string) => void;

  registerDobDay: string;
  setRegisterDobDay: (value: string) => void;
  registerDobMonth: string;
  setRegisterDobMonth: (value: string) => void;
  registerDobYear: string;
  setRegisterDobYear: (value: string) => void;

  registerNationality: string;
  setRegisterNationality: (value: string) => void;
  registerForeignIdType: string;
  setRegisterForeignIdType: (value: string) => void;
  registerForeignId: string;
  setRegisterForeignId: (value: string) => void;
  registerGender: string;
  setRegisterGender: (value: string) => void;
  registerSsnLast4: string;
  setRegisterSsnLast4: (value: string) => void;
  registerEmail: string;
  setRegisterEmail: (value: string) => void;

  registerAddress1: string;
  setRegisterAddress1: (value: string) => void;
  registerCity: string;
  setRegisterCity: (value: string) => void;
  registerState: string;
  setRegisterState: (value: string) => void;
  registerZipCode: string;
  setRegisterZipCode: (value: string) => void;
  registerCountry: string;
  setRegisterCountry: (value: string) => void;

  registerAddressDetail: AddressDetail;
  setRegisterAddressDetail: (patch: Partial<AddressDetail>) => void;
};

export default function RegisterSteps(props: Props) {
  const {
    t,
    language,
    regStep,
    setRegStep,
    setView,
    registerPhone,
    setRegisterPhone,
    registerPhoneCountry,
    setRegisterPhoneCountry,
    otp,
    setOtp,
    registerAccessCode,
    setRegisterAccessCode,
    identificationFrontFile,
    identificationBackFile,
    setIdentificationFrontFile,
    setIdentificationBackFile,
    registerFirstName,
    setRegisterFirstName,
    registerPaternalLastName,
    setRegisterPaternalLastName,
    registerMaternalLastName,
    setRegisterMaternalLastName,
    registerDobDay,
    setRegisterDobDay,
    registerDobMonth,
    setRegisterDobMonth,
    registerDobYear,
    setRegisterDobYear,
    registerNationality,
    setRegisterNationality,
    registerForeignIdType,
    setRegisterForeignIdType,
    registerForeignId,
    setRegisterForeignId,
    registerGender,
    setRegisterGender,
    registerSsnLast4,
    setRegisterSsnLast4,
    registerEmail,
    setRegisterEmail,
    setRegisterAddress1,
    registerCity,
    setRegisterCity,
    registerState,
    setRegisterState,
    registerZipCode,
    setRegisterZipCode,
    registerCountry,
    setRegisterCountry,
    registerAddressDetail,
    setRegisterAddressDetail,
  } = props;

  const form = useFormFocus();

  const addressCountry = isCountryCode(registerCountry) ? registerCountry : null;

  const addressValue: AddressValue = {
    postalCode: registerZipCode,
    country: registerCountry,
    stateCode: registerState,
    city: registerCity,
  };

  const handleAddressChange = useCallback(
    (patch: Partial<AddressValue>) => {
      if (patch.postalCode !== undefined) setRegisterZipCode(patch.postalCode);
      if (patch.country !== undefined) setRegisterCountry(patch.country);
      if (patch.stateCode !== undefined) setRegisterState(patch.stateCode);
      if (patch.city !== undefined) setRegisterCity(patch.city);
    },
    [setRegisterZipCode, setRegisterCountry, setRegisterState, setRegisterCity],
  );

  const handleComposedAddress = useCallback(
    (line1: string) => {
      setRegisterAddress1(line1);
    },
    [setRegisterAddress1],
  );

  const genderOptions = language === "es" ? GENDER_OPTIONS_ES : GENDER_OPTIONS;
  const foreignIdTypeOptions = language === "es" ? FOREIGN_ID_TYPE_OPTIONS_ES : FOREIGN_ID_TYPE_OPTIONS;
  const nationalityOptions = language === "es" ? NATIONALITY_OPTIONS_ES : NATIONALITY_OPTIONS;
  const monthOptions = language === "es" ? MONTH_OPTIONS_ES : MONTH_OPTIONS;

  const [resendSecondsLeft, setResendSecondsLeft] = useState(RESEND_SECONDS);
  const [codeResentVisible, setCodeResentVisible] = useState(false);

  useEffect(() => {
    if (regStep !== 2) return;

    setResendSecondsLeft(RESEND_SECONDS);
    const interval = setInterval(() => {
      setResendSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [regStep]);

  const [cameraVisible, setCameraVisible] = useState(false);
  const [documentSide, setDocumentSide] = useState<"front" | "back">("front");
  const [imageSourceSide, setImageSourceSide] = useState<"front" | "back" | null>(null);

  const [frontDocStatus, setFrontDocStatus] = useState<DocumentStatus>("empty");
  const [backDocStatus, setBackDocStatus] = useState<DocumentStatus>("empty");
  const [documentsError, setDocumentsError] = useState("");

  const [isSubmittingRegistration, setIsSubmittingRegistration] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const pickIdentificationFront = () => setImageSourceSide("front");
  const pickIdentificationBack = () => setImageSourceSide("back");

  const openCameraForSide = (side: "front" | "back") => {
    setImageSourceSide(null);
    setDocumentSide(side);
    setCameraVisible(true);
  };

  const openGalleryForSide = async (side: "front" | "back") => {
    setImageSourceSide(null);

    const result = await launchImageLibrary({ mediaType: "photo", quality: 0.8, selectionLimit: 1 });
    const uri = result.assets?.[0]?.uri;
    if (!uri) return;

    if (side === "front") {
      setIdentificationFrontFile(uri);
      setFrontDocStatus("loaded");
    } else {
      setIdentificationBackFile(uri);
      setBackDocStatus("loaded");
    }
    setDocumentsError("");
  };

  const removeIdentificationFront = () => {
    setIdentificationFrontFile(null);
    setFrontDocStatus("empty");
    setDocumentsError("");
  };

  const removeIdentificationBack = () => {
    setIdentificationBackFile(null);
    setBackDocStatus("empty");
    setDocumentsError("");
  };

  const handleDocumentCapture = (path: string) => {
    if (documentSide === "front") {
      setIdentificationFrontFile(path);
      setFrontDocStatus("loaded");
    } else {
      setIdentificationBackFile(path);
      setBackDocStatus("loaded");
    }
    setDocumentsError("");
    setCameraVisible(false);
  };

  const handlePasteCode = async () => {
    const clipboardText = await Clipboard.getString();
    const digits = clipboardText.replace(/\D/g, "").slice(0, otp.length);
    if (digits.length === otp.length) setOtp(digits.split(""));
  };

  const resendLabel = `0:${String(resendSecondsLeft).padStart(2, "0")}`;

  const [confirmAccessCode, setConfirmAccessCode] = useState("");
  const [accessCodeError, setAccessCodeError] = useState("");

  const handleSetAccessCode = () => {
    if (isWeakPasscode(registerAccessCode)) {
      setAccessCodeError(t.weakAccessCode);
      return;
    }
    if (registerAccessCode !== confirmAccessCode) {
      setAccessCodeError(t.accessCodeMismatch);
      return;
    }
    setAccessCodeError("");
    setRegStep(4);
  };

  const [emailTouched, setEmailTouched] = useState(false);
  const emailValid = registerEmail.length > 0 && isValidEmail(registerEmail);
  const emailError = emailTouched && registerEmail.length > 0 && !emailValid
    ? t.invalidEmail
    : "";

  const [phoneTouched, setPhoneTouched] = useState(false);
  const isRegisterPhoneValid = isValidNationalPhone(registerPhone, registerPhoneCountry);

  const phoneE164 = toE164(registerPhone, registerPhoneCountry);

  const [onboardingId, setOnboardingId] = useState<string | null>(null);
  const [otpSource, setOtpSource] = useState<OtpSource>("onboarding");
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [phoneStepError, setPhoneStepError] = useState("");

  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState("");

  const [emailCode, setEmailCode] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailStepError, setEmailStepError] = useState("");

  const handleSendPhoneCode = async () => {
    if (isSendingSms || !isRegisterPhoneValid) return;
    setPhoneStepError("");
    setIsSendingSms(true);
    try {
      const data = await startOnboarding(phoneE164);
      setOnboardingId(data.id);
      setOtpSource("onboarding");
      setOtp(["", "", "", "", "", ""]);
      setRegStep(2);
    } catch (error) {
      setPhoneStepError(verificationErrorMessage(error, t.connectionError));
    } finally {
      setIsSendingSms(false);
    }
  };

  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (isVerifyingOtp || code.length !== 6) return;
    setOtpError("");
    setIsVerifyingOtp(true);
    try {
      if (otpSource === "onboarding") {
        if (!onboardingId) throw new Error("missing onboarding");
        await verifyOnboardingPhone(onboardingId, code);
      } else {
        await checkVerificationCode(phoneE164, code);
      }
      setRegStep(3);
    } catch (error) {
      setOtpError(verificationErrorMessage(error, t.invalidVerificationCode));
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendSms = async () => {
    if (isSendingSms || resendSecondsLeft > 0) return;
    setOtpError("");
    setIsSendingSms(true);
    try {
      await resendCodeBySms(phoneE164);
      setOtpSource("standalone");
      setOtp(["", "", "", "", "", ""]);
      setResendSecondsLeft(RESEND_SECONDS);
      setCodeResentVisible(true);
      setTimeout(() => setCodeResentVisible(false), 3000);
    } catch (error) {
      setOtpError(verificationErrorMessage(error, t.connectionError));
    } finally {
      setIsSendingSms(false);
    }
  };

  const handleSendEmailCode = async () => {
    if (isSendingEmail || !emailValid || !onboardingId) return;
    setEmailStepError("");
    setIsSendingEmail(true);
    try {
      await saveOnboardingEmail(onboardingId, registerEmail.trim());
      setEmailCodeSent(true);
      setEmailVerified(false);
      setEmailCode("");
    } catch (error) {
      setEmailStepError(verificationErrorMessage(error, t.connectionError));
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleVerifyEmailCode = async () => {
    if (isVerifyingEmail || emailCode.length !== 6 || !onboardingId) return;
    setEmailStepError("");
    setIsVerifyingEmail(true);
    try {
      await verifyOnboardingEmail(onboardingId, emailCode);
      setEmailVerified(true);
    } catch (error) {
      setEmailStepError(verificationErrorMessage(error, t.invalidVerificationCode));
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const markTouched = (field: string) => setTouchedFields((prev) => ({ ...prev, [field]: true }));
  const fieldError = (field: string, valid: boolean, message: string) =>
    touchedFields[field] && !valid ? message : "";

  const firstNameValid = isValidPersonName(registerFirstName);
  const paternalLastNameValid = isValidPersonName(registerPaternalLastName);
  const maternalLastNameValid =
    registerMaternalLastName.length === 0 || isValidPersonName(registerMaternalLastName);
  const foreignIdValid = isValidForeignId(registerForeignId);
  const ssnValid = isValidSsnLast4(registerSsnLast4);
  const zipValid = isValidPostalCode(registerZipCode, addressCountry);
  const countryValid = !!addressCountry;
  const stateValid = !!registerState;
  const cityValid = !!registerCity;
  const streetValid = registerAddressDetail.street.trim().length > 0;
  const exteriorNumberValid = registerAddressDetail.exteriorNumber.trim().length > 0;
  const dobValid = !!registerDobDay && !!registerDobMonth && !!registerDobYear;
  const nationalityValid = !!registerNationality;
  const foreignIdTypeValid = !!registerForeignIdType;
  const genderValid = !!registerGender;
  const documentsValid = !!identificationFrontFile && !!identificationBackFile;

  const step4Checks = [
    firstNameValid,
    paternalLastNameValid,
    maternalLastNameValid,
    foreignIdValid,
    ssnValid,
    streetValid,
    exteriorNumberValid,
    cityValid,
    stateValid,
    zipValid,
    countryValid,
    dobValid,
    nationalityValid,
    foreignIdTypeValid,
    genderValid,
    emailValid,
    documentsValid,
  ];

  const isStep4Valid = step4Checks.every(Boolean);

  /** Llena el 4.o segmento del stepper segun los campos ya resueltos. */
  const step4Progress = step4Checks.filter(Boolean).length / step4Checks.length;

  const handleCompleteRegistration = () => {
    const isValid = form.validate([
      { key: "dob", valid: dobValid, message: t.requiredDob },
      { key: "nationality", valid: nationalityValid, message: t.requiredCountry },
      { key: "foreignIdType", valid: foreignIdTypeValid, message: t.requiredForeignIdType },
      { key: "foreignId", valid: foreignIdValid, message: t.invalidForeignId },
      { key: "gender", valid: genderValid, message: t.requiredGender },
      { key: "email", valid: emailValid, message: t.requiredEmail },
      { key: "firstName", valid: firstNameValid, message: t.requiredFirstName },
      { key: "paternalLastName", valid: paternalLastNameValid, message: t.requiredLastName },
      { key: ADDRESS_FIELD_KEYS.postalCode, valid: zipValid, message: t.requiredPostalCode },
      { key: ADDRESS_FIELD_KEYS.country, valid: countryValid, message: t.requiredCountry },
      { key: ADDRESS_FIELD_KEYS.state, valid: stateValid, message: t.requiredState },
      { key: ADDRESS_FIELD_KEYS.city, valid: cityValid, message: t.requiredCity },
      { key: ADDRESS_FIELD_KEYS.street, valid: streetValid, message: t.requiredStreet },
      {
        key: ADDRESS_FIELD_KEYS.exteriorNumber,
        valid: exteriorNumberValid,
        message: t.requiredExteriorNumber,
      },
      { key: "documents", valid: documentsValid, message: t.completeAllFields },
    ]);

    if (!isValid) return;

    handleFinishRegistration();
  };

  const handleFinishRegistration = async () => {
    if (isSubmittingRegistration) return;

    setSubmitError("");
    setDocumentsError("");
    setIsSubmittingRegistration(true);
    setFrontDocStatus("uploading");
    setBackDocStatus("uploading");
    setRegStep(5);

    try {
      const result = await submitRegistration({
        onboardingId,
        personalInfo: {
          firstName: registerFirstName.trim(),
          lastName: registerPaternalLastName.trim(),
          dateOfBirth: `${registerDobYear}-${registerDobMonth}-${registerDobDay}`,
          nationality: registerNationality,
          foreignIdType: registerForeignIdType,
          foreignId: registerForeignId.trim(),
          gender: GENDER_CODES[registerGender] ?? "U",
          ssn: "",
          email: registerEmail.trim(),
          addressLine1: [registerAddressDetail.street, registerAddressDetail.exteriorNumber]
            .filter(Boolean)
            .join(" ")
            .trim(),
          city: registerCity,
          state: addressCountry ? stateNameByCode(addressCountry, registerState) : registerState,
          country: registerCountry,
          zipCode: registerZipCode,
        },
        documents: {
          frontFilePath: identificationFrontFile as string,
          backFilePath: identificationBackFile as string,
        },
      });

      if (__DEV__) {
        console.log(
          `[registro] verificacion=${result.status}` +
            (result.backendMessage ? ` backend="${result.backendMessage}"` : ""),
        );
      }

      setFrontDocStatus("loaded");
      setBackDocStatus("loaded");

      if (result.status === "approved") {
        setRegStep(6);
      } else {
        setSubmitError(t.verificationNotApproved);
        setRegStep(4);
      }
    } catch {
      setFrontDocStatus("error");
      setBackDocStatus("error");
      setSubmitError(t.connectionError);
      setRegStep(4);
    } finally {
      setIsSubmittingRegistration(false);
    }
  };

  if (cameraVisible) {
    return (
      <DocumentCamera
        side={documentSide}
        onClose={() => setCameraVisible(false)}
        onCapture={handleDocumentCapture}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.registerScreen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        ref={form.scrollRef}
        contentContainerStyle={styles.registerContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View ref={form.contentRef} collapsable={false}>
        {regStep <= 4 && (
          <StepProgress current={regStep} partial={regStep === 4 ? step4Progress : undefined} />
        )}

        {regStep <= 4 && (
          <CloseButton
            testID="register-backButton"
            onPress={() => (regStep === 1 ? setView("login") : setRegStep(regStep - 1))}
            style={stepStyles.close}
          />
        )}

        {regStep === 1 && (
          <View>
            <ScreenHeader title={t.yourNumber} subtitle={t.secureAccount} />

            <PhoneField
              t={t}
              language={language}
              testID="register-phoneInput"
              country={registerPhoneCountry}
              onCountryChange={setRegisterPhoneCountry}
              digits={registerPhone}
              onDigitsChange={setRegisterPhone}
              onBlur={() => setPhoneTouched(true)}
              error={
                phoneTouched && !isRegisterPhoneValid ? t.invalidPhoneForCountry : ""
              }
            />

            {phoneStepError ? (
              <Text style={styles.fieldErrorText} testID="register-phoneStepError">
                {phoneStepError}
              </Text>
            ) : null}

            <MainButton
              testID="register-nextButton"
              onPress={handleSendPhoneCode}
              disabled={!isRegisterPhoneValid || isSendingSms}
            >
              {isSendingSms ? t.sendingCode : t.next}
            </MainButton>
          </View>
        )}

        {regStep === 2 && (
          <View style={styles.stepCenter}>
            <IconCircle
              icon={Check}
              size={88}
              glow
              color={colors.text.primary}
              background={colors.primary}
            />

            <ScreenHeader
              title={t.smsCode}
              subtitle={t.smsInstruction}
              align="center"
              style={stepStyles.centerHeader}
            />

            <OtpInput
              testID="register-otpInput"
              value={otp}
              onChange={setOtp}
              style={stepStyles.otp}
            />

            <View style={stepStyles.otpActions}>
              {resendSecondsLeft > 0 ? (
                <Text style={styles.resendText}>
                  {t.resendCodeIn} {resendLabel}
                </Text>
              ) : (
                <LinkText
                  testID="register-resendCodeLink"
                  onPress={handleResendSms}
                  disabled={isSendingSms}
                >
                  {isSendingSms ? t.sendingCode : t.resendCode}
                </LinkText>
              )}

              <View style={stepStyles.otpSeparator} />

              <LinkText testID="register-pasteCodeLink" onPress={handlePasteCode}>
                {t.pasteCode}
              </LinkText>
            </View>

            {codeResentVisible && <Text style={styles.resendText}>{t.codeResent}</Text>}

            {otpError ? (
              <Text style={styles.fieldErrorText} testID="register-otpError">
                {otpError}
              </Text>
            ) : null}

            <Button
              testID="register-verifyCodeButton"
              title={isVerifyingOtp ? t.verifyingCode : t.verifyCode}
              onPress={handleVerifyOtp}
              disabled={otp.some((digit) => digit.length !== 1) || isVerifyingOtp}
              style={stepStyles.cta}
            />
          </View>
        )}

        {regStep === 3 && (
          <View style={styles.stepCenter}>
            <IconCircle icon={Lock} size={88} glow />

            <ScreenHeader
              title={t.createAccessCode}
              subtitle={t.accessCodeHelp}
              align="center"
              style={stepStyles.centerHeader}
            />

            <PinDotsInput
              testID="register-accessCodeInput"
              accessibilityLabel={t.createAccessCode}
              value={registerAccessCode}
              onChangeText={(text) => setRegisterAccessCode(text.replace(/\D/g, "").slice(0, 6))}
            />

            <Text style={stepStyles.confirmLabel}>{t.confirmAccessCode}</Text>

            <PinDotsInput
              testID="register-confirmAccessCodeInput"
              accessibilityLabel={t.confirmAccessCode}
              value={confirmAccessCode}
              onChangeText={(text) => setConfirmAccessCode(text.replace(/\D/g, "").slice(0, 6))}
            />

            {accessCodeError ? (
              <Text style={[styles.errorText, stepStyles.error]}>{accessCodeError}</Text>
            ) : null}

            <Button
              testID="register-setAccessCodeButton"
              title={t.setAccessCode}
              onPress={handleSetAccessCode}
              disabled={registerAccessCode.length !== 6 || confirmAccessCode.length !== 6}
              style={stepStyles.cta}
            />
          </View>
        )}

        {regStep === 4 && (
          <View style={styles.step4Container}>
            <ScreenHeader title={t.personalInfo} subtitle={t.personalInfoSubtitle} />

            <View style={styles.stack24}>
              <View style={styles.flex1}>
                <Text style={styles.formLabel}>{t.completePhone}</Text>
                <Text style={styles.selectFieldText}>
                  {dialCodeLabel(registerPhoneCountry)}{" "}
                  {formatNationalPhone(registerPhone, registerPhoneCountry)}
                </Text>
              </View>

              <View ref={form.anchor("dob")} collapsable={false}>
                <Text style={styles.formLabel}>{t.dob}</Text>
                <View style={styles.row3}>
                  <View style={styles.flex1}>
                    <SelectField
                      label=""
                      placeholder={t.day}
                      title={t.selectDayTitle}
                      icon={Calendar}
                      value={registerDobDay}
                      options={DAY_OPTIONS}
                      onSelect={setRegisterDobDay}
                      highlighted={form.pendingField === "dob"}
                      testID="register-dobDayInput"
                    />
                  </View>
                  <View style={styles.flex1}>
                    <SelectField
                      label=""
                      placeholder={t.month}
                      title={t.selectMonthTitle}
                      icon={Calendar}
                      value={registerDobMonth}
                      options={monthOptions}
                      onSelect={setRegisterDobMonth}
                      highlighted={form.pendingField === "dob"}
                      testID="register-dobMonthInput"
                    />
                  </View>
                  <View style={styles.flex1}>
                    <SelectField
                      label=""
                      placeholder={t.year}
                      title={t.selectYearTitle}
                      icon={Calendar}
                      value={registerDobYear}
                      options={YEAR_OPTIONS}
                      onSelect={setRegisterDobYear}
                      highlighted={form.pendingField === "dob"}
                      testID="register-dobYearInput"
                    />
                  </View>
                </View>
              </View>

              <View ref={form.anchor("nationality")} collapsable={false}>
                <SelectField
                  label={t.nationality}
                  placeholder={t.selectOption}
                  icon={Globe}
                  value={registerNationality}
                  options={nationalityOptions}
                  onSelect={setRegisterNationality}
                  highlighted={form.pendingField === "nationality"}
                  testID="register-nationalityInput"
                />
              </View>

              <View style={styles.groupBoxGray}>
                <View style={styles.row2}>
                  <View style={styles.flex1} ref={form.anchor("foreignIdType")} collapsable={false}>
                    <SelectField
                      label={t.foreignIdType}
                      placeholder={t.selectOption}
                      icon={CreditCard}
                      value={registerForeignIdType}
                      options={foreignIdTypeOptions}
                      onSelect={setRegisterForeignIdType}
                      highlighted={form.pendingField === "foreignIdType"}
                      testID="register-foreignIdTypeInput"
                    />
                  </View>
                  <View style={styles.flex1} ref={form.anchor("foreignId")} collapsable={false}>
                    <FormInput
                      label={t.foreignId}
                      value={registerForeignId}
                      onChangeText={setRegisterForeignId}
                      onBlur={() => markTouched("foreignId")}
                      error={fieldError("foreignId", foreignIdValid, t.invalidForeignId)}
                      maxLength={50}
                      testID="register-foreignIdInput"
                      inputRef={form.input("foreignId")}
                      highlighted={form.pendingField === "foreignId"}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.row2}>
                <View style={styles.flex1} ref={form.anchor("gender")} collapsable={false}>
                  <SelectField
                    label={t.gender}
                    placeholder={t.selectOption}
                    icon={User}
                    value={registerGender}
                    options={genderOptions}
                    onSelect={setRegisterGender}
                    highlighted={form.pendingField === "gender"}
                    testID="register-genderInput"
                  />
                </View>
                <View style={styles.flex1}>
                  <FormInput
                    label={t.ssnLast4}
                    value={registerSsnLast4}
                    onChangeText={(text) => setRegisterSsnLast4(text.replace(/\D/g, "").slice(0, 4))}
                    onBlur={() => markTouched("ssnLast4")}
                    error={fieldError("ssnLast4", ssnValid, t.invalidSsnLast4)}
                    keyboardType="number-pad"
                    maxLength={4}
                    secureToggle
                    testID="register-ssnLast4Input"
                  />
                </View>
              </View>

              <View ref={form.anchor("email")} collapsable={false}>
                <FormInput
                  label={t.emailAddress}
                  placeholder={t.emailExample}
                  value={registerEmail}
                  onChangeText={(text) => {
                    setRegisterEmail(text);
                    setEmailCodeSent(false);
                    setEmailVerified(false);
                    setEmailCode("");
                  }}
                  onBlur={() => setEmailTouched(true)}
                  keyboardType="email-address"
                  error={emailError}
                  maxLength={256}
                  testID="register-emailInput"
                  inputRef={form.input("email")}
                  highlighted={form.pendingField === "email"}
                />

                {emailVerified ? (
                  <Text style={styles.fieldHintText} testID="register-emailVerifiedNotice">
                    {t.emailVerified}
                  </Text>
                ) : (
                  <View style={styles.stack16}>
                    <Pressable
                      testID="register-sendEmailCodeButton"
                      onPress={handleSendEmailCode}
                      disabled={!emailValid || !onboardingId || isSendingEmail}
                      style={({ pressed }) => [
                        styles.secondaryLinkButton,
                        (!emailValid || !onboardingId || isSendingEmail) && { opacity: 0.5 },
                        pressed && { opacity: 0.8 },
                      ]}
                    >
                      <Text style={styles.secondaryLinkText}>
                        {isSendingEmail
                          ? t.sendingCode
                          : emailCodeSent
                            ? t.resendEmailCode
                            : t.sendEmailCode}
                      </Text>
                    </Pressable>

                    {emailCodeSent ? (
                      <View style={styles.row2}>
                        <View style={styles.flex1}>
                          <FormInput
                            label={t.emailCode}
                            placeholder="000000"
                            value={emailCode}
                            onChangeText={(text) => setEmailCode(text.replace(/\D/g, "").slice(0, 6))}
                            keyboardType="number-pad"
                            maxLength={6}
                            testID="register-emailCodeInput"
                          />
                        </View>
                        <View style={styles.flex1}>
                          <Pressable
                            testID="register-verifyEmailCodeButton"
                            onPress={handleVerifyEmailCode}
                            disabled={emailCode.length !== 6 || isVerifyingEmail}
                            style={({ pressed }) => [
                              styles.secondaryLinkButton,
                              (emailCode.length !== 6 || isVerifyingEmail) && { opacity: 0.5 },
                              pressed && { opacity: 0.8 },
                            ]}
                          >
                            <Text style={styles.secondaryLinkText}>
                              {isVerifyingEmail ? t.verifyingCode : t.verifyCode}
                            </Text>
                          </Pressable>
                        </View>
                      </View>
                    ) : null}
                  </View>
                )}

                {emailStepError ? (
                  <Text style={styles.fieldErrorText} testID="register-emailStepError">
                    {emailStepError}
                  </Text>
                ) : null}

                {!onboardingId ? (
                  <Text style={styles.fieldHintText}>{t.emailNeedsPhoneStep}</Text>
                ) : null}
              </View>

              <View style={styles.stack16}>
                <View ref={form.anchor("firstName")} collapsable={false}>
                  <FormInput
                    label={t.firstName}
                    placeholder={t.firstNameExample}
                    value={registerFirstName}
                    onChangeText={setRegisterFirstName}
                    onBlur={() => markTouched("firstName")}
                    error={fieldError("firstName", firstNameValid, t.invalidFirstName)}
                    maxLength={50}
                    testID="register-firstNameInput"
                    inputRef={form.input("firstName")}
                    highlighted={form.pendingField === "firstName"}
                  />
                </View>
                <View style={styles.row2}>
                  <View style={styles.flex1} ref={form.anchor("paternalLastName")} collapsable={false}>
                    <FormInput
                      label={t.paternalLastName}
                      placeholder={t.paternalLastNameExample}
                      value={registerPaternalLastName}
                      onChangeText={setRegisterPaternalLastName}
                      onBlur={() => markTouched("paternalLastName")}
                      error={fieldError("paternalLastName", paternalLastNameValid, t.invalidLastName)}
                      maxLength={50}
                      testID="register-paternalLastNameInput"
                      inputRef={form.input("paternalLastName")}
                      highlighted={form.pendingField === "paternalLastName"}
                    />
                  </View>
                  <View style={styles.flex1}>
                    <FormInput
                      label={t.maternalLastName}
                      placeholder={t.maternalLastNameExample}
                      value={registerMaternalLastName}
                      onChangeText={setRegisterMaternalLastName}
                      onBlur={() => markTouched("maternalLastName")}
                      error={fieldError("maternalLastName", maternalLastNameValid, t.invalidLastName)}
                      maxLength={50}
                      testID="register-maternalLastNameInput"
                    />
                  </View>
                </View>
              </View>

              <AddressFields
                t={t}
                language={language}
                testIDPrefix="register"
                value={addressValue}
                onChange={handleAddressChange}
                detail={registerAddressDetail}
                onDetailChange={setRegisterAddressDetail}
                onComposedAddressChange={handleComposedAddress}
                form={form}
              />

              <View style={styles.stack16} ref={form.anchor("documents")} collapsable={false}>
                <DocumentPreviewCard
                  t={t}
                  testID="register-identificationFrontField"
                  label={t.identificationFront}
                  filePath={identificationFrontFile}
                  status={frontDocStatus}
                  errorMessage={documentsError}
                  onPick={pickIdentificationFront}
                  onRemove={removeIdentificationFront}
                />

                <DocumentPreviewCard
                  t={t}
                  testID="register-identificationBackField"
                  label={t.identificationBack}
                  filePath={identificationBackFile}
                  status={backDocStatus}
                  errorMessage={documentsError}
                  onPick={pickIdentificationBack}
                  onRemove={removeIdentificationBack}
                />
              </View>

              {form.pendingMessage ? (
                <View style={styles.formBanner} testID="register-validationBanner">
                  <Text style={styles.formBannerText}>{form.pendingMessage}</Text>
                </View>
              ) : !isStep4Valid ? (
                <Text style={styles.fieldHintText}>{t.completeAllFields}</Text>
              ) : null}

              {submitError ? (
                <View style={styles.formBanner} testID="register-submitError">
                  <Text style={styles.formBannerText}>{submitError}</Text>
                </View>
              ) : null}

              <Button
                testID="register-completeRegistrationButton"
                title={t.finishRegistration}
                onPress={handleCompleteRegistration}
                disabled={isSubmittingRegistration}
                loading={isSubmittingRegistration}
              />
            </View>
          </View>
        )}

        {regStep === 5 && (
          <View style={styles.verifyingWrap} testID="register-verifyingScreen">
            <ActivityIndicator size="large" color={colors.primaryLight} />
            <ScreenHeader
              title={t.verifyingDataTitle}
              subtitle={t.verifyingDataSubtitle}
              align="center"
              style={stepStyles.centerHeader}
            />
          </View>
        )}

        {regStep === 6 && (
          <View style={styles.stepCenter} testID="register-successScreen">
            <IconCircle
              icon={Check}
              size={88}
              color={colors.successIcon}
              background={colors.successBg}
            />

            <ScreenHeader
              title={t.registrationVerifiedTitle}
              subtitle={t.registrationVerifiedMessage}
              align="center"
              style={stepStyles.centerHeader}
            />

            <CredentialsSummaryCard
              testID="register-credentialsCard"
              phoneTestID="register-successPhone"
              codeTestID="register-successAccessCode"
              toggleTestID="register-toggleAccessCodeButton"
              phoneLabel={t.phoneNumber}
              phone={`${dialCodeLabel(registerPhoneCountry)} ${formatNationalPhone(
                registerPhone,
                registerPhoneCountry,
              )}`}
              codeLabel={t.accessCodeLabel}
              code={registerAccessCode}
              revealLabel={t.showData}
              style={stepStyles.credentials}
            />

            <Button
              testID="register-goToLoginButton"
              title={t.signIn}
              onPress={() => setView("login")}
              style={stepStyles.cta}
            />
          </View>
        )}
        </View>
      </ScrollView>

      <OptionSheet
        visible={imageSourceSide !== null}
        onClose={() => setImageSourceSide(null)}
        title={t.chooseImageSource}
        icon={Images}
        options={[
          { label: t.takePhoto, value: "camera" },
          { label: t.chooseFromGallery, value: "gallery" },
        ]}
        onSelect={(source) => {
          if (!imageSourceSide) return;
          if (source === "camera") openCameraForSide(imageSourceSide);
          else openGalleryForSide(imageSourceSide);
        }}
        testID="register-imageSourceSheet"
      />
    </KeyboardAvoidingView>
  );
}

const stepStyles = StyleSheet.create({
  close: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  centerHeader: {
    marginTop: spacing.xl,
  },
  otp: {
    marginBottom: spacing.xl,
  },
  otpActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
  },
  /** Separador vertical entre la cuenta atras y "Paste code" */
  otpSeparator: {
    width: 1,
    height: 16,
    backgroundColor: colors.borderSubtle,
  },
  confirmLabel: {
    ...typography.body,
    textAlign: "center",
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  error: {
    marginTop: spacing.md,
  },
  credentials: {
    width: "100%",
    marginBottom: spacing.xl,
  },
  cta: {
    marginTop: spacing.xl,
  },
});
