/**
 * Datos simulados de las pantallas que aun no tienen backend. Los consumen
 * solo las funciones de `src/services`, que son las que se cambiaran por
 * llamadas reales. Todas las fechas son de 2026.
 */
import { Beneficiary } from "../types/app";

export const MOCK_BENEFICIARIES: Beneficiary[] = [
  {
    id: "1",
    firstName: "Juan",
    paternalLastName: "Pérez",
    fullName: "Juan Pérez",
    phone: "+52 55 1234 5678",
    city: "CDMX",
    state: "CDMX",
    clabe: "012180015678912345",
    favorite: true,
    createdAt: new Date(2026, 7, 12, 10, 24).getTime(),
  },
  {
    id: "2",
    firstName: "María",
    paternalLastName: "López",
    fullName: "María López",
    phone: "+52 81 5555 2222",
    city: "Monterrey",
    state: "Nuevo León",
    clabe: "072580001234567890",
    favorite: false,
    createdAt: new Date(2026, 8, 2, 16, 5).getTime(),
  },
];

export type BankAccount = {
  bankName: string;
  holder: string;
  /** Clave de i18n del tipo de cuenta */
  typeKey: "accountTypeDebit" | "accountTypeSavings";
  clabe: string;
  connectedAt: number;
};

export const MOCK_BANK_ACCOUNT: BankAccount = {
  bankName: "BBVA México",
  holder: "Juan Pérez García",
  typeKey: "accountTypeDebit",
  clabe: "012180001234567895",
  connectedAt: new Date(2026, 8, 14, 10, 24).getTime(),
};

export type CardSummary = {
  last4: string;
  /** Clave de i18n del tipo de tarjeta */
  typeKey: "cardTypeDebit";
  spendingLimit: number;
  minLimit: number;
  maxLimit: number;
};

export const MOCK_CARD: CardSummary = {
  last4: "1234",
  typeKey: "cardTypeDebit",
  spendingLimit: 5000,
  minLimit: 1000,
  maxLimit: 50000,
};

export type ServiceProvider = {
  id: string;
  /** Clave de i18n del servicio ("Luz") */
  nameKey: string;
  /** Empresa que lo presta ("CFE") */
  company: string;
  /** Logo SVG del proveedor si el backend lo manda; en mocks, ninguno */
  logoSvgUrl?: string;
};

export const MOCK_SERVICE_PROVIDERS: ServiceProvider[] = [
  { id: "electricity", nameKey: "serviceElectricity", company: "CFE" },
  { id: "water", nameKey: "serviceWater", company: "CONAGUA" },
  { id: "internet", nameKey: "serviceInternet", company: "Telmex" },
  { id: "phone", nameKey: "servicePhone", company: "Telcel" },
  { id: "tv", nameKey: "serviceTv", company: "Sky" },
];

export const MOCK_SUPPORT = {
  phone: "+1 800 123 4567",
  email: "soporte@remeza.app",
  agentName: "Ana Rivera",
};

export type ChatMessage = {
  id: string;
  from: "me" | "agent";
  /** Clave de i18n (mensajes simulados) o texto literal (lo que escribe el usuario) */
  textKey?: string;
  text?: string;
  at: number;
};

export const MOCK_CHAT: ChatMessage[] = [
  { id: "m1", from: "agent", textKey: "chatAgentGreeting", at: new Date(2026, 8, 14, 10, 24).getTime() },
];

export const MOCK_HELP_TOPICS = ["faq", "guides", "limits", "security"] as const;

export type NotificationPreferences = {
  transactions: boolean;
  security: boolean;
  promotions: boolean;
  reminders: boolean;
};

export const MOCK_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  transactions: true,
  security: true,
  promotions: false,
  reminders: true,
};

/** Codigo que acepta el mock de recuperacion por correo */
export const MOCK_EMAIL_CODE = "123456";
