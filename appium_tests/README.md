# Pruebas Appium — Login y Registro

Suite WebdriverIO + Appium (UiAutomator2, Android) para el flujo de **Login** y **Registro**,
actualizada al comportamiento **con validaciones** (PR #4 a `main`).

Los specs viejos probaban "avanza con todos los campos vacíos". Ahora prueban lo contrario:
los botones quedan **deshabilitados** hasta que los datos son válidos, y se muestran los
mensajes de error correctos.

## Specs

| Archivo | Cubre |
|---|---|
| `specs/login.spec.js` | Validación E.164 del teléfono, código de 6 dígitos, botón deshabilitado, error de formato, navegación a registro / recuperación, y login contra el backend real. |
| `specs/register.spec.js` | Paso 1 (teléfono 10 dígitos), Paso 2 (6 casillas OTP), Paso 3 (código fuerte + confirmación), Paso 4 (todos los campos obligatorios). |
| `specs/sendMoney.spec.js` | Fuera de alcance de esta tarea. Solo se actualizó su login para que no rompa la suite. |
| `specs/dashboard.spec.js` | Saldo simulado, navegación a las demás secciones desde el drawer, y activación de tarjeta física/virtual (`handleActivateCard` / `handleActivateVirtualCard`, ambos setState puro sin fetch). |
| `specs/beneficiaries.spec.js` | Alta de beneficiario (`handleBeneficiarySave`, sin validación ni fetch). No cubre listado/selección: esa UI vive en `SendMoneyView` (ver `sendMoney.spec.js`). |
| `specs/forgotAccessCode.spec.js` | Flujo completo de recuperación de código: teléfono inválido, código débil/mismatch, reseteo exitoso y vuelta a Sign In. |
| `specs/sendMoneyConfirmation.spec.js` | Pantalla de confirmación tras un envío exitoso, botón de regresar, y reenvío con saldo ya reducido (`Insufficient funds.`). |
| `specs/profile.spec.js` | Perfil de solo lectura: muestra los datos del cliente, el aviso "Tu información está protegida", y no expone campos editables ni botón de guardar. |
| `specs/transactionDetail.spec.js` | Desglose de un movimiento de cualquier tipo, y cancelación de una remesa en proceso (confirmación, estado "Cancelled" y regreso al listado). |
| `specs/transactions.spec.js` | Listado de las 3 transacciones simuladas, filtro por tipo (virtual/physical/remittance) y apertura del desglose. |
| `specs/physicalCard.spec.js` | Solicitud de envío de tarjeta física nueva a una dirección (`handlePhysicalCardSubmit`, sin validación ni fetch). No confundir con la activación de tarjeta, que vive en `dashboard.spec.js`. |
| `specs/support.spec.js` | Soporte en vivo (chat, ticket, llamada), Centro de ayuda sin "Cancelar o disputar" y la pantalla de Preguntas frecuentes con preguntas desplegables. |

### Notas de estos specs nuevos

- **`forgotAccessCode.spec.js`**: `ForgotAccessCodeView.tsx` es la única pantalla de este batch sin `testID` en sus inputs/botones. Por instrucción del equipo no se tocó código de producción en este ticket, así que el spec selecciona por texto visible o por posición (`UiSelector().className("android.widget.EditText").instance(n)`). Si cambian los campos de esa pantalla, este spec es el primero en romperse.
- **`dashboard.spec.js`**: documenta un bug real (no corregido, solo probado): `handleActivateVirtualCard === handleActivateCard` en `App.tsx`, y ese handler valida `secureCode` (el campo del modal físico) en vez de `virtualSecureCode`. Activar la tarjeta virtual con datos válidos dejará el modal abierto sin activar nada.

### Casos marcados `[backend]`

Necesitan **remeza-api corriendo** en `http://localhost:8700` (el emulador Android lo resuelve
como `10.0.2.2:8700`) y el usuario de prueba **`+525538068807` / `123456`** (Adrian Morfin):

- `login.spec.js` → describe **"Login — backend real [backend]"** (2 casos)
- `sendMoney.spec.js` → todos (dependen del login real)
- `dashboard.spec.js`, `beneficiaries.spec.js`, `sendMoneyConfirmation.spec.js`, `profile.spec.js`, `support.spec.js`,
  `transactionDetail.spec.js`, `transactions.spec.js`, `physicalCard.spec.js` → todos (todos navegan
  primero por un login real para llegar al Dashboard)

El resto de casos de `login.spec.js` y **todos** los de `register.spec.js` validan solo
la lógica de cliente (habilitado/deshabilitado, mensajes) y **no** requieren backend.

### Caso bloqueado

`register.spec.js` → `it.skip("[bloqueado] happy path completo del paso 4 llega a KYC")`.
Los campos de documento (frente/reverso) abren el **selector de archivos nativo del SO**
(`@react-native-documents/picker`), que Appium no puede recorrer de forma confiable y no
tiene hook de prueba. Habilitar cuando exista un mock para la selección de documentos.

## Estado real de la suite (corrida completa 2026-09-11)

La suite SÍ corre (antes tenía un bug de selector que la dejaba en 0 casos —
ver commit). Resultado real con emulador + Metro + backend + Appium server arriba:

| Spec | Resultado |
|---|---|
| `login.spec.js` | 8/9 |
| `register.spec.js` | 5/8 |
| `sendMoney.spec.js` | 0/2 (fuera de alcance, depende del bug de abajo) |

### Limitaciones de Appium confirmadas (NO son bugs de app — verificado a mano en el emulador)

Los 2 casos fallando de arriba (login) y los 3 en cascada de register **no son bugs
de la app**. Se probaron a mano con un toque real de mouse en el emulador y ambos
flujos funcionan correctamente. Son limitaciones conocidas de Appium/UiAutomator2:

1. **Login — mensaje de error de teléfono no aparece tras blur bajo automatización.**
   El `onBlur` de `LoginView.tsx` no dispara de forma confiable con un tap de Appium
   en el campo vecino. Con un toque real, el mensaje sí aparece correctamente.
2. **Registro paso 2 → 3 — "Verify Code" no navega bajo automatización.** Con las 6
   casillas del OTP llenas y el botón habilitado, presionarlo con `.click()` de
   Appium (y también con un tap por coordenadas vía W3C Actions) no dispara
   `setRegStep(3)` en `RegisterSteps.tsx`. Con un toque real de mouse, SÍ navega
   correctamente al paso 3. Otros botones del mismo tipo (`MainButton`: Next, Sign In,
   Sign up) sí funcionan igual bajo automatización — esta limitación parece específica
   de este botón (posiblemente por el `setInterval` del contador de "reenviar código"
   corriendo en paralelo en este step). Esto bloquea en cascada los describe blocks
   "Registro paso 3" y "Registro paso 4", que dependen de `fillStep2()` para llegar a
   esas pantallas.

Estos casos quedan fallando a propósito como limitaciones documentadas — no requieren
fix de app, solo quedan pendientes de una forma de automatizarlos de manera confiable
(por ejemplo, con un delay adicional, o un gesto de tap distinto).

Reportar ambos al equipo antes de seguir invirtiendo tiempo en la suite.

## Requisitos de entorno

1. **Dependencias** (no están en `package.json` todavía):

   ```bash
   npm i -D @wdio/cli @wdio/local-runner @wdio/mocha-framework @wdio/spec-reporter appium appium-uiautomator2-driver
   npx appium driver install uiautomator2   # si no quedó instalado con el paquete
   ```

2. **Emulador Android** encendido (`adb devices` debe listarlo).

3. **APK debug compilado** en la ruta que espera `wdio.conf.js`
   (`android/app/build/outputs/apk/debug/app-debug.apk`):

   ```bash
   npm run android        # compila e instala; deja el APK generado
   ```

4. **Metro** corriendo (`npm start`).

5. **Appium server** corriendo:

   ```bash
   npx appium
   ```

6. Para los casos `[backend]`: **remeza-api** corriendo en `localhost:8700`.

## Correr la suite

```bash
npm run appium:test                                   # todos los specs
npx wdio run ./appium_tests/wdio.conf.js --spec ./appium_tests/specs/login.spec.js
```

Filtrar por nombre de caso (mocha grep):

```bash
npx wdio run ./appium_tests/wdio.conf.js --mochaOpts.grep "paso 3"
```

## Reparto sugerido para el equipo (4 personas)

La suite está organizada en bloques `describe` independientes (cada `it` reinicia la app):

1. `login.spec.js` — "validación de campos" + "navegación"
2. `login.spec.js` — "backend real [backend]"  ·  y `sendMoney.spec.js`
3. `register.spec.js` — "paso 1" + "paso 2"
4. `register.spec.js` — "paso 3" + "paso 4"

## Nota

`wdio.conf.js` se ajustó a Appium 2.x: `path: "/"` (antes `/wd/hub`, que era de Appium 1.x).
