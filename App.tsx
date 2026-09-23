import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Animated, Pressable, Text, StyleSheet } from "react-native";
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react-native";

import { ScreenBackground } from "./src/components/ui";
import { DANGER, DANGER_SURFACE, SUCCESS, SUCCESS_SURFACE } from "./src/theme/colors";

import { translations } from "./src/i18n/translations";
import { Language, TransactionsFilter, ViewName } from "./src/types/app";
import { styles } from "./src/theme/styles";

import ComponentsShowcaseScreen from "./src/screens/ComponentsShowcaseScreen";
import MultiCurrencyAccountsScreen from "./src/screens/MultiCurrencyAccountsScreen";
import DisputeOptionsScreen from "./src/screens/DisputeOptionsScreen";
import TwoStepVerificationScreen from "./src/screens/TwoStepVerificationScreen";
import SecurityAlertScreen from "./src/screens/SecurityAlertScreen";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import ForgotAccessCodeView from "./src/screens/ForgotAccessCodeView";
import RegisterSteps from "./src/screens/RegisterSteps";
import DashboardView from "./src/screens/DashboardView";
import KycView from "./src/screens/KycView";

import DrawerMenu from "./src/components/DrawerMenu";
import ProfileView from "./src/screens/ProfileView";
import TransactionsView from "./src/screens/TransactionsView";
import PhysicalCardView from "./src/screens/PhysicalCardView";
import TradingView from "./src/screens/TradingView";
import BeneficiariesView from "./src/screens/BeneficiariesView";
import SendMoneyView from "./src/screens/SendMoneyView";
import RemittanceDetail from "./src/screens/RemittanceDetail";
import SendMoneyConfirmationView from "./src/screens/SendMoneyConfirmationView";
import { AddressDetail, EMPTY_ADDRESS_DETAIL } from "./src/components/AddressFields";
import { CountryCode } from "./src/services/geo";
import {
    UnauthorizedReason,
    clearSession,
    onUnauthorized,
    startSession,
} from "./src/api/session";
import { verifySession } from "./src/api/sessionProbe";
import { toE164 } from "./src/utils/phone";

function AppContent() {
    const [language, setLanguage] = useState<Language>("en");
    const t = translations[language];

    const [view, setView] = useState<ViewName>("welcome");
    const [regStep, setRegStep] = useState(1);
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [customerId, setCustomerId] = useState<string | null>(null);
    const [sessionEndedReason, setSessionEndedReason] = useState<UnauthorizedReason | null>(null);

    const handleLoginSuccess = (
        loggedInCustomerId: string,
        token: string,
        expiresInMs?: number,
    ) => {
        setCustomerId(loggedInCustomerId);
        setAuthToken(token);
        setSessionEndedReason(null);
        startSession(loggedInCustomerId, token, expiresInMs);
    };

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCardActive, setIsCardActive] = useState(true);
    const [isShowcaseOpen, setIsShowcaseOpen] = useState(false);

    /**
     * Mock del dispositivo nuevo. Va en `false` a proposito: en `true`, el
     * login desviaria a la alerta de seguridad y los 12 specs de Appium, que
     * esperan el dashboard tras "Sign In", fallarian en el setup.
     */
    const [isNewDevice] = useState(false);

    useEffect(() => {
        return onUnauthorized((reason) => {
            setAuthToken(null);
            setCustomerId(null);
            setSessionEndedReason(reason);
            setIsMenuOpen(false);
            setView("login");
        });
    }, []);

    useEffect(() => {
        if (view !== "welcome" && view !== "login") return;
        clearSession();
        setAuthToken(null);
        setCustomerId(null);
    }, [view]);

    useEffect(() => {
        if (
            view === "welcome" ||
            view === "login" ||
            view === "register" ||
            view === "forgotAccessCode"
        )
            return;
        verifySession();
    }, [view]);

    const [registerPhone, setRegisterPhone] = useState("");
    const [registerPhoneCountry, setRegisterPhoneCountry] = useState<CountryCode>("US");

    const [registerAddressDetail, setRegisterAddressDetail] = useState<AddressDetail>(EMPTY_ADDRESS_DETAIL);
    const patchRegisterAddressDetail = (patch: Partial<AddressDetail>) =>
        setRegisterAddressDetail((prev) => ({ ...prev, ...patch }));

    const [physicalAddressDetail, setPhysicalAddressDetail] = useState<AddressDetail>(EMPTY_ADDRESS_DETAIL);
    const patchPhysicalAddressDetail = (patch: Partial<AddressDetail>) =>
        setPhysicalAddressDetail((prev) => ({ ...prev, ...patch }));
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [registerAccessCode, setRegisterAccessCode] = useState("");

    const [registerFirstName, setRegisterFirstName] = useState("");
    const [registerPaternalLastName, setRegisterPaternalLastName] = useState("");
    const [registerMaternalLastName, setRegisterMaternalLastName] = useState("");
    const [registerDobDay, setRegisterDobDay] = useState("");
    const [registerDobMonth, setRegisterDobMonth] = useState("");
    const [registerDobYear, setRegisterDobYear] = useState("");
    const [registerNationality, setRegisterNationality] = useState("");
    const [registerForeignIdType, setRegisterForeignIdType] = useState("");
    const [registerForeignId, setRegisterForeignId] = useState("");
    const [registerGender, setRegisterGender] = useState("");
    const [registerSsnLast4, setRegisterSsnLast4] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerAddress1, setRegisterAddress1] = useState("");
    const [registerCity, setRegisterCity] = useState("");
    const [registerState, setRegisterState] = useState("");
    const [registerZipCode, setRegisterZipCode] = useState("");
    const [registerCountry, setRegisterCountry] = useState("");

    const [identificationFrontFile, setIdentificationFrontFile] = useState<string | null>(null);
    const [identificationBackFile, setIdentificationBackFile] = useState<string | null>(null);

    const [profileFullName] = useState("");
    const [profileEmail, setProfileEmail] = useState("");
    const [profileAddress, setProfileAddress] = useState("");
    const [profileSaved, setProfileSaved] = useState(false);
    const handleProfileSave = () => { setProfileSaved(true); };

    const [physicalAddress1, setPhysicalAddress1] = useState("");
    const [physicalAddress2, setPhysicalAddress2] = useState("");
    const [physicalCity, setPhysicalCity] = useState("");
    const [physicalState, setPhysicalState] = useState("");
    const [physicalZip, setPhysicalZip] = useState("");
    const [physicalCountry, setPhysicalCountry] = useState("");
    const [physicalCardRequested, setPhysicalCardRequested] = useState(false);

    const allTransactions = [
        {
            id: "1",
            type: "virtual",
            label: t.zelleDeposit,
            amount: "+$500.00",
            date: "MAR 02, 2026",
            color: "#16A34A",
        },
        {
            id: "2",
            type: "physical",
            label: "POS Purchase",
            amount: "-$46.20",
            date: "MAR 05, 2026",
            color: "#EF4444",
        },
        {
            id: "3",
            type: "remittance",
            label: "Mario Diaz / 1500 MXN",
            amount: "$100.00",
            date: "MAR 05, 2026",
            color: "#EF4444",
        },
        {
            id: "4",
            type: "trading",
            label: "Wallet Transfer",
            amount: "-$120.00",
            date: "MAR 08, 2026",
            color: "#EF4444",
        },
    ];

    const [transactionsFilter, setTransactionsFilter] = useState<TransactionsFilter>("all");
    const filteredTransactions = useMemo(() => {
        return transactionsFilter === "all"
            ? allTransactions
            : allTransactions.filter((item) => item.type === transactionsFilter);
    }, [transactionsFilter, t]);

    const [tradingKycStarted, setTradingKycStarted] = useState(false);
    const [tradingKycVerified, setTradingKycVerified] = useState(false);

    const [walletId] = useState("WLT-9X7A-32BC-4410");
    const [walletFunds, setWalletFunds] = useState(3250.75);

    const [destinationWalletId, setDestinationWalletId] = useState("");
    const [transferAmount, setTransferAmount] = useState("");

    const [transferSubmitted, setTransferSubmitted] = useState(false);

    const handleTradingTransfer = () => {
        const amount = Number(transferAmount);

        if (!amount || amount <= 0 || amount > walletFunds || !destinationWalletId.trim()) {
            return;
        }

        setWalletFunds((prev) => Number((prev - amount).toFixed(2)));
        setTransferSubmitted(true);

        setTransferAmount("");
        setDestinationWalletId("");
    };

    const [beneficiaryFirstName, setBeneficiaryFirstName] = useState("");
    const [beneficiaryPaternalLastName, setBeneficiaryPaternalLastName] = useState("");
    const [beneficiaryMaternalLastName, setBeneficiaryMaternalLastName] = useState("");
    const [beneficiaryPhone, setBeneficiaryPhone] = useState("");
    const [beneficiaryPhoneCountry, setBeneficiaryPhoneCountry] = useState<CountryCode>("MX");
    const [beneficiaryResidenceState, setBeneficiaryResidenceState] = useState("");
    const [beneficiaryResidenceCity, setBeneficiaryResidenceCity] = useState("");
    const [beneficiaryEmail, setBeneficiaryEmail] = useState("");
    const [beneficiaryClabe, setBeneficiaryClabe] = useState("");
    const [beneficiarySaved, setBeneficiarySaved] = useState(false);

    const handleBeneficiarySave = () => {
        setBeneficiarySaved(true);
    };

    const [availableUsdBalance, setAvailableUsdBalance] = useState(2450);
    const [sendAmountUsd, setSendAmountUsd] = useState("");
    const [exchangeRate] = useState(17.25);
    const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState("");
    const [sendMoneySuccess, setSendMoneySuccess] = useState(false);
    const [sendMoneyError, setSendMoneyError] = useState("");

    type TransactionItem = {
        id: string;
        type: string;
        label: string;
        amount: string;
        mxnAmount: string;
        exchangeRate: string;
        beneficiary: string;
        date: string;
        color: string;
    };
    const [item, setItem] = useState<TransactionItem | undefined>();

    const beneficiaries = [
        {
            id: "1",
            fullName: "Juan Pérez",
            phone: "+52 55 1234 5678",
            city: "CDMX",
            state: "CDMX",
        },
        {
            id: "2",
            fullName: "María López",
            phone: "+52 81 5555 2222",
            city: "Monterrey",
            state: "Nuevo León",
        },
    ];

    type Beneficiary = {
        id: string;
        fullName: string;
        phone: string;
        city: string;
        state: string;
    };

    const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);

    const amountToReceiveMxn = Number(sendAmountUsd || 0) * exchangeRate;

    const handleSendMoney = () => {
        const amount = Number(sendAmountUsd);

        setSendMoneySuccess(false);
        setSendMoneyError("");

        if (!selectedBeneficiaryId || !amount || amount <= 0) {
            return;
        }

        if (amount > availableUsdBalance) {
            setSendMoneyError(t.insufficientFunds);
            return;
        }

        setAvailableUsdBalance((prev) => Number((prev - amount).toFixed(2)));
        setSendMoneySuccess(true);

        setView("sendMoneyConfirmation");
    };

    const drawerWidth = 288;
    const overlayOpacity = useRef(new Animated.Value(0)).current;
    const drawerTranslateX = useRef(new Animated.Value(drawerWidth)).current;

    const handlePhysicalCardSubmit = () => {
        setPhysicalCardRequested(true);
    };

    const [isFactoryInactive, setIsFactoryInactive] = useState(true);
    const [activeCardIndex, setActiveCardIndex] = useState(0);
    const [showSecureCodeModal, setShowSecureCodeModal] = useState(false);
    const [secureCode, setSecureCode] = useState("");
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [cardNumber, setCardNumber] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");
    const [showVirtualCardModal, setShowVirtualCardModal] = useState(false);
    const [virtualSecureCode, setVirtualSecureCode] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [showCardData, setShowCardData] = useState(false);

    const handleActivateCard = () => {
        if (secureCode.length !== 6) return;

        setIsFactoryInactive(false);
        setIsCardActive(true);
        setShowSecureCodeModal(false);
        setShowSuccessMessage(true);
        setSecureCode("");

        setTimeout(() => {
            setShowSuccessMessage(false);
        }, 3000);
    };

    useEffect(() => {
        Animated.parallel([
            Animated.timing(overlayOpacity, {
                toValue: isMenuOpen ? 1 : 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(drawerTranslateX, {
                toValue: isMenuOpen ? 0 : drawerWidth,
                duration: 240,
                useNativeDriver: true,
            }),
        ]).start();
    }, [isMenuOpen]);

    const transactions = useMemo(
        () => [
            {
                label: t.zelleDeposit,
                amount: "+$500.00",
                color: SUCCESS,
                bg: SUCCESS_SURFACE,
                icon: <ArrowDownLeft size={18} color={SUCCESS} />,
            },
            {
                label: t.servicePayment,
                amount: "-$80.00",
                color: DANGER,
                bg: DANGER_SURFACE,
                icon: <ArrowUpRight size={18} color={DANGER} />,
            },
        ],
        [t]
    );

    if (__DEV__ && isShowcaseOpen) {
        return (
            <ScreenBackground>
                <ComponentsShowcaseScreen onClose={() => setIsShowcaseOpen(false)} />
            </ScreenBackground>
        );
    }

    return (
        <ScreenBackground>
            {view === "welcome" && (
                <WelcomeScreen t={t} language={language} setLanguage={setLanguage} setView={setView} />
            )}

            {view === "login" && (
                <LoginScreen
                    t={t}
                    language={language}
                    setLanguage={setLanguage}
                    setView={setView}
                    setRegStep={setRegStep}
                    onLoginSuccess={handleLoginSuccess}
                    sessionEndedReason={sessionEndedReason}
                    onSessionNoticeDismissed={() => setSessionEndedReason(null)}
                    prefilledPhone={
                        registerPhone.length === 10 ? toE164(registerPhone, registerPhoneCountry) : ""
                    }
                    postLoginView={isNewDevice ? "securityAlert" : "dashboard"}
                />
            )}

            {view === "forgotAccessCode" && (
                <ForgotAccessCodeView t={t} setView={setView} />
            )}

            {view === "register" && (
                <RegisterSteps
                    t={t}
                    language={language}
                    regStep={regStep}
                    setRegStep={setRegStep}
                    setView={setView}
                    registerPhone={registerPhone}
                    setRegisterPhone={setRegisterPhone}
                    registerPhoneCountry={registerPhoneCountry}
                    setRegisterPhoneCountry={setRegisterPhoneCountry}
                    registerAddressDetail={registerAddressDetail}
                    setRegisterAddressDetail={patchRegisterAddressDetail}
                    otp={otp}
                    setOtp={setOtp}
                    registerAccessCode={registerAccessCode}
                    setRegisterAccessCode={setRegisterAccessCode}
                    identificationFrontFile={identificationFrontFile}
                    identificationBackFile={identificationBackFile}
                    setIdentificationFrontFile={setIdentificationFrontFile}
                    setIdentificationBackFile={setIdentificationBackFile}
                    registerFirstName={registerFirstName}
                    setRegisterFirstName={setRegisterFirstName}
                    registerPaternalLastName={registerPaternalLastName}
                    setRegisterPaternalLastName={setRegisterPaternalLastName}
                    registerMaternalLastName={registerMaternalLastName}
                    setRegisterMaternalLastName={setRegisterMaternalLastName}
                    registerDobDay={registerDobDay}
                    setRegisterDobDay={setRegisterDobDay}
                    registerDobMonth={registerDobMonth}
                    setRegisterDobMonth={setRegisterDobMonth}
                    registerDobYear={registerDobYear}
                    setRegisterDobYear={setRegisterDobYear}
                    registerNationality={registerNationality}
                    setRegisterNationality={setRegisterNationality}
                    registerForeignIdType={registerForeignIdType}
                    setRegisterForeignIdType={setRegisterForeignIdType}
                    registerForeignId={registerForeignId}
                    setRegisterForeignId={setRegisterForeignId}
                    registerGender={registerGender}
                    setRegisterGender={setRegisterGender}
                    registerSsnLast4={registerSsnLast4}
                    setRegisterSsnLast4={setRegisterSsnLast4}
                    registerEmail={registerEmail}
                    setRegisterEmail={setRegisterEmail}
                    registerAddress1={registerAddress1}
                    setRegisterAddress1={setRegisterAddress1}
                    registerCity={registerCity}
                    setRegisterCity={setRegisterCity}
                    registerState={registerState}
                    setRegisterState={setRegisterState}
                    registerZipCode={registerZipCode}
                    setRegisterZipCode={setRegisterZipCode}
                    registerCountry={registerCountry}
                    setRegisterCountry={setRegisterCountry}
                />
            )}

            {view === "kyc" && <KycView t={t} setView={setView} />}

            {view === "dashboard" && (
                <DashboardView
                    t={t}
                    isFactoryInactive={isFactoryInactive}
                    isCardActive={isCardActive}
                    setIsCardActive={setIsCardActive}
                    setIsMenuOpen={setIsMenuOpen}
                    onBalancePress={() => setView("multiCurrency")}
                    transactions={transactions}
                    activeCardIndex={activeCardIndex}
                    setActiveCardIndex={setActiveCardIndex}
                    showSuccessMessage={showSuccessMessage}
                    setShowSecureCodeModal={setShowSecureCodeModal}
                    showSecureCodeModal={showSecureCodeModal}
                    setSecureCode={setSecureCode}
                    secureCode={secureCode}
                    cardNumber={cardNumber}
                    setCardNumber={setCardNumber}
                    expiryDate={expiryDate}
                    setExpiryDate={setExpiryDate}
                    cvv={cvv}
                    setCvv={setCvv}
                    showVirtualCardModal={showVirtualCardModal}
                    setShowVirtualCardModal={setShowVirtualCardModal}
                    virtualSecureCode={virtualSecureCode}
                    setVirtualSecureCode={setVirtualSecureCode}
                    birthDate={birthDate}
                    setBirthDate={setBirthDate}
                    showCardData={showCardData}
                    setShowCardData={setShowCardData}
                    handleActivateCard={handleActivateCard}
                    handleActivateVirtualCard={handleActivateCard}
                />
            )}

            {view === "profile" && (
                <ProfileView
                    t={t}
                    setView={setView}
                    profileFullName={profileFullName}
                    profileEmail={profileEmail}
                    setProfileEmail={setProfileEmail}
                    profileAddress={profileAddress}
                    setProfileAddress={setProfileAddress}
                    profileSaved={profileSaved}
                    handleProfileSave={handleProfileSave}
                />
            )}

            {view === "transactions" && (
                <TransactionsView
                    t={t}
                    setView={setView}
                    transactionsFilter={transactionsFilter}
                    setTransactionsFilter={setTransactionsFilter}
                    filteredTransactions={filteredTransactions}
                />
            )}

            {view === "physicalCard" && (
                <PhysicalCardView
                    t={t}
                    language={language}
                    setView={setView}
                    physicalAddress1={physicalAddress1}
                    setPhysicalAddress1={setPhysicalAddress1}
                    physicalAddress2={physicalAddress2}
                    setPhysicalAddress2={setPhysicalAddress2}
                    physicalCity={physicalCity}
                    setPhysicalCity={setPhysicalCity}
                    physicalState={physicalState}
                    setPhysicalState={setPhysicalState}
                    physicalZip={physicalZip}
                    setPhysicalZip={setPhysicalZip}
                    physicalCountry={physicalCountry}
                    setPhysicalCountry={setPhysicalCountry}
                    physicalAddressDetail={physicalAddressDetail}
                    setPhysicalAddressDetail={patchPhysicalAddressDetail}
                    physicalCardRequested={physicalCardRequested}
                    handlePhysicalCardSubmit={handlePhysicalCardSubmit}
                />
            )}

            {view === "trading" && (
                <TradingView
                    t={t}
                    language={language}
                    setView={setView}
                    tradingKycStarted={tradingKycStarted}
                    setTradingKycStarted={setTradingKycStarted}
                    tradingKycVerified={tradingKycVerified}
                    setTradingKycVerified={setTradingKycVerified}
                    walletId={walletId}
                    walletFunds={walletFunds}
                    destinationWalletId={destinationWalletId}
                    setDestinationWalletId={setDestinationWalletId}
                    transferAmount={transferAmount}
                    setTransferAmount={setTransferAmount}
                    transferSubmitted={transferSubmitted}
                    handleTradingTransfer={handleTradingTransfer}
                />
            )}

            {view === "beneficiaries" && (
                <BeneficiariesView
                    t={t}
                    language={language}
                    setView={setView}
                    beneficiaryFirstName={beneficiaryFirstName}
                    setBeneficiaryFirstName={setBeneficiaryFirstName}
                    beneficiaryPaternalLastName={beneficiaryPaternalLastName}
                    setBeneficiaryPaternalLastName={setBeneficiaryPaternalLastName}
                    beneficiaryMaternalLastName={beneficiaryMaternalLastName}
                    setBeneficiaryMaternalLastName={setBeneficiaryMaternalLastName}
                    beneficiaryPhone={beneficiaryPhone}
                    setBeneficiaryPhone={setBeneficiaryPhone}
                    beneficiaryPhoneCountry={beneficiaryPhoneCountry}
                    setBeneficiaryPhoneCountry={setBeneficiaryPhoneCountry}
                    beneficiaryResidenceState={beneficiaryResidenceState}
                    setBeneficiaryResidenceState={setBeneficiaryResidenceState}
                    beneficiaryResidenceCity={beneficiaryResidenceCity}
                    setBeneficiaryResidenceCity={setBeneficiaryResidenceCity}
                    beneficiaryEmail={beneficiaryEmail}
                    setBeneficiaryEmail={setBeneficiaryEmail}
                    beneficiaryClabe={beneficiaryClabe}
                    setBeneficiaryClabe={setBeneficiaryClabe}
                    beneficiarySaved={beneficiarySaved}
                    handleBeneficiarySave={handleBeneficiarySave}
                />
            )}

            {view === "sendMoney" && (
                <SendMoneyView
                    t={t}
                    setView={setView}
                    availableUsdBalance={availableUsdBalance}
                    sendAmountUsd={sendAmountUsd}
                    setSendAmountUsd={setSendAmountUsd}
                    exchangeRate={exchangeRate}
                    amountToReceiveMxn={amountToReceiveMxn}
                    beneficiaries={beneficiaries}
                    selectedBeneficiaryId={selectedBeneficiaryId}
                    setSelectedBeneficiaryId={setSelectedBeneficiaryId}
                    sendMoneySuccess={sendMoneySuccess}
                    sendMoneyError={sendMoneyError}
                    handleSendMoney={handleSendMoney}
                />
            )}

            {view === "sendMoneyConfirmation" && (
                <SendMoneyConfirmationView
                    t={t}
                    setView={setView}
                    availableUsdBalance={availableUsdBalance}
                    sendAmountUsd={sendAmountUsd}
                    setSendAmountUsd={setSendAmountUsd}
                    exchangeRate={exchangeRate}
                    amountToReceiveMxn={amountToReceiveMxn}
                    beneficiaries={beneficiaries}
                    selectedBeneficiaryId={selectedBeneficiaryId}
                    setSelectedBeneficiaryId={setSelectedBeneficiaryId}
                    sendMoneySuccess={sendMoneySuccess}
                    sendMoneyError={sendMoneyError}
                    handleSendMoney={handleSendMoney}
                />
            )}

            {view === "multiCurrency" && (
                <MultiCurrencyAccountsScreen t={t} setView={setView} />
            )}

            {view === "disputeOptions" && (
                <DisputeOptionsScreen t={t} setView={setView} />
            )}

            {view === "twoStepVerification" && (
                <TwoStepVerificationScreen t={t} setView={setView} />
            )}

            {view === "securityAlert" && (
                <SecurityAlertScreen t={t} setView={setView} />
            )}

            {view === "remittanceDetail" && (
                <RemittanceDetail
                    t={t}
                    setView={setView}
                    item={item}
                />
            )}

            <DrawerMenu
                t={t}
                language={language}
                visible={isMenuOpen}
                overlayOpacity={overlayOpacity}
                drawerTranslateX={drawerTranslateX}
                setIsMenuOpen={setIsMenuOpen}
                setView={setView}
            />

            {__DEV__ ? (
                <Pressable
                    testID="dev-showcaseButton"
                    accessibilityLabel="Open component showcase"
                    onPress={() => setIsShowcaseOpen(true)}
                    style={devStyles.showcaseButton}
                >
                    <Text style={devStyles.showcaseLabel}>UI</Text>
                </Pressable>
            ) : null}
        </ScreenBackground>
    );
}

/** Atajo de desarrollo: no se compila en release porque va tras `__DEV__`. */
const devStyles = StyleSheet.create({
    showcaseButton: {
        position: "absolute",
        left: 12,
        bottom: 96,
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255,255,255,0.07)",
        borderWidth: 1,
        borderColor: "rgba(124,92,255,0.45)",
    },
    showcaseLabel: {
        fontFamily: "Inter-SemiBold",
        fontSize: 13,
        color: "#FFFFFF",
    },
});

export default function App() {
    return (
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
            <AppContent />
        </SafeAreaProvider>
    );
}
