# Pruebas de integración con el API de pruebas (dev.api.remeza.app)

Fecha: 2026-10-23 · Dispositivo: teléfono físico Android `ZY32CMJK4Z` · App: `com.remezaapp` (build debug, Metro por `adb reverse tcp:8081`).
Cuenta de prueba: la del propio titular, teléfono `+527491048097` (perfil con dirección en EE.UU.: Culver City, California 90230).

## 1. Qué informó Jairo (base de las pruebas)

| # | Indicación de Jairo | Qué se verificó |
|---|---|---|
| J1 | El API de pruebas está en `https://dev.api.remeza.app`, con todas las migraciones. | La app apunta a ese host y responde. |
| J2 | Las cuentas deben crearse con **dirección de EE.UU.** (el KYC solo acepta esas). | La cuenta existe con dirección de California y el perfil la devuelve. |
| J3 | `POST /api/v1/auth` acepta el campo nuevo `language` (`es`/`en`) junto a `phoneNumber` y `accessCode`; sin él queda en español. | La app lo envía; se probó por API y en la app. |
| J4 | Crear tarjetas está **apagado** en el servidor: dar de alta una tarjeta física responde `400 "Card creation is disabled."`. | Se probó la solicitud de tarjeta física en la app (ver resultado, **no coincide**). |

## 2. Cambios hechos en la app

| Archivo | Cambio |
|---|---|
| `src/api/client.ts` | Interruptor `USE_REMOTE_DEV_API` (hoy `true`): `API_BASE_URL` = `https://dev.api.remeza.app`. Con `false` vuelve a `http://localhost:8700` por `adb reverse`. |
| `src/api/auth.ts` | `login(phoneNumber, accessCode, language)` envía `language` en el cuerpo. |
| `src/screens/LoginScreen.tsx` | Pasa el idioma activo (`"es"` / `"en"`) a `login`. |
| `src/components/DrawerMenu.tsx`, `src/screens/DashboardView.tsx` | Se reactivaron los botones de historial crediticio (`SHOW_CREDIT_HISTORY` y `SHOW_CREDIT_HISTORY_BANNER` en `true`). |

Contrato del login:

```http
POST /api/v1/auth
{ "phoneNumber": "+527491048097", "accessCode": "<clave>", "language": "es" | "en" }
→ { "success": true, "data": { "customerId", "token", "expiresInMs": 900000 } }
```

## 3. Resultados

Leyenda: ✅ correcto · ⚠️ funciona con observación · ❌ no coincide con lo esperado.

### 3.1 API directa (curl)

| Prueba | Resultado |
|---|---|
| Login con clave correcta y `language: "es"` | ✅ HTTP 200, token con vigencia de 15 min (`expiresInMs` 900000). |
| Login con clave incorrecta, `language` `es`, `en` y sin campo | ⚠️ HTTP 401 `"Bad credentials."` en los tres casos: el mensaje **no cambia con el idioma** (ver observación O1). |
| Login con teléfono no registrado | ⚠️ HTTP 404 `"Customer with phone ... not found"`, también en inglés con cualquier `language`. |
| Login con JSON inválido | ⚠️ HTTP 500 `"Ocurrió un error interno"` (se esperaría 400). |
| `GET /api/v1/profile` con token | ✅ HTTP 200: nombre, correo, teléfono, dirección de California, estado `ACTIVE`. |
| `GET /api/v1/cards` con token | ✅ HTTP 200, lista vacía (sin tarjetas). |
| `GET /api/v1/beneficiaries` con token | ✅ HTTP 200, lista vacía. |
| `GET /api/v1/balance` con token | ⚠️ HTTP 400 `"Customer has no active card."` (coherente: no hay tarjeta). |
| `GET /api/v1/transactions/card` (lo llama la app) | ⚠️ HTTP 400 (mismo motivo: sin tarjeta activa). |
| `GET /api/v1/assets/exchange-rate` con token | ⚠️ HTTP 503 `"Exchange rate not found"`: el tipo de cambio no está cargado en dev. |
| Endpoints protegidos sin token | ✅ HTTP 401. |
| `POST /api/v1/cards` con token (cuerpo `{}` o `{"type":"PHYSICAL"}`) | ⚠️ HTTP 500: no se conoce el cuerpo esperado. No se pudo reproducir el `400 "Card creation is disabled."` por API. |

### 3.2 En la app (teléfono físico)

| Prueba | Resultado |
|---|---|
| Arranque de la app contra dev | ✅ Abre; pantalla de bienvenida con selector Español/English. |
| Login con clave incorrecta, idioma **English** | ✅ La app muestra `Invalid phone number or access code.` |
| Login con clave incorrecta, idioma **Español** | ✅ La app muestra `Número de teléfono o código de acceso incorrecto.` |
| Login con clave correcta | ✅ Entra al dashboard ("Hola, Giovani"); el tour guiado se salta con "Saltar". |
| Llamadas al entrar (log `[api]`) | ✅ `devices`, `orders`, `profile`, `cards` responden 200. `transactions/card` 400 y `exchange-rate` 503 (ver 3.1). La actividad muestra "No pudimos cargar tus movimientos". |
| Solicitud de **tarjeta física** (Solicitar tarjeta → Confirmar → "Sí, solicitar tarjeta") | ❌ La app termina en **"Tarjeta en camino / Enviando"** sin hacer **ninguna llamada al API** (el log `[api]` queda vacío). El `400 "Card creation is disabled."` de Jairo nunca se muestra (ver O2). |
| Botón de crédito en el **menú lateral** | ✅ "Inicia tu historial crediticio" aparece y abre la pantalla de crédito con el botón "Solicitar tarjeta". |
| Banner de crédito en el **dashboard** | ✅ Visible bajo "Tarjeta física". |

## 4. Observaciones y pendientes

| ID | Tema | Detalle | Responsable sugerido |
|---|---|---|---|
| O1 | Idioma de mensajes de error del API | `Bad credentials.` y `Customer ... not found` salen en inglés aunque se mande `language: "es"`. Hoy la app no depende de ellos porque traduce el 401 con su propio texto. | Jairo: confirmar si esos mensajes se localizan. |
| O2 | Tarjeta física **simulada** | El flujo de solicitud es local (animación y estados fijos) y siempre "tiene éxito". No hay llamada de red, así que no refleja que el servidor tiene la creación apagada. Un usuario creería que la tarjeta va en camino. | App: conectar el flujo al API cuando exista el endpoint, o dejar claro que es demo. Jairo: indicar el endpoint y cuerpo de alta de tarjeta. |
| O3 | Saldo y tarjeta de muestra | El dashboard muestra **$600.00** y una tarjeta `••4590` que **no vienen del API** (saldo simulado en `SIMULATED_BALANCE_USD` de `src/api/devFlags.ts`; tarjeta de relleno). Para el API la cuenta no tiene saldo ni tarjeta. | App: apagar el saldo simulado para pruebas reales. |
| O4 | Tipo de cambio | `exchange-rate` responde 503 en dev. | Jairo: cargar el dato en dev. |
| O5 | JSON inválido | Responde 500 en lugar de 400. | Jairo (menor). |
| O6 | Error de login no se actualiza al cambiar idioma | Al cambiar de English a Español el mensaje de error ya mostrado se queda en inglés hasta el siguiente intento. | App (menor, solo visual). |
| O7 | Texto con typo | En la confirmación de la tarjeta física aparece "Confirmando **soliicitud**." | App (menor). |
| O9 | Cuenta `+525538068807` / `123456` no existe en dev | Probada por API y en la app (15:59): `POST /api/v1/auth` responde 404 `"Customer with phone +525538068807 not found"`. Esa cuenta solo existía en la base local (`remeza-api` en la PC), no en dev. Además la app muestra para ese 404 el texto engañoso **"No se pudo conectar con el servidor. Intenta de nuevo."**, porque `LoginScreen.tsx` trata como error de conexión todo código distinto de 401. | Jairo: crear esa cuenta en dev si se necesita. App: mostrar mensaje de "cuenta no encontrada" para el 404. |
| O8 | Sesión de 15 min | El token vence a los 15 min (`expiresInMs` 900000); la app cierra sesión al vencer (comportamiento ya existente). | — |

No verificado: alta de cuenta nueva (onboarding/KYC con SMS real), flujo de Enviar dinero, y el `400 "Card creation is disabled."` real (depende de O2).

## 5. Mensaje sugerido para Jairo

> Jairo, ya probé en dev con mi cuenta. El login con `language` funciona (200) y el perfil trae la dirección de California. Tres cosas: (1) `Bad credentials.` y `Customer ... not found` salen en inglés aunque mande `language: "es"`, ¿se localizan o solo algunos mensajes? (2) `exchange-rate` responde 503 "Exchange rate not found" en dev. (3) ¿Cuál es el endpoint y cuerpo para dar de alta una tarjeta? `POST /api/v1/cards` con `{}` me da 500 y no puedo reproducir el 400 "Card creation is disabled."; hoy la app simula la solicitud sin llamar al API. Además un JSON inválido responde 500 en vez de 400.

## 6. Cómo repetir las pruebas

1. `adb devices` debe listar el teléfono; `adb reverse tcp:8081 tcp:8081`; `npx react-native start`.
2. `adb shell am start -n com.remezaapp/.MainActivity`.
3. Campo de teléfono: escribir en formato E.164 (`+52...`).
4. Para volver al backend local: `USE_REMOTE_DEV_API = false` en `src/api/client.ts`, levantar `remeza-api` (puerto 8700) y `adb reverse tcp:8700 tcp:8700`.
