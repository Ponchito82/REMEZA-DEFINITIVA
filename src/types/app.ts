export type ViewName =
  | "welcome"
  | "login"
  | "forgotAccessCode"
  | "register"
  | "kyc"
  | "dashboard"
  | "physicalCard"
  | "transactions"
  | "profile"
  | "beneficiaries"
  | "sendMoney"
  | "sendMoneyConfirmation"
  | "transactionDetail"
  | "appeal"
  | "multiCurrency"
  | "twoStepVerification"
  | "securityAlert"
  | "logoutConfirm"
  | "recoverAccess"
  | "security"
  | "notifications"
  | "bankAccounts"
  | "support"
  | "servicePayments"
  | "cardControls"
  | "beneficiaryForm"
  | "beneficiaryConfirm"
  | "beneficiaryAdded"
  | "beneficiaryDetail"
  | "beneficiaryEdit"
  | "beneficiaryDelete"
  | "transferProcessing"
  | "transferSuccess"
  | "transferFailed"
  | "transferReceipt";

export type Language = "en" | "es";

export type TransactionsFilter = "all" | "virtual" | "physical" | "remittance";

export type TransactionType = "virtual" | "physical" | "remittance";

export type TransactionStatus = "completed" | "pending" | "cancelled";

/** Quien opera el movimiento */
export type TransactionProvider = "remeza" | "blackpay";

export const PROVIDER_NAMES: Record<TransactionProvider, string> = {
  remeza: "Remeza",
  blackpay: "BlackPay",
};

export type Transaction = {
  id: string;
  type: TransactionType;
  /** Clave de traduccion; tiene prioridad sobre `label` */
  labelKey?: string;
  label: string;
  /** Monto con signo tal como se muestra en la lista */
  amount: string;
  /** Monto en dolares, sin signo */
  amountUsd: number;
  date: string;
  status: TransactionStatus;
  provider: TransactionProvider;
  reference: string;
  /** Solo remesas nuevas; sirve para la ventana de 30 minutos de cancelacion */
  createdAt?: number;
  /** Solo remesas */
  mxnAmount?: number;
  exchangeRate?: number;
  beneficiary?: string;
};

/** Ventana en la que una remesa se puede cancelar tras crearse */
export const REMITTANCE_CANCEL_WINDOW_MS = 30 * 60 * 1000;

export function canCancelTransaction(tx: Transaction, now: number = Date.now()): boolean {
  if (tx.type !== "remittance" || tx.status !== "pending") return false;
  return tx.createdAt === undefined || now - tx.createdAt <= REMITTANCE_CANCEL_WINDOW_MS;
}

/** Beneficiario de remesas. Quien recibe siempre es de Mexico (+52). */
export type Beneficiary = {
  id: string;
  firstName: string;
  paternalLastName: string;
  maternalLastName?: string;
  fullName: string;
  /** Telefono ya formateado con la lada +52 */
  phone: string;
  city: string;
  state: string;
  email?: string;
  clabe?: string;
  favorite: boolean;
  createdAt: number;
};
