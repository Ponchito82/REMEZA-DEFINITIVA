/**
 * Banderas solo para desarrollo. Todas se ignoran fuera de `__DEV__`, asi que
 * una build de produccion siempre se comporta de forma normal.
 *
 * Cambia el valor, guarda y la app recarga sola.
 */

/**
 * `true`: si la consulta de saldo falla (p. ej. BlackPay no responde en el
 * entorno local), NO se muestra "Servicio no disponible" y la app sigue con el
 * saldo de ejemplo. `false`: el aviso sale como en produccion.
 */
export const IGNORE_BALANCE_ERROR = true;

/**
 * `true`: se muestra "Servicio no disponible" en cuanto se entra al Dashboard o
 * a "Enviar dinero", sin importar lo que conteste el backend. Sirve para probar
 * el aviso a proposito. Tiene prioridad sobre `IGNORE_BALANCE_ERROR`.
 */
export const FORCE_BALANCE_ERROR = false;

/**
 * Saldo disponible simulado (USD) para probar sin depender de BlackPay.
 * `null` usa el saldo real del backend. Solo aplica en `__DEV__`.
 */
export const SIMULATED_BALANCE_USD: number | null = 600;

/** Direccion simulada si el perfil no trae una. `""` la desactiva. Solo en `__DEV__`. */
export const SIMULATED_ADDRESS = "1234 Main St, Apt 5, Houston, TX 77001";
