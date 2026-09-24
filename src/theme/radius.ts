export const radius = {
  sm: 10,
  /** Inputs, cards y botones de formulario */
  md: 14,
  /** Card agrupada de la alerta de seguridad */
  card: 16,
  /** Tarjeta bancaria y cards grandes */
  lg: 20,
  /** Botones e inputs del Login, chips y toggle */
  pill: 999,
} as const;

/** Alturas fijas del diseno, para que no se hardcodeen en cada pantalla. */
export const sizes = {
  input: 52,
  button: 52,
  /** Botones de las pantallas de seguridad y multidivisa */
  buttonLarge: 56,
  /** Circulo protagonista de esas mismas pantallas */
  hero: 96,
  /** Circulo de icono de las filas de lista */
  listIcon: 48,
  closeButton: 44,
  /** Circulo del icono que va dentro de un input */
  inputIcon: 36,
} as const;

/** Medidas del PDF de 59 pantallas, para las pantallas rediseñadas. */
export const metrics = {
  radius: { button: 16, card: 16, input: 16, otp: 12, tab: 12, back: 12 },
  buttonHeight: 56,
  listRowMin: 76,
  detailRowMin: 60,
  inputHeight: 56,
  otpBox: { width: 52, height: 60 },
  backButton: 44,
  heroIcon: 96,
  rowIconCircle: 52,
  gutter: 20,
  rowGap: 10,
} as const;
