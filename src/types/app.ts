export type ViewName =
  | "welcome"
  | "login"
  | "forgotAccessCode"
  | "register"
  | "kyc"
  | "dashboard"
  | "physicalCard"
  | "trading"
  | "transactions"
  | "profile"
  | "beneficiaries"
  | "sendMoney"
  | "sendMoneyConfirmation"
  | "remittanceDetail"
  | "multiCurrency"
  | "disputeOptions"
  | "twoStepVerification"
  | "securityAlert";

export type Language = "en" | "es";

export type TransactionsFilter = "all" | "virtual" | "physical" | "remittance" | "trading";