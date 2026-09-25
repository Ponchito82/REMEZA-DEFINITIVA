import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Pressable, Text, StyleSheet } from "react-native";
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react-native";

import { ScreenBackground } from "./src/components/ui";
import { DANGER, DANGER_SURFACE, SUCCESS, SUCCESS_SURFACE } from "./src/theme/colors";

import { translations } from "./src/i18n/translations";
import { Beneficiary, Language, Transaction, TransactionsFilter, ViewName } from "./src/types/app";

import ComponentsShowcaseScreen from "./src/screens/ComponentsShowcaseScreen";
import { useViewHistory } from "./src/hooks/useViewHistory";
import MultiCurrencyAccountsScreen from "./src/screens/MultiCurrencyAccountsScreen";
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
import type { ProfileTarget } from "./src/screens/ProfileView";
import NotificationSettingsScreen from "./src/screens/NotificationSettingsScreen";
import TransferHistoryScreen from "./src/screens/TransferHistoryScreen";
import BeneficiaryListScreen from "./src/screens/beneficiaries/BeneficiaryListScreen";
import ConfirmBeneficiaryScreen from "./src/screens/beneficiaries/ConfirmBeneficiaryScreen";
import BeneficiaryAddedScreen from "./src/screens/beneficiaries/BeneficiaryAddedScreen";
import BeneficiaryDetailScreen from "./src/screens/beneficiaries/BeneficiaryDetailScreen";
import EditBeneficiaryScreen from "./src/screens/beneficiaries/EditBeneficiaryScreen";
import DeleteBeneficiaryScreen from "./src/screens/beneficiaries/DeleteBeneficiaryScreen";
import {
    TransferFailedScreen,
    TransferProcessingScreen,
    TransferReceiptScreen,
    TransferSuccessScreen,
} from "./src/screens/transfer/TransferScreens";
import type { TransferSummary } from "./src/screens/transfer/TransferDetails";
import SupportFlow from "./src/flows/SupportFlow";
import type { SupportEntry } from "./src/flows/SupportFlow";
import BankAccountFlow from "./src/flows/BankAccountFlow";
import SecurityFlow from "./src/flows/SecurityFlow";
import RecoveryFlow from "./src/flows/RecoveryFlow";
import ServicePaymentFlow from "./src/flows/ServicePaymentFlow";
import CardControlsFlow from "./src/flows/CardControlsFlow";
import type { CardEntry } from "./src/flows/CardControlsFlow";
import { MOCK_BENEFICIARIES } from "./src/mocks/remeza";
import { submitTransfer } from "./src/services/transfers";
import { bankFromClabe } from "./src/utils/bank";
import { formatMxPhone } from "./src/utils/beneficiary";
import { formatDateTime } from "./src/utils/date";
import TransactionsView from "./src/screens/TransactionsView";
import PhysicalCardView from "./src/screens/PhysicalCardView";
import BeneficiariesView from "./src/screens/BeneficiariesView";
import SendMoneyView from "./src/screens/SendMoneyView";
import TransactionDetailView from "./src/screens/TransactionDetailView";
import AppealView from "./src/screens/AppealView";
import LogoutConfirmScreen from "./src/screens/LogoutConfirmScreen";
import SendMoneyConfirmationView from "./src/screens/SendMoneyConfirmationView";
import { AddressDetail, EMPTY_ADDRESS_DETAIL } from "./src/components/AddressFields";
import { CountryCode, stateNameByCode } from "./src/services/geo";
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

    const [view, setView] = useViewHistory("welcome");
    const [regStep, setRegStep] = useState(1);
    const [_authToken, setAuthToken] = useState<string | null>(null);
    const [_customerId, setCustomerId] = useState<string | null>(null);
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

    /** Pantalla a la que vuelve "Cancelar" en la confirmacion de cierre de sesion */
    const [logoutReturnView, setLogoutReturnView] = useState<ViewName>("dashboard");
    const requestLogout = () => {
        setLogoutReturnView(view);
        setView("logoutConfirm");
    };
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


    const [registerPhone, setRegisterPhone] = useState("");
    const [registerPhoneCountry, setRegisterPhoneCountry] = useState<CountryCode>("US");

    const [registerAddressDetail, setRegisterAddressDetail] = useState<AddressDetail>(EMPTY_ADDRESS_DETAIL);
    const patchRegisterAddressDetail = (patch: Partial<AddressDetail>) =>
        setRegisterAddressDetail((prev) => ({ ...prev, ...patch }));

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

    // El perfil es de solo lectura: se arma con los datos que la persona dio en
    // el KYC del registro y no hay forma de editarlos desde la app.
    const profileFullName = [registerFirstName, registerPaternalLastName, registerMaternalLastName]
        .map((part) => part.trim())
        .filter(Boolean)
        .join(" ");
    const profilePhone = registerPhone.length > 0 ? toE164(registerPhone, registerPhoneCountry) : "";
    const profileAddress = [
        [registerAddressDetail.exteriorNumber, registerAddressDetail.street].filter(Boolean).join(" "),
        registerAddressDetail.interiorNumber ? `Apt ${registerAddressDetail.interiorNumber}` : "",
        registerCity,
        [registerState ? stateNameByCode("US", registerState) : "", registerZipCode]
            .filter(Boolean)
            .join(" "),
    ]
        .filter(Boolean)
        .join(", ");

    const [physicalCardRequested, setPhysicalCardRequested] = useState(false);

    const [transactionRecords, setTransactionRecords] = useState<Transaction[]>(() => [
        {
            id: "1",
            type: "virtual",
            labelKey: "zelleDeposit",
            label: "Zelle Deposit",
            amount: "+$500.00",
            amountUsd: 500,
            date: "MAR 02, 2026",
            status: "completed",
            provider: "blackpay",
            reference: "RMZ-000001",
        },
        {
            id: "2",
            type: "physical",
            label: "POS Purchase",
            amount: "-$46.20",
            amountUsd: 46.2,
            date: "MAR 05, 2026",
            status: "completed",
            provider: "blackpay",
            reference: "RMZ-000002",
        },
        {
            id: "3",
            type: "remittance",
            label: "Mario Diaz / 1,725.00 MXN",
            amount: "-$100.00",
            amountUsd: 100,
            date: "MAR 05, 2026",
            status: "pending",
            provider: "remeza",
            reference: "RMZ-000003",
            mxnAmount: 1725,
            exchangeRate: 17.25,
            beneficiary: "Mario Diaz",
        },
    ]);

    const allTransactions = useMemo(
        () =>
            transactionRecords.map((tx) => ({
                ...tx,
                label: tx.labelKey ? (t as any)[tx.labelKey] : tx.label,
            })),
        [transactionRecords, t]
    );

    const [transactionsFilter, setTransactionsFilter] = useState<TransactionsFilter>("all");
    const filteredTransactions = useMemo(() => {
        return transactionsFilter === "all"
            ? allTransactions
            : allTransactions.filter((item) => item.type === transactionsFilter);
    }, [transactionsFilter, allTransactions]);

    const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
    const selectedTransaction = allTransactions.find((tx) => tx.id === selectedTransactionId);

    const openTransaction = (id: string) => {
        setSelectedTransactionId(id);
        setView("transactionDetail");
    };

    // Apelaciones enviadas, por id de movimiento: motivo elegido.
    const [appeals, setAppeals] = useState<Record<string, string>>({});

    const handleSubmitAppeal = (id: string, reason: string) => {
        setAppeals((prev) => ({ ...prev, [id]: reason }));
    };

    const handleCancelTransaction = (id: string) => {
        const target = transactionRecords.find((tx) => tx.id === id);
        if (!target || target.status !== "pending") return;

        setTransactionRecords((prev) =>
            prev.map((tx) => (tx.id === id ? { ...tx, status: "cancelled" } : tx))
        );
        setAvailableUsdBalance((prev) => Number((prev + target.amountUsd).toFixed(2)));
    };

    const [beneficiaryFirstName, setBeneficiaryFirstName] = useState("");
    const [beneficiaryPaternalLastName, setBeneficiaryPaternalLastName] = useState("");
    const [beneficiaryMaternalLastName, setBeneficiaryMaternalLastName] = useState("");
    const [beneficiaryPhone, setBeneficiaryPhone] = useState("");
    const [beneficiaryResidenceState, setBeneficiaryResidenceState] = useState("");
    const [beneficiaryResidenceCity, setBeneficiaryResidenceCity] = useState("");
    const [beneficiaryEmail, setBeneficiaryEmail] = useState("");
    const [beneficiaryClabe, setBeneficiaryClabe] = useState("");

    const [availableUsdBalance, setAvailableUsdBalance] = useState(2450);
    const [sendAmountUsd, setSendAmountUsd] = useState("");
    const [exchangeRate] = useState(17.25);
    const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState("");
    const [sendMoneySuccess, setSendMoneySuccess] = useState(false);
    const [sendMoneyError, setSendMoneyError] = useState("");

    /** Beneficiarios del cliente. Mock hasta que exista el endpoint. */
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(MOCK_BENEFICIARIES);
    /** Beneficiario abierto en detalle, edicion, borrado o recien agregado */
    const [activeBeneficiaryId, setActiveBeneficiaryId] = useState<string | null>(null);
    const activeBeneficiary = beneficiaries.find((b) => b.id === activeBeneficiaryId);

    const clearBeneficiaryForm = () => {
        setBeneficiaryFirstName("");
        setBeneficiaryPaternalLastName("");
        setBeneficiaryMaternalLastName("");
        setBeneficiaryPhone("");
        setBeneficiaryResidenceState("");
        setBeneficiaryResidenceCity("");
        setBeneficiaryEmail("");
        setBeneficiaryClabe("");
    };

    /** Borrador del alta, para "Confirmar datos del beneficiario" (34) */
    const beneficiaryDraft = {
        fullName: [beneficiaryFirstName, beneficiaryPaternalLastName, beneficiaryMaternalLastName]
            .map((part) => part.trim())
            .filter(Boolean)
            .join(" "),
        phone: formatMxPhone(beneficiaryPhone),
        city: beneficiaryResidenceCity.trim(),
        state: beneficiaryResidenceState.trim(),
        email: beneficiaryEmail.trim() || undefined,
        clabe: beneficiaryClabe,
    };

    /** El formulario (33) ya valido: pasa a confirmar (34). */
    const handleBeneficiarySave = () => {
        setView("beneficiaryConfirm");
    };

    // TODO API: alta del beneficiario.
    const handleConfirmBeneficiary = () => {
        const created: Beneficiary = {
            id: `b-${Date.now()}`,
            firstName: beneficiaryFirstName.trim(),
            paternalLastName: beneficiaryPaternalLastName.trim(),
            maternalLastName: beneficiaryMaternalLastName.trim() || undefined,
            ...beneficiaryDraft,
            favorite: false,
            createdAt: Date.now(),
        };
        setBeneficiaries((prev) => [...prev, created]);
        setActiveBeneficiaryId(created.id);
        clearBeneficiaryForm();
        setView("beneficiaryAdded");
    };

    // TODO API: actualizar el beneficiario.
    const updateBeneficiary = (updated: Beneficiary) => {
        setBeneficiaries((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    };

    const toggleFavorite = (id: string, value?: boolean) => {
        setBeneficiaries((prev) =>
            prev.map((b) => (b.id === id ? { ...b, favorite: value ?? !b.favorite } : b))
        );
    };

    // TODO API: borrar el beneficiario.
    const deleteBeneficiary = (id: string) => {
        setBeneficiaries((prev) => prev.filter((b) => b.id !== id));
        if (selectedBeneficiaryId === id) setSelectedBeneficiaryId("");
        setActiveBeneficiaryId(null);
        setView("beneficiaries");
    };

    const sendToBeneficiary = (id: string) => {
        setSelectedBeneficiaryId(id);
        setView("sendMoney");
    };

    /** Envio en curso o recien hecho: lo muestran las pantallas 40 a 44 */
    const [transferSummary, setTransferSummary] = useState<TransferSummary | null>(null);
    const [transferFailReason, setTransferFailReason] = useState("");

    const amountToReceiveMxn = Number(sendAmountUsd || 0) * exchangeRate;

    /**
     * "Enviar" en la pantalla 13: valida y pasa a revisar (40). Todavia no se
     * cobra nada; el cobro ocurre al confirmar.
     */
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

        const beneficiary = beneficiaries.find((b) => b.id === selectedBeneficiaryId);
        setTransferSummary({
            beneficiaryName: beneficiary?.fullName ?? "",
            bankName: bankFromClabe(beneficiary?.clabe),
            clabe: beneficiary?.clabe,
            amountUsd: amount,
            mxnAmount: Number((amount * exchangeRate).toFixed(2)),
            exchangeRate,
            at: Date.now(),
        });
        setView("sendMoneyConfirmation");
    };

    /** "Confirmar transferencia" (40): procesa (41) y termina en 42 o 44. */
    const handleConfirmTransfer = async () => {
        if (!transferSummary) return;
        const amount = transferSummary.amountUsd;
        setView("transferProcessing");

        if (amount > availableUsdBalance) {
            setTransferFailReason(t.insufficientFunds);
            setView("transferFailed");
            return;
        }

        const result = await submitTransfer(amount);
        if (!result.ok) {
            setTransferFailReason(t.transferErrorGeneric);
            setView("transferFailed");
            return;
        }

        const createdAt = Date.now();
        const reference = `RMZ-${String(createdAt).slice(-6)}`;
        const { mxnAmount, beneficiaryName } = transferSummary;

        setAvailableUsdBalance((prev) => Number((prev - amount).toFixed(2)));
        setTransactionRecords((prev) => [
            {
                id: `tx-${createdAt}`,
                type: "remittance",
                label: `${beneficiaryName} / ${mxnAmount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })} MXN`,
                amount: `-$${amount.toFixed(2)}`,
                amountUsd: amount,
                date: new Date(createdAt)
                    .toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
                    .toUpperCase(),
                status: "pending",
                provider: "remeza",
                reference,
                createdAt,
                mxnAmount,
                exchangeRate: transferSummary.exchangeRate,
                beneficiary: beneficiaryName,
            },
            ...prev,
        ]);
        setTransferSummary({ ...transferSummary, at: createdAt, reference });
        setSendAmountUsd("");
        setSendMoneySuccess(true);
        setView("transferSuccess");
    };

    /** Pago de servicios hecho (54): descuenta el saldo y lo registra. */
    const handleServicePaid = (amount: number, concept: string, folio: string) => {
        const paidAt = Date.now();
        setAvailableUsdBalance((prev) => Number((prev - amount).toFixed(2)));
        setTransactionRecords((prev) => [
            {
                id: `sp-${paidAt}`,
                type: "virtual",
                label: concept,
                amount: `-$${amount.toFixed(2)}`,
                amountUsd: amount,
                date: new Date(paidAt)
                    .toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
                    .toUpperCase(),
                status: "completed",
                provider: "remeza",
                reference: folio,
            },
            ...prev,
        ]);
    };

    /** Entradas a los flujos que se abren desde el Perfil o el Login */
    const [supportEntry, setSupportEntry] = useState<SupportEntry>("live");
    const [supportReturnView, setSupportReturnView] = useState<ViewName>("profile");
    const [cardEntry, setCardEntry] = useState<CardEntry>("limits");
    const [profileNotice, setProfileNotice] = useState("");

    const openSupport = (entry: SupportEntry, returnTo: ViewName) => {
        setSupportEntry(entry);
        setSupportReturnView(returnTo);
        setView("support");
    };

    /**
     * Vistas que se usan sin sesion. La recuperacion de acceso (21 y la via por
     * correo) y el soporte abierto desde ella tambien lo son: si se sondeara la
     * sesion ahi, el 401 devolveria al Login con "Tu sesion expiro".
     */
    const isPublicView =
        view === "welcome" ||
        view === "login" ||
        view === "register" ||
        view === "forgotAccessCode" ||
        view === "recoverAccess" ||
        (view === "support" && supportReturnView === "recoverAccess");

    useEffect(() => {
        if (isPublicView) return;
        verifySession();
    }, [view, isPublicView]);

    const handleProfileOpen = (target: ProfileTarget) => {
        setProfileNotice("");
        switch (target) {
            case "security":
                return setView("security");
            case "notifications":
                return setView("notifications");
            case "paymentMethods":
                return setView("bankAccounts");
            case "helpCenter":
                return openSupport("helpCenter", "profile");
            case "support":
                return openSupport("live", "profile");
            case "cardLimits":
            case "deleteCard":
                setCardEntry(target === "cardLimits" ? "limits" : "delete");
                return setView("cardControls");
            case "logout":
                return requestLogout();
        }
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
    }, [isMenuOpen, overlayOpacity, drawerTranslateX]);

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

    /** Pantallas que en el PDF llevan las lineas de luz de las esquinas (31+) */
    const hasStreaks =
        view === "beneficiaries" ||
        view === "beneficiaryForm" ||
        view === "beneficiaryConfirm" ||
        view === "beneficiaryAdded" ||
        view === "beneficiaryDetail" ||
        view === "beneficiaryEdit" ||
        view === "beneficiaryDelete" ||
        view === "sendMoney" ||
        view === "sendMoneyConfirmation" ||
        view === "transferProcessing" ||
        view === "transferSuccess" ||
        view === "transferReceipt" ||
        view === "transferFailed" ||
        view === "transactionDetail" ||
        view === "cardControls" ||
        view === "servicePayments" ||
        view === "logoutConfirm";

    return (
        <ScreenBackground streaks={hasStreaks}>
            {view === "welcome" && (
                <WelcomeScreen t={t} language={language} setLanguage={setLanguage} setView={setView} />
            )}

            {view === "login" && (
                <LoginScreen
                    t={t}
                    language={language}
                    setLanguage={setLanguage}
                    setView={(next) =>
                        setView(next === "forgotAccessCode" ? "recoverAccess" : next)
                    }
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
                    fullName={profileFullName}
                    email={registerEmail.trim()}
                    phone={profilePhone}
                    address={profileAddress}
                    onOpen={handleProfileOpen}
                    notice={profileNotice}
                />
            )}

            {view === "transactions" && (
                <TransactionsView
                    t={t}
                    setView={setView}
                    transactionsFilter={transactionsFilter}
                    setTransactionsFilter={setTransactionsFilter}
                    filteredTransactions={filteredTransactions}
                    onSelectTransaction={openTransaction}
                />
            )}

            {view === "physicalCard" && (
                <PhysicalCardView
                    t={t}
                    setView={setView}
                    deliveryAddress={profileAddress}
                    physicalCardRequested={physicalCardRequested}
                    handlePhysicalCardSubmit={handlePhysicalCardSubmit}
                />
            )}

            {view === "beneficiaries" && (
                <BeneficiaryListScreen
                    t={t}
                    beneficiaries={beneficiaries}
                    onBack={() => setView("dashboard")}
                    onAdd={() => {
                        clearBeneficiaryForm();
                        setView("beneficiaryForm");
                    }}
                    onOpen={(id) => {
                        setActiveBeneficiaryId(id);
                        setView("beneficiaryDetail");
                    }}
                />
            )}

            {view === "beneficiaryForm" && (
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
                    beneficiaryResidenceState={beneficiaryResidenceState}
                    setBeneficiaryResidenceState={setBeneficiaryResidenceState}
                    beneficiaryResidenceCity={beneficiaryResidenceCity}
                    setBeneficiaryResidenceCity={setBeneficiaryResidenceCity}
                    beneficiaryEmail={beneficiaryEmail}
                    setBeneficiaryEmail={setBeneficiaryEmail}
                    beneficiaryClabe={beneficiaryClabe}
                    setBeneficiaryClabe={setBeneficiaryClabe}
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
                    onOpenHistory={() => setView("transferHistory")}
                />
            )}

            {view === "sendMoneyConfirmation" && transferSummary && (
                <SendMoneyConfirmationView
                    t={t}
                    language={language}
                    setView={setView}
                    summary={transferSummary}
                    handleSendMoney={handleConfirmTransfer}
                />
            )}

            {view === "multiCurrency" && (
                <MultiCurrencyAccountsScreen t={t} setView={setView} />
            )}

            {view === "twoStepVerification" && (
                <TwoStepVerificationScreen t={t} setView={setView} />
            )}

            {view === "securityAlert" && (
                <SecurityAlertScreen t={t} setView={setView} />
            )}

            {view === "transactionDetail" && (
                <TransactionDetailView
                    t={t}
                    setView={setView}
                    transaction={selectedTransaction}
                    onCancelTransaction={handleCancelTransaction}
                    appealed={!!(selectedTransactionId && appeals[selectedTransactionId])}
                />
            )}

            {view === "appeal" && (
                <AppealView
                    t={t}
                    setView={setView}
                    transaction={selectedTransaction}
                    submittedReason={selectedTransactionId ? appeals[selectedTransactionId] : undefined}
                    onSubmitAppeal={handleSubmitAppeal}
                />
            )}

            {view === "beneficiaryConfirm" && (
                <ConfirmBeneficiaryScreen
                    t={t}
                    draft={beneficiaryDraft}
                    onBack={() => setView("beneficiaryForm")}
                    onConfirm={handleConfirmBeneficiary}
                />
            )}

            {view === "beneficiaryAdded" && activeBeneficiary && (
                <BeneficiaryAddedScreen
                    t={t}
                    beneficiary={activeBeneficiary}
                    onSend={() => sendToBeneficiary(activeBeneficiary.id)}
                    onToggleFavorite={() => toggleFavorite(activeBeneficiary.id)}
                    onEdit={() => setView("beneficiaryEdit")}
                    onDelete={() => setView("beneficiaryDelete")}
                    onDone={() => setView("beneficiaries")}
                    onAddAnother={() => {
                        clearBeneficiaryForm();
                        setView("beneficiaryForm");
                    }}
                />
            )}

            {view === "beneficiaryDetail" && activeBeneficiary && (
                <BeneficiaryDetailScreen
                    t={t}
                    language={language}
                    beneficiary={activeBeneficiary}
                    onBack={() => setView("beneficiaries")}
                    onSend={() => sendToBeneficiary(activeBeneficiary.id)}
                    onToggleFavorite={(value) => toggleFavorite(activeBeneficiary.id, value)}
                    onEdit={() => setView("beneficiaryEdit")}
                    onDelete={() => setView("beneficiaryDelete")}
                />
            )}

            {view === "beneficiaryEdit" && activeBeneficiary && (
                <EditBeneficiaryScreen
                    t={t}
                    language={language}
                    beneficiary={activeBeneficiary}
                    onCancel={() => setView("beneficiaryDetail")}
                    onSave={(updated) => {
                        updateBeneficiary(updated);
                        setView("beneficiaryDetail");
                    }}
                />
            )}

            {view === "beneficiaryDelete" && activeBeneficiary && (
                <DeleteBeneficiaryScreen
                    t={t}
                    beneficiary={activeBeneficiary}
                    onConfirm={() => deleteBeneficiary(activeBeneficiary.id)}
                    onCancel={() => setView("beneficiaryDetail")}
                />
            )}

            {view === "transferProcessing" && transferSummary && (
                <TransferProcessingScreen t={t} language={language} summary={transferSummary} />
            )}

            {view === "transferSuccess" && transferSummary && (
                <TransferSuccessScreen
                    t={t}
                    language={language}
                    summary={transferSummary}
                    onViewReceipt={() => setView("transferReceipt")}
                    onDone={() => setView("dashboard")}
                />
            )}

            {view === "transferReceipt" && transferSummary && (
                <TransferReceiptScreen
                    t={t}
                    language={language}
                    summary={transferSummary}
                    onBack={() => setView("transferSuccess")}
                />
            )}

            {view === "transferFailed" && transferSummary && (
                <TransferFailedScreen
                    t={t}
                    language={language}
                    summary={transferSummary}
                    reason={transferFailReason}
                    onRetry={() => setView("sendMoneyConfirmation")}
                    onHome={() => setView("dashboard")}
                />
            )}

            {view === "recoverAccess" && (
                <RecoveryFlow
                    t={t}
                    onByPhone={() => setView("forgotAccessCode")}
                    onSupport={() => openSupport("live", "recoverAccess")}
                    onSignIn={() => setView("login")}
                    onHome={() => setView("welcome")}
                    onExit={() => setView("login")}
                />
            )}

            {view === "support" && (
                <SupportFlow
                    t={t}
                    language={language}
                    entry={supportEntry}
                    onExit={() => setView(supportReturnView)}
                />
            )}

            {view === "security" && (
                <SecurityFlow
                    t={t}
                    onExit={() => setView("profile")}
                    onHome={() => setView("dashboard")}
                />
            )}

            {view === "notifications" && (
                <NotificationSettingsScreen t={t} onExit={() => setView("profile")} />
            )}

            {view === "bankAccounts" && (
                <BankAccountFlow t={t} language={language} onExit={() => setView("profile")} />
            )}

            {view === "cardControls" && (
                <CardControlsFlow
                    t={t}
                    entry={cardEntry}
                    onRemoved={() => {
                        setProfileNotice(t.cardRemoved);
                        setView("profile");
                    }}
                    onExit={() => setView("profile")}
                />
            )}

            {view === "servicePayments" && (
                <ServicePaymentFlow
                    t={t}
                    language={language}
                    availableUsdBalance={availableUsdBalance}
                    onPaid={handleServicePaid}
                    onExit={() => setView("dashboard")}
                />
            )}



            {view === "transferHistory" && (
                <TransferHistoryScreen
                    t={t}
                    transactions={allTransactions}
                    onBack={() => setView("sendMoney")}
                    onOpen={openTransaction}
                />
            )}

            {view === "logoutConfirm" && (
                <LogoutConfirmScreen
                    t={t}
                    onConfirm={() => setView("login")}
                    onCancel={() => setView(logoutReturnView)}
                />
            )}

            <DrawerMenu
                t={t}
                visible={isMenuOpen}
                overlayOpacity={overlayOpacity}
                drawerTranslateX={drawerTranslateX}
                setIsMenuOpen={setIsMenuOpen}
                setView={setView}
                onLogout={requestLogout}
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
