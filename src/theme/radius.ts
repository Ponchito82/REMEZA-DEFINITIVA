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
