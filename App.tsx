import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Animated, Pressable, Text, StyleSheet } from "react-native";
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";

import { ScreenBackground, TourOverlay } from "./src/components/ui";
import ServiceUnavailableDialog from "./src/components/ui/ServiceUnavailableDialog";
import { TOUR_STEPS, stepTargetIds } from "./src/onboarding/tourSteps";

import { translations } from "./src/i18n/translations";
import { Beneficiary, Language, Transaction, TransactionsFilter, ViewName } from "./src/types/app";

import ComponentsShowcaseScreen from "./src/screens/ComponentsShowcaseScreen";
import { useViewHistory } from "./src/hooks/useViewHistory";
import MultiCurrencyAccountsScreen from "./src/screens/MultiCurrencyAccountsScreen";
import CreditHistoryScreen from "./src/screens/CreditHistoryScreen";
import CreditAmountScreen from "./src/screens/CreditAmountScreen";
import CreditSummaryScreen from "./src/screens/CreditSummaryScreen";
import CreditPaymentScreen from "./src/screens/CreditPaymentScreen";
import CreditPaymentSuccessScreen, { type CreditPaymentReceipt } from "./src/screens/CreditPaymentSuccessScreen";
import CreditMovementsScreen from "./src/screens/CreditMovementsScreen";
import CreditStatementsScreen from "./src/screens/CreditStatementsScreen";
import { buildCreditSimulation, creditPaymentDue, type CreditMovement } from "./src/utils/creditSimulation";
import TwoStepVerificationScreen from "./src/screens/TwoStepVerificationScreen";
import SecurityAlertScreen from "./src/screens/SecurityAlertScreen";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import ForgotAccessCodeView from "./src/screens/ForgotAccessCodeView";
import RegisterSteps from "./src/screens/RegisterSteps";
import DashboardView from "./src/screens/DashboardView";
import CardDetailScreen from "./src/screens/CardDetailScreen";
import KycView from "./src/screens/KycView";

import DrawerMenu from "./src/components/DrawerMenu";
import ProfileView from "./src/screens/ProfileView";
import type { ProfileTarget } from "./src/screens/ProfileView";
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
import { VIRTUAL_CARD_DATA } from "./src/screens/CardDetailScreen";
import type { CardEntry } from "./src/flows/CardControlsFlow";
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
    getToken,
    onUnauthorized,
    startSession,
} from "./src/api/session";
import { getBalance, getExchangeRate } from "./src/api/account";
import { ApiError } from "./src/api/client";
import {
    FORCE_BALANCE_ERROR,
    IGNORE_BALANCE_ERROR,
    SIMULATED_ADDRESS,
    SIMULATED_BALANCE_USD,
} from "./src/api/devFlags";
import { verifySession } from "./src/api/sessionProbe";
import { cancelOrder, createOrder, getHistory } from "./src/api/history";
import { getCardStatement } from "./src/api/cardTransactions";
import CardMovementsScreen, { CardMovementsState } from "./src/screens/CardMovementsScreen";
import { getProfile, ProfileData } from "./src/api/profile";
import {
    createBeneficiary,
    deleteBeneficiaryById,
    listBeneficiaries,
    setBeneficiaryFavorite,
    updateBeneficiaryById,
} from "./src/api/beneficiaries";
import { toE164 } from "./src/utils/phone";
import { isBiometricsEnabled, syncBiometricsFromServer } from "./src/services/securitySettings";

/**
 * Unico cliente de la base de pruebas (E.164 completo). No paso por el
 * registro de la app, asi que no trae nombre propio; se le asigna uno fijo
 * al iniciar sesion para que el perfil y la tarjeta no se vean vacios.
 */
const TEST_ACCOUNT_PHONE = "+525538068807";
const TEST_ACCOUNT_NAME = { first: "Mario", paternal: "Alcántara" };

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
        expiresInMs: number | undefined,
        loginPhone: string,
    ) => {
        setCustomerId(loggedInCustomerId);
        setAuthToken(token);
        setSessionEndedReason(null);
        startSession(loggedInCustomerId, token, expiresInMs);

        // Cuenta de pruebas (unico cliente de la base, sin registro propio en la
        // app): sin nombre no hay como armarlo, asi que se inyecta uno fijo para
        // que perfil y tarjeta no queden en blanco.
        if (loginPhone.trim() === TEST_ACCOUNT_PHONE && !registerFirstName) {
            setRegisterFirstName(TEST_ACCOUNT_NAME.first);
            setRegisterPaternalLastName(TEST_ACCOUNT_NAME.paternal);
        }
    };

    /**
     * Aviso de biometria: la primera vez en la sesion que se entra al
     * dashboard redirige a su pantalla (`biometricPrompt`, ver mas abajo). Si
     * no se activa ahi, se recuerda una vez al dia con un aviso pasivo en el
     * dashboard (no vuelve a redirigir por su cuenta).
     */
    const [biometricPromptShown, setBiometricPromptShown] = useState(false);
    /**
     * `true` cuando ya se le pregunto al backend si este dispositivo tiene la
     * biometria activa. Hasta entonces no se ofrece, para no mostrar el aviso a
     * quien ya la activo en una sesion anterior.
     */
    const [biometricsSynced, setBiometricsSynced] = useState(false);

    useEffect(() => {
        if (view !== "dashboard" || biometricsSynced) return;
        if (!getToken()) return setBiometricsSynced(true);
        syncBiometricsFromServer().finally(() => setBiometricsSynced(true));
    }, [view, biometricsSynced]);
    const [biometricReminderDay, setBiometricReminderDay] = useState<string | null>(null);
    const [biometricReminderVisible, setBiometricReminderVisible] = useState(false);

    useEffect(() => {
        if (view !== "dashboard" || !biometricsSynced || isBiometricsEnabled()) return;

        const today = new Date().toDateString();

        if (!biometricPromptShown) {
            setBiometricPromptShown(true);
            setBiometricReminderDay(today);
            setView("biometricPrompt");
            return;
        }

        if (biometricReminderDay !== today) {
            setBiometricReminderDay(today);
            setBiometricReminderVisible(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [view, biometricsSynced]);

    const handleBiometricPromptResolved = () => {
        setBiometricReminderVisible(false);
        setView("dashboard");
    };

    const handleBiometricReminderPress = () => {
        setBiometricReminderVisible(false);
        setView("biometricPrompt");
    };

    /**
     * Guia paso a paso: solo se lanza sola la primera vez que se entra al
     * dashboard (primer login de la sesion de la app). En logins siguientes
     * no vuelve a aparecer nada automatico; se puede repetir manualmente
     * desde Centro de ayuda -> Guia paso a paso (`handleStartGuideFromHelp`).
     * `tourPromptCheckedThisSession` se resetea al pasar por welcome/login
     * (ver mas abajo), asi que decide una sola vez por cada inicio de sesion.
     */
    const [hasSeenOnboardingTour, setHasSeenOnboardingTour] = useState(false);
    const [tourPromptCheckedThisSession, setTourPromptCheckedThisSession] = useState(false);
    const [tourActive, setTourActive] = useState(false);
    const [tourStepIndex, setTourStepIndex] = useState(0);

    const startTour = () => {
        setTourStepIndex(0);
        setTourActive(true);
    };

    const handleTourNext = useCallback(() => {
        setTourStepIndex((prev) => {
            if (prev >= TOUR_STEPS.length - 1) {
                setTourActive(false);
                return prev;
            }
            return prev + 1;
        });
    }, []);

    const handleTourSkip = () => {
        setTourActive(false);
    };

    useEffect(() => {
        if (view !== "dashboard" || tourPromptCheckedThisSession || !biometricsSynced) return;
        // La primera vez, el dashboard redirige a `biometricPrompt` en este
        // mismo tick (ver el efecto de arriba): hay que esperar a que ese
        // ida-y-vuelta termine y `view` vuelva a quedarse en "dashboard" de
        // verdad, si no la guia se lanza sobre la pantalla equivocada.
        if (!isBiometricsEnabled() && !biometricPromptShown) return;

        setTourPromptCheckedThisSession(true);

        if (!hasSeenOnboardingTour) {
            setHasSeenOnboardingTour(true);
            startTour();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [view, tourPromptCheckedThisSession, biometricPromptShown, biometricsSynced]);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleStartGuideFromHelp = () => {
        setIsMenuOpen(false);
        setView("dashboard");

        // Si la guia ya esta activa y se llego aqui por su propio paso final
        // ("Guia paso a paso", ver TOUR_STEPS), solo hay que cerrar ese paso
        // y mostrar el cierre; reiniciarla la mandaria de vuelta al paso 0.
        const currentAwait = TOUR_STEPS[tourStepIndex]?.awaitAction;
        if (tourActive && currentAwait?.type === "guidePress") {
            handleTourNext();
            return;
        }

        startTour();
    };

    /**
     * Tramo final interactivo de la guia (ver TOUR_STEPS): los pasos con
     * `awaitAction` no tienen boton "Siguiente" (TourOverlay lo oculta) y
     * avanzan solos cuando la app detecta la accion real correspondiente.
     * El tipo `guidePress` se resuelve aparte, en `handleStartGuideFromHelp`,
     * porque ese boton real ya tiene su propio efecto secundario (reiniciar
     * la guia) que hay que evitar mientras esta en curso.
     */
    useEffect(() => {
        if (!tourActive) return;
        const awaits = TOUR_STEPS[tourStepIndex]?.awaitAction;
        if (!awaits || awaits.type === "guidePress") return;

        const satisfied = awaits.type === "menuOpen" ? isMenuOpen : view === awaits.value;
        if (satisfied) handleTourNext();
    }, [tourActive, tourStepIndex, isMenuOpen, view, handleTourNext]);

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
        setTourPromptCheckedThisSession(false);
        // Nada del cliente anterior debe verse con la siguiente sesion.
        setRemoteProfile(null);
        setTransactionRecords([]);
        setBeneficiaries([]);
        setBiometricsSynced(false);
        setAvailableUsdBalance(null);
        setPhysicalPromoDismissed(false);
    }, [view]);


    const [registerPhone, setRegisterPhone] = useState("");
    const [registerPhoneCountry, setRegisterPhoneCountry] = useState<CountryCode>("MX");

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
    const registeredFullName = [registerFirstName, registerPaternalLastName, registerMaternalLastName]
        .map((part) => part.trim())
        .filter(Boolean)
        .join(" ");
    const registeredPhone = registerPhone.length > 0 ? toE164(registerPhone, registerPhoneCountry) : "";
    const registeredAddress = [
        [registerAddressDetail.exteriorNumber, registerAddressDetail.street].filter(Boolean).join(" "),
        registerAddressDetail.interiorNumber ? `Apt ${registerAddressDetail.interiorNumber}` : "",
        registerCity,
        [registerState ? stateNameByCode("US", registerState) : "", registerZipCode]
            .filter(Boolean)
            .join(" "),
    ]
        .filter(Boolean)
        .join(", ");

    /**
     * Datos del cliente leidos del backend al entrar. Despues de iniciar sesion
     * los campos del registro estan vacios, asi que el perfil sale de aqui; si
     * todavia no llegan (o fallan) se usa lo que dio el registro.
     */
    const [remoteProfile, setRemoteProfile] = useState<ProfileData | null>(null);
    const profileFullName =
        [remoteProfile?.firstName, remoteProfile?.lastName].filter(Boolean).join(" ") ||
        registeredFullName;
    const profilePhone = remoteProfile?.phoneNumber || registeredPhone;
    const profileEmail = remoteProfile?.email || registerEmail.trim();
    const realProfileAddress = remoteProfile
        ? [
              remoteProfile.addressLine1,
              remoteProfile.city,
              [remoteProfile.state, remoteProfile.zipCode].filter(Boolean).join(" "),
          ]
              .filter(Boolean)
              .join(", ") || registeredAddress
        : registeredAddress;
    const profileAddress = realProfileAddress || (__DEV__ ? SIMULATED_ADDRESS : "");

    const [physicalCardRequested, setPhysicalCardRequested] = useState(false);
    /** El usuario cerro la invitacion "Tarjeta fisica" del Home (vuelve a salir en la siguiente sesion). */
    const [physicalPromoDismissed, setPhysicalPromoDismissed] = useState(false);
    /** Limite de credito (monto de la garantia). `null` hasta que el usuario inicia su historial; solo en memoria. */
    const [creditLimitUsd, setCreditLimitUsd] = useState<number | null>(null);
    /** Saldo utilizado y fecha limite de pago; sin backend de credito aun, quedan en $0 y +30 dias. */
    const [creditUsedUsd, setCreditUsedUsd] = useState(0);
    const [creditBalanceUsd, setCreditBalanceUsd] = useState(0);
    const [creditDepositedAt, setCreditDepositedAt] = useState<number | null>(null);
    const [creditReceipt, setCreditReceipt] = useState<CreditPaymentReceipt | null>(null);
    const [creditMovements, setCreditMovements] = useState<CreditMovement[]>([]);
    const [creditDueAt, setCreditDueAt] = useState(() => creditPaymentDue());
    const openCredit = () => setView(creditLimitUsd === null ? "creditHistory" : "creditSummary");

    /**
     * Movimientos y envios del cliente, leidos del backend. Los envios hechos
     * en esta sesion con el cobro simulado (`tx-...`) se conservan arriba hasta
     * que el envio real quede conectado.
     */
    const [transactionRecords, setTransactionRecords] = useState<Transaction[]>([]);

    useEffect(() => {
        if ((view !== "dashboard" && view !== "transactions") || !getToken()) return;
        getHistory()
            .then((remote) =>
                setTransactionRecords((prev) => [
                    ...prev.filter((tx) => tx.id.startsWith("tx-")),
                    ...remote,
                ])
            )
            .catch(() => {});
    }, [view]);

    /**
     * Movimientos de la tarjeta (BlackPay), aparte de los envios. Se piden cada
     * vez que se entra al Home, al detalle de tarjeta o a la pantalla completa; el 503 de BlackPay caido sale como error y
     * no como lista vacia.
     */
    const [cardMovements, setCardMovements] = useState<CardMovementsState>({ status: "loading" });
    const [cardMovementsReturnView, setCardMovementsReturnView] = useState<ViewName>("dashboard");

    const openCardMovements = (from: ViewName) => {
        setCardMovementsReturnView(from);
        setView("cardMovements");
    };

    const loadCardMovements = useCallback(() => {
        setCardMovements({ status: "loading" });
        getCardStatement()
            .then((statement) => setCardMovements({ status: "ready", statement }))
            .catch((error) => {
                // Un 401 ya cierra la sesion por su cuenta (onUnauthorized).
                if (error instanceof ApiError && error.status === 401) return;
                setCardMovements({ status: "error" });
            });
    }, []);

    // Tambien alimenta la seccion "Actividad" del Home y del detalle de tarjeta.
    useEffect(() => {
        if ((view === "dashboard" || view === "cardDetail" || view === "cardMovements") && getToken()) {
            loadCardMovements();
        }
    }, [view, loadCardMovements]);

    useEffect(() => {
        if ((view !== "dashboard" && view !== "profile") || remoteProfile || !getToken()) return;
        getProfile()
            .then(setRemoteProfile)
            .catch(() => {});
    }, [view, remoteProfile]);

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

    const handleCancelTransaction = async (id: string) => {
        const target = transactionRecords.find((tx) => tx.id === id);
        if (!target || target.status !== "pending") return;

        // Envio registrado en el backend: el decide si sigue en la ventana de 30
        // minutos. No se devuelve saldo porque registrar la orden no lo desconto.
        if (id.startsWith("order-")) {
            try {
                const cancelled = await cancelOrder(id.slice("order-".length));
                setTransactionRecords((prev) => prev.map((tx) => (tx.id === id ? cancelled : tx)));
            } catch (error) {
                if (error instanceof ApiError && error.status === 401) return;
                Alert.alert(
                    "No se pudo cancelar el envío",
                    error instanceof Error ? error.message : t.transferErrorGeneric
                );
            }
            return;
        }

        setTransactionRecords((prev) =>
            prev.map((tx) => (tx.id === id ? { ...tx, status: "cancelled" } : tx))
        );
        setAvailableUsdBalance((prev) =>
            prev === null ? prev : Number((prev + target.amountUsd).toFixed(2))
        );
    };

    const [beneficiaryFirstName, setBeneficiaryFirstName] = useState("");
    const [beneficiaryPaternalLastName, setBeneficiaryPaternalLastName] = useState("");
    const [beneficiaryMaternalLastName, setBeneficiaryMaternalLastName] = useState("");
    const [beneficiaryPhone, setBeneficiaryPhone] = useState("");
    const [beneficiaryClabe, setBeneficiaryClabe] = useState("");

    /**
     * Saldo real del backend. `null` mientras no se conoce (cargando o sin
     * respuesta): nunca se inventa un monto, para que nadie decida cuanto
     * enviar con una cifra que no es la suya.
     */
    const [availableUsdBalance, setAvailableUsdBalance] = useState<number | null>(null);
    const [sendAmountUsd, setSendAmountUsd] = useState("");
    const [exchangeRate, setExchangeRate] = useState(17.25);
    const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState("");
    const [sendMoneySuccess, setSendMoneySuccess] = useState(false);
    const [sendMoneyError, setSendMoneyError] = useState("");

    /**
     * Beneficiarios del cliente, leidos del backend. El favorito
     * y las ediciones solo viven en memoria: el backend no los guarda.
     */
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
    /** Beneficiario abierto en detalle, edicion, borrado o recien agregado */
    const [activeBeneficiaryId, setActiveBeneficiaryId] = useState<string | null>(null);
    const activeBeneficiary = beneficiaries.find((b) => b.id === activeBeneficiaryId);

    const clearBeneficiaryForm = () => {
        setBeneficiaryFirstName("");
        setBeneficiaryPaternalLastName("");
        setBeneficiaryMaternalLastName("");
        setBeneficiaryPhone("");
        setBeneficiaryClabe("");
    };

    /** Borrador del alta, para "Confirmar datos del beneficiario" (34) */
    const beneficiaryDraft = {
        fullName: [beneficiaryFirstName, beneficiaryPaternalLastName, beneficiaryMaternalLastName]
            .map((part) => part.trim())
            .filter(Boolean)
            .join(" "),
        phone: formatMxPhone(beneficiaryPhone),
        clabe: beneficiaryClabe,
    };

    /** El formulario (33) ya valido: pasa a confirmar (34). */
    const handleBeneficiarySave = () => {
        setView("beneficiaryConfirm");
    };

    /**
     * Une lo que dice el backend con lo que solo vive en la app (correo, CLABE completa tecleada en esta sesion). Lo del backend manda en
     * nombre, telefono y favorito.
     */
    const mergeBeneficiaries = (
        fresh: Beneficiary[],
        prev: Beneficiary[],
        extras: Record<string, Partial<Beneficiary>> = {}
    ) => {
        const known = new Map(prev.map((b) => [b.id, b]));
        return fresh.map((b) => {
            const old = known.get(b.id);
            const local: Partial<Beneficiary> = old
                ? {
                      createdAt: b.createdAt || old.createdAt,
                      // Se conserva la CLABE completa solo si sigue siendo la misma.
                      clabe:
                          old.clabe &&
                          old.clabe.replace(/\D/g, "").length === 18 &&
                          old.clabe.endsWith(b.clabe?.replace(/\D/g, "").slice(-4) ?? "?")
                              ? old.clabe
                              : b.clabe,
                      ...(old.maternalLastName &&
                      `${old.paternalLastName} ${old.maternalLastName}`.trim() === b.paternalLastName
                          ? {
                                paternalLastName: old.paternalLastName,
                                maternalLastName: old.maternalLastName,
                            }
                          : {}),
                  }
                : {};
            return { ...b, ...local, ...extras[b.id] };
        });
    };

    /** Vuelve a leer la lista del backend sin perder lo que solo existe en la app. */
    const refreshBeneficiaries = async () => {
        const fresh = await listBeneficiaries();
        setBeneficiaries((prev) => mergeBeneficiaries(fresh, prev));
        return fresh;
    };

    const beneficiaryErrorMessage = (error: unknown) =>
        error instanceof Error ? error.message : "Ocurrió un error de conexión.";

    useEffect(() => {
        if ((view !== "beneficiaries" && view !== "sendMoney") || !getToken()) return;
        refreshBeneficiaries().catch(() => {});
    }, [view]);

    const handleConfirmBeneficiary = async () => {
        const knownIds = new Set(beneficiaries.map((b) => b.id));
        const clabe = beneficiaryClabe.replace(/\D/g, "");
        try {
            await createBeneficiary({
                firstName: beneficiaryFirstName.trim(),
                lastName: [beneficiaryPaternalLastName, beneficiaryMaternalLastName]
                    .map((part) => part.trim())
                    .filter(Boolean)
                    .join(" "),
                clabe,
                phoneDigits: beneficiaryPhone.replace(/\D/g, ""),
            });
            const fresh = await listBeneficiaries();
            const created = fresh.find((b) => !knownIds.has(b.id));
            const extras: Record<string, Partial<Beneficiary>> = created
                ? {
                      [created.id]: {
                          paternalLastName: beneficiaryPaternalLastName.trim(),
                          maternalLastName: beneficiaryMaternalLastName.trim() || undefined,
                          clabe,
                          fullName: beneficiaryDraft.fullName,
                      },
                  }
                : {};
            setBeneficiaries((prev) => mergeBeneficiaries(fresh, prev, extras));
            if (created) setActiveBeneficiaryId(created.id);
            clearBeneficiaryForm();
            setView(created ? "beneficiaryAdded" : "beneficiaries");
        } catch (error) {
            Alert.alert("No se pudo agregar al beneficiario", beneficiaryErrorMessage(error));
        }
    };

    /** Guarda los cambios en el backend y, si salio bien, en la lista. */
    const updateBeneficiary = async (updated: Beneficiary): Promise<boolean> => {
        const previous = beneficiaries.find((b) => b.id === updated.id);
        const clabeDigits = (updated.clabe ?? "").replace(/\D/g, "");
        const lastName = [updated.paternalLastName, updated.maternalLastName]
            .map((part) => (part ?? "").trim())
            .filter(Boolean)
            .join(" ");
        try {
            await updateBeneficiaryById(updated.id, {
                firstName: updated.firstName.trim(),
                lastName,
                // Una CLABE enmascarada (solo 4 digitos) no se reenvia.
                ...(clabeDigits.length === 18 ? { clabe: clabeDigits } : {}),
            });
        } catch (error) {
            Alert.alert("No se pudo guardar al beneficiario", beneficiaryErrorMessage(error));
            return false;
        }
        setBeneficiaries((prev) =>
            prev.map((b) =>
                b.id === updated.id
                    ? { ...updated, fullName: [updated.firstName.trim(), lastName].filter(Boolean).join(" ") }
                    : b
            )
        );
        return previous !== undefined;
    };

    /** Cambia el favorito de inmediato y lo confirma con el backend; si falla, lo regresa. */
    const toggleFavorite = async (id: string, value?: boolean) => {
        const current = beneficiaries.find((b) => b.id === id);
        if (!current) return;
        const next = value ?? !current.favorite;
        const apply = (favorite: boolean) =>
            setBeneficiaries((prev) => prev.map((b) => (b.id === id ? { ...b, favorite } : b)));
        apply(next);
        try {
            await setBeneficiaryFavorite(id, next);
        } catch (error) {
            apply(current.favorite);
            Alert.alert("No se pudo actualizar el favorito", beneficiaryErrorMessage(error));
        }
    };

    const deleteBeneficiary = async (id: string) => {
        try {
            await deleteBeneficiaryById(id);
        } catch (error) {
            Alert.alert("No se pudo borrar al beneficiario", beneficiaryErrorMessage(error));
            return;
        }
        setBeneficiaries((prev) => prev.filter((b) => b.id !== id));
        if (selectedBeneficiaryId === id) setSelectedBeneficiaryId("");
        setActiveBeneficiaryId(null);
        setView("beneficiaries");
    };

    const sendToBeneficiary = (id: string) => {
        setSelectedBeneficiaryId(id);
        setView("sendMoney");
    };

    /** Aviso "Servicio no disponible" cuando falla la consulta de saldo. */
    const [serviceUnavailable, setServiceUnavailable] = useState(false);

    /**
     * Saldo y tipo de cambio reales, pedidos al backend cada vez que se entra
     * al dashboard o a "Enviar dinero". Si alguno falla (BlackPay caido, sin
     * tipo de cambio guardado, sin tarjeta activa) se queda el valor que ya
     * habia; el motivo sale en el log de Metro con el prefijo [api].
     * Sin sesion no se pide nada: el registro simulado tambien llega al
     * dashboard, y una llamada sin token cerraria la sesion.
     */
    useEffect(() => {
        if ((view !== "dashboard" && view !== "sendMoney") || !getToken()) return;

        // Banderas de desarrollo (src/api/devFlags.ts); en produccion no existen.
        if (__DEV__ && FORCE_BALANCE_ERROR) {
            setServiceUnavailable(true);
        } else if (__DEV__ && SIMULATED_BALANCE_USD !== null) {
            // Solo la primera vez: despues el saldo local ya refleja envios y credito.
            setAvailableUsdBalance((prev) => prev ?? SIMULATED_BALANCE_USD);
        } else {
            getBalance()
                .then((balance) => setAvailableUsdBalance(Number(balance.availableBalance)))
                .catch((error) => {
                    // Un 401 ya cierra la sesion por su cuenta (onUnauthorized).
                    if (error instanceof ApiError && error.status === 401) return;
                    if (__DEV__ && IGNORE_BALANCE_ERROR) return;
                    setServiceUnavailable(true);
                });
        }
        getExchangeRate()
            .then((rate) => setExchangeRate(Number(rate.customerExchangeRate)))
            .catch(() => {});
    }, [view]);

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

        // Los fondos no se validan aqui: el backend los revisa al registrar la
        // orden contra la cuenta Remeza, que puede no coincidir con el saldo de
        // BlackPay que muestra la app. Si no alcanza, lo dice al confirmar.
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

        let order;
        try {
            order = await createOrder(selectedBeneficiaryId, amount);
        } catch (error) {
            if (error instanceof ApiError && error.status === 401) return;
            const insufficient = error instanceof Error && /insufficient funds/i.test(error.message);
            setTransferFailReason(insufficient ? t.insufficientFunds : t.transferErrorGeneric);
            setView("transferFailed");
            return;
        }

        // Los montos y el folio son los que guardo el backend, no los que la app
        // calculo en la pantalla de revision. El backend no mueve el dinero al
        // registrar la orden, asi que el saldo local se descuenta aqui (y se
        // devuelve si la orden se cancela).
        const createdAt = Date.now();
        setAvailableUsdBalance((prev) => (prev === null ? prev : Number((prev - amount).toFixed(2))));
        const reference = order.folio;
        const mxnAmount = Number(order.mxnAmount);
        const exchangeRate = Number(order.customerExchangeRate);
        const { beneficiaryName } = transferSummary;

        setTransactionRecords((prev) => [
            {
                id: `order-${order.id}`,
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
                exchangeRate,
                beneficiary: beneficiaryName,
            },
            ...prev,
        ]);
        setTransferSummary({ ...transferSummary, mxnAmount, exchangeRate, at: createdAt, reference });
        setSendAmountUsd("");
        setSendMoneySuccess(true);
        setView("transferSuccess");
    };

    /** Pago de servicios hecho (54): descuenta el saldo y lo registra. */
    const handleServicePaid = (amount: number, concept: string, folio: string) => {
        const paidAt = Date.now();
        setAvailableUsdBalance((prev) => (prev === null ? prev : Number((prev - amount).toFixed(2))));
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

    /** Paso "Ver y copiar datos" de la guia: muestra los datos y al salir los vuelve a ocultar. */
    const revealCardDataForTour = tourActive && !!TOUR_STEPS[tourStepIndex]?.revealCardData;
    useEffect(() => {
        if (!revealCardDataForTour) return;
        setShowCardData(true);
        return () => setShowCardData(false);
    }, [revealCardDataForTour]);

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

    /** Tarjeta virtual: se activa y se bloquea por su cuenta, sin tocar la fisica. */
    const [isVirtualInactive, setIsVirtualInactive] = useState(true);
    const [isVirtualCardActive, setIsVirtualCardActive] = useState(true);

    const handleActivateVirtualCard = () => {
        if (birthDate.length !== 10 || virtualSecureCode.length !== 6) return;

        setIsVirtualInactive(false);
        setIsVirtualCardActive(true);
        setShowVirtualCardModal(false);
        setShowSuccessMessage(true);
        setVirtualSecureCode("");

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
                    holderName={profileFullName}
                    availableUsdBalance={availableUsdBalance}
                    setIsMenuOpen={setIsMenuOpen}
                    onSendMoneyPress={() => setView("sendMoney")}
                    onViewAllActivity={() => openCardMovements("dashboard")}
                    onStartCreditHistory={openCredit}
                    onOpenCard={(variant) => {
                        setActiveCardIndex(variant === "physical" ? 0 : 1);
                        setView("cardDetail");
                    }}
                    card={VIRTUAL_CARD_DATA}
                    isVirtualInactive={isVirtualInactive}
                    isCardActive={isVirtualCardActive}
                    onCardActiveChange={setIsVirtualCardActive}
                    showCardData={showCardData}
                    onShowCardDataChange={setShowCardData}
                    // Mismo criterio que el menu lateral: activada, ya no se ofrece solicitarla.
                    physicalCardActive={!isFactoryInactive}
                    physicalCardRequested={physicalCardRequested}
                    physicalPromoDismissed={physicalPromoDismissed}
                    onDismissPhysicalPromo={() => setPhysicalPromoDismissed(true)}
                    onRequestPhysicalCard={() => setView("physicalCard")}
                    onActivatePhysicalCard={() => {
                        setActiveCardIndex(0);
                        setView("cardDetail");
                    }}
                    activity={cardMovements}
                    biometricReminderVisible={biometricReminderVisible}
                    onBiometricReminderPress={handleBiometricReminderPress}
                    tourFocusId={
                        tourActive && TOUR_STEPS[tourStepIndex]
                            ? stepTargetIds(TOUR_STEPS[tourStepIndex])[0]
                            : undefined
                    }
                />
            )}

            {view === "cardDetail" && (
                <CardDetailScreen
                    t={t}
                    holderName={profileFullName}
                    isFactoryInactive={isFactoryInactive}
                    isCardActive={isCardActive}
                    setIsCardActive={setIsCardActive}
                    isVirtualInactive={isVirtualInactive}
                    isVirtualCardActive={isVirtualCardActive}
                    setIsVirtualCardActive={setIsVirtualCardActive}
                    physicalCardRequested={physicalCardRequested}
                    setIsMenuOpen={setIsMenuOpen}
                    onSendMoneyPress={() => setView("sendMoney")}
                    onBack={() => setView("dashboard")}
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
                    handleActivateVirtualCard={handleActivateVirtualCard}
                    activity={cardMovements}
                    onViewAllActivity={() => openCardMovements("cardDetail")}
                />
            )}

            {view === "profile" && (
                <ProfileView
                    t={t}
                    setView={setView}
                    fullName={profileFullName}
                    email={profileEmail}
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

            {view === "cardMovements" && (
                <CardMovementsScreen
                    t={t}
                    state={cardMovements}
                    onBack={() => setView(cardMovementsReturnView)}
                    onRetry={loadCardMovements}
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
                    beneficiaryClabe={beneficiaryClabe}
                    setBeneficiaryClabe={setBeneficiaryClabe}
                    handleBeneficiarySave={handleBeneficiarySave}
                />
            )}

            {view === "sendMoney" && (
                <SendMoneyView
                    t={t}
                    setView={setView}
                    availableUsdBalance={availableUsdBalance ?? 0}
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

            {view === "creditHistory" && (
                <CreditHistoryScreen
                    t={t}
                    holderName={profileFullName}
                    setIsMenuOpen={setIsMenuOpen}
                    onBack={() => setView("dashboard")}
                    isDebitCardActive={isCardActive}
                    onRequestCard={() => setView("creditAmount")}
                />
            )}

            {view === "creditAmount" && (
                <CreditAmountScreen
                    t={t}
                    holderName={profileFullName}
                    setIsMenuOpen={setIsMenuOpen}
                    availableUsdBalance={availableUsdBalance ?? 0}
                    onBack={() => setView("creditHistory")}
                    onContinue={(amount) => {
                        // El limite se respalda con el saldo de la tarjeta digital: se retiene al solicitarla.
                        setAvailableUsdBalance((prev) => Number(((prev ?? 0) - amount).toFixed(2)));
                        const simulation = buildCreditSimulation(amount);
                        setCreditLimitUsd(amount);
                        setCreditDepositedAt(Date.now());
                        setCreditUsedUsd(simulation.usedUsd);
                        setCreditMovements(simulation.movements);
                        setCreditDueAt(creditPaymentDue());
                        setView("creditSummary");
                    }}
                />
            )}

            {view === "creditSummary" && creditLimitUsd !== null && (
                <CreditSummaryScreen
                    onBack={() => setView("dashboard")}
                    t={t}
                    language={language}
                    holderName={profileFullName}
                    creditLimitUsd={creditLimitUsd}
                    usedUsd={creditUsedUsd}
                    creditBalanceUsd={creditBalanceUsd}
                    dueAt={creditDueAt}
                    depositedAt={creditDepositedAt}
                    onPay={() => setView("creditPayment")}
                    movements={creditMovements}
                    onOpenMovements={() => setView("creditMovements")}
                    onOpenStatements={() => setView("creditStatements")}
                    onWithdrawGuarantee={() => {
                        // Sin backend de credito: el abono a la tarjeta virtual se refleja solo en el saldo local.
                        setAvailableUsdBalance((prev) => Number(((prev ?? 0) + creditLimitUsd).toFixed(2)));
                        setCreditLimitUsd(null);
                        setCreditDepositedAt(null);
                        setCreditUsedUsd(0);
                        setCreditBalanceUsd(0);
                        setCreditMovements([]);
                        setView("dashboard");
                    }}
                    setIsMenuOpen={setIsMenuOpen}
                />
            )}

            {view === "creditPayment" && creditLimitUsd !== null && (
                <CreditPaymentScreen
                    t={t}
                    holderName={profileFullName}
                    language={language}
                    creditLimitUsd={creditLimitUsd}
                    usedUsd={creditUsedUsd}
                    dueAt={creditDueAt}
                    setIsMenuOpen={setIsMenuOpen}
                    onBack={() => setView("creditSummary")}
                    onContinue={(amount) => {
                        const at = Date.now();
                        const remaining = Math.max(0, creditUsedUsd - amount);
                        setCreditUsedUsd(remaining);
                        const surplus = Math.max(0, Math.round((amount - creditUsedUsd) * 100) / 100);
                        setCreditBalanceUsd((prev) => Math.round((prev + surplus) * 100) / 100);
                        setCreditMovements((list) => [
                            {
                                id: `payment-${at}`,
                                kind: "payment",
                                nameKey: "creditMerchantPayment",
                                icon: "payment",
                                amountUsd: amount,
                                at,
                            },
                            ...list,
                        ]);
                        setCreditReceipt({
                            amountUsd: amount,
                            at,
                            reference: `RMZ-${String(at).slice(-8)}`,
                            remainingUsd: remaining,
                        });
                        setView("creditPaymentSuccess");
                    }}
                />
            )}

            {view === "creditPaymentSuccess" && creditReceipt !== null && (
                <CreditPaymentSuccessScreen
                    t={t}
                    language={language}
                    receipt={creditReceipt}
                    setIsMenuOpen={setIsMenuOpen}
                    onViewMovements={() => setView("creditMovements")}
                    onDone={() => setView("creditSummary")}
                />
            )}

            {view === "creditMovements" && creditLimitUsd !== null && (
                <CreditMovementsScreen
                    t={t}
                    holderName={profileFullName}
                    language={language}
                    creditLimitUsd={creditLimitUsd}
                    usedUsd={creditUsedUsd}
                    movements={creditMovements}
                    setIsMenuOpen={setIsMenuOpen}
                    onBack={() => setView("creditSummary")}
                />
            )}

            {view === "creditStatements" && creditLimitUsd !== null && (
                <CreditStatementsScreen
                    t={t}
                    language={language}
                    holderName={profileFullName}
                    holderAddress={profileAddress}
                    creditLimitUsd={creditLimitUsd}
                    movements={creditMovements}
                    setIsMenuOpen={setIsMenuOpen}
                    onBack={() => setView("creditSummary")}
                />
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
                    onSave={async (updated) => {
                        if (await updateBeneficiary(updated)) setView("beneficiaryDetail");
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
                    onStartGuide={handleStartGuideFromHelp}
                />
            )}

            {view === "security" && (
                <SecurityFlow
                    t={t}
                    onExit={() => setView("profile")}
                    onHome={() => setView("dashboard")}
                    phone={profilePhone}
                    email={profileEmail}
                />
            )}

            {view === "biometricPrompt" && (
                <SecurityFlow
                    t={t}
                    initialStep="biometrics"
                    onExit={handleBiometricPromptResolved}
                    onHome={handleBiometricPromptResolved}
                    onBiometricsResolved={handleBiometricPromptResolved}
                    phone={profilePhone}
                    email={profileEmail}
                />
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
                    availableUsdBalance={availableUsdBalance ?? 0}
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
                onStartCreditHistory={openCredit}
                physicalCardActive={!isFactoryInactive}
                tourOverlay={
                    tourActive && isMenuOpen ? (
                        <TourOverlay
                            t={t}
                            stepIndex={tourStepIndex}
                            onNext={handleTourNext}
                            onSkip={handleTourSkip}
                        />
                    ) : null
                }
            />

            {tourActive && !isMenuOpen && (
                <TourOverlay
                    t={t}
                    stepIndex={tourStepIndex}
                    onNext={handleTourNext}
                    onSkip={handleTourSkip}
                />
            )}

            {serviceUnavailable && (
                <ServiceUnavailableDialog
                    t={t}
                    onAccept={() => {
                        setServiceUnavailable(false);
                        setIsMenuOpen(false);
                        // La guia pudo arrancar en el dashboard junto con el aviso.
                        setTourActive(false);
                        setView("login");
                    }}
                />
            )}
        </ScreenBackground>
    );
}

export default function App() {
    return (
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
            <AppContent />
        </SafeAreaProvider>
    );
}
