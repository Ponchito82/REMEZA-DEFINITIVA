export type ViewName =
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
  | "remittanceDetail";

export type Language = "en" | "es";

export type TransactionsFilter = "all" | "virtual" | "physical" | "remittance" | "trading";