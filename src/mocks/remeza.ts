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
  {
    id: "3",
    firstName: "Carlos",
    paternalLastName: "Ramírez",
    maternalLastName: "Hernández",
    fullName: "Carlos Ramírez",
    phone: "+52 33 2345 6789",
    city: "Guadalajara",
    state: "Jalisco",
    clabe: "002320123456789019",
    favorite: false,
    createdAt: new Date(2026, 8, 5, 9, 12).getTime(),
  },
  {
    id: "4",
    firstName: "Ana",
    paternalLastName: "Martínez",
    maternalLastName: "Gómez",
    fullName: "Ana Martínez",
    phone: "+52 55 9876 5432",
    city: "CDMX",
    state: "CDMX",
    clabe: "014180234567890121",
    favorite: true,
    createdAt: new Date(2026, 8, 7, 18, 40).getTime(),
  },
  {
    id: "5",
    firstName: "Luis",
    paternalLastName: "García",
    maternalLastName: "Torres",
    fullName: "Luis García",
    phone: "+52 22 2345 6789",
    city: "Puebla",
    state: "Puebla",
    clabe: "072650345678901234",
    favorite: false,
    createdAt: new Date(2026, 8, 9, 11, 3).getTime(),
  },
  {
    id: "6",
    firstName: "Sofía",
    paternalLastName: "Hernández",
    maternalLastName: "Ruiz",
    fullName: "Sofía Hernández",
    phone: "+52 44 2123 4567",
    city: "Querétaro",
    state: "Querétaro",
    clabe: "012680456789012342",
    favorite: false,
    createdAt: new Date(2026, 8, 11, 14, 27).getTime(),
  },
  {
    id: "7",
    firstName: "Miguel",
    paternalLastName: "Torres",
    maternalLastName: "Flores",
    fullName: "Miguel Torres",
    phone: "+52 66 4987 6543",
    city: "Tijuana",
    state: "Baja California",
    clabe: "021020567890123453",
    favorite: false,
    createdAt: new Date(2026, 8, 13, 8, 55).getTime(),
  },
  {
    id: "8",
    firstName: "Laura",
    paternalLastName: "Sánchez",
    maternalLastName: "Díaz",
    fullName: "Laura Sánchez",
    phone: "+52 99 9456 7890",
    city: "Mérida",
    state: "Yucatán",
    clabe: "044910678901234563",
    favorite: false,
    createdAt: new Date(2026, 8, 15, 19, 18).getTime(),
  },
  {
    id: "9",
    firstName: "Jorge",
    paternalLastName: "Flores",
    maternalLastName: "Morales",
    fullName: "Jorge Flores",
    phone: "+52 61 4234 5678",
    city: "Chihuahua",
    state: "Chihuahua",
    clabe: "137150789012345677",
    favorite: false,
    createdAt: new Date(2026, 8, 18, 10, 45).getTime(),
  },
  {
    id: "10",
    firstName: "Diana",
    paternalLastName: "Morales",
    maternalLastName: "Castillo",
    fullName: "Diana Morales",
    phone: "+52 46 2876 5432",
    city: "Irapuato",
    state: "Guanajuato",
    clabe: "127110890123456789",
    favorite: false,
    createdAt: new Date(2026, 8, 20, 16, 30).getTime(),
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
  phone: "+1 (773) 263-1785",
  email: "hola@remeza.app",
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
