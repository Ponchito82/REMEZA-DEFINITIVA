# Levantar Remeza en dispositivo físico Android + backend

Guía para correr la app en el teléfono físico (Motorola moto g(20), serial `ZY32CMJK4Z`) conectado por USB, usando el backend real `remeza-api`. Pensada para esta máquina (Windows, PowerShell).

Proyecto es React Native CLI puro (no Expo). La app apunta a `localhost` (`src/api/client.ts`), así que en físico funciona igual que en emulador gracias a `adb reverse` — **no hace falta IP de LAN ni tocar código**.

## 0. Requisitos antes de empezar

### 0.1 Habilitar depuración USB en el teléfono (solo la primera vez)

1. En el teléfono: **Ajustes → Acerca del teléfono**.
2. Toca **"Número de compilación"** 7 veces seguidas hasta que diga "Ya eres desarrollador".
3. Vuelve a **Ajustes → Sistema → Opciones de desarrollador** y activa **"Depuración USB"**.
4. Conecta el teléfono a la PC con el cable USB.
5. En el teléfono aparece el diálogo **"¿Permitir depuración USB?"** — marca "Permitir siempre desde esta computadora" y toca **Permitir**.

### 0.2 Verificar que PostgreSQL está corriendo

El backend necesita PostgreSQL local arriba (puerto 5432, base `remeza_v2_blackpay`) o no levanta.

```powershell
Get-Service postgresql-x64-18
```

- Si `Status` dice **Running**, ya está listo, continúa al paso 1.
- Si dice **Stopped**, arráncalo:

```powershell
Start-Service postgresql-x64-18
```

Vuelve a correr `Get-Service postgresql-x64-18` para confirmar que quedó en `Running`.

## 1. Verificar que el teléfono está conectado

```powershell
adb devices -l
```

Debe aparecer `ZY32CMJK4Z   device   model:moto_g_20_`. Si dice `unauthorized`, desbloquea el teléfono y acepta el prompt de depuración USB.

## 2. Levantar el backend (remeza-api)

En **una ventana de PowerShell**:

```powershell
cd C:\Users\giova\remeza-api
.\mvnw.cmd spring-boot:run
```

Tarda ~10 segundos. Queda escuchando en el puerto **8700**. Déjala abierta (no cierres la ventana).

## 3. Levantar Metro (bundler de JS)

En **otra ventana de PowerShell**:

```powershell
cd C:\Users\giova\Downloads\REMEZA-DEFINITIVA
npx react-native start
```

Queda escuchando en el puerto **8081**. Déjala abierta también.

## 4. Configurar los túneles adb reverse

En una tercera ventana (o reutiliza la primera):

```powershell
adb reverse tcp:8081 tcp:8081
adb reverse tcp:8700 tcp:8700
```

Verificar que quedaron activos:

```powershell
adb reverse --list
```

Debe mostrar ambas líneas (`tcp:8081 tcp:8081` y `tcp:8700 tcp:8700`).

## 5. Instalar la app (solo si no está instalada o cambió código nativo)

Si ya instalaste la app antes y solo cambiaste JS/TS, **salta este paso** — Metro sirve el bundle nuevo al reiniciar la app (paso 6).

Si necesitas compilar e instalar desde cero:

```powershell
cd C:\Users\giova\Downloads\REMEZA-DEFINITIVA\android
$env:ANDROID_SERIAL = "ZY32CMJK4Z"
.\gradlew.bat app:installDebug -x lint -PreactNativeDevServerPort=8081
```

> **No uses `npx react-native run-android`** — en esta máquina (Node v24) falla siempre con `"gradlew.bat" no se reconoce como un comando`. Es un bug conocido del CLI de RN en Windows con Node 24 (bloquea el spawn directo de `.bat` sin `shell:true`). El workaround es invocar `gradlew.bat` directo como arriba.

## 6. Lanzar/relanzar la app en el teléfono

```powershell
adb shell am force-stop com.remezaapp
adb shell monkey -p com.remezaapp -c android.intent.category.LAUNCHER 1
```

Con esto la app abre y se conecta a Metro (8081) y al backend (8700) a través de los túneles `adb reverse`.

## Login de prueba

- Teléfono en formato **E.164 completo**: `+525538068807` (no solo los 10 dígitos).
- Código: `123456`.
- Es el único cliente en la base de datos (mexicano). El login no manda SMS real, solo valida contra la base.

## Problemas comunes y solución rápida

| Síntoma | Causa | Solución |
|---|---|---|
| Pantalla roja "Unable to load script" | Los túneles `adb reverse` se perdieron (p. ej. tras un build con Gradle) | Repetir paso 4 |
| Teléfono aparece como `unauthorized` en `adb devices` | Gradle arrancó su propio demonio adb y reseteó la autorización USB | Desbloquear el teléfono, aceptar el prompt de nuevo, repetir paso 4 |
| Install falla con `INSTALL_FAILED_UPDATE_INCOMPATIBLE` | Ya había una versión instalada con otra firma (p. ej. build de EAS) | `adb uninstall com.remezaapp` (pide confirmación al usuario, borra datos locales) y reinstalar |
| Metro: "Unable to resolve module .../icons/<nombre>.js" (lucide-react-native) | Instalación previa incompleta del paquete de íconos | `rm -rf node_modules/lucide-react-native && npm cache clean --force && npm install lucide-react-native@<version> --no-save`, luego reiniciar Metro con `npx react-native start --reset-cache` |
| Cambié `translations.ts` y perdí la sesión | Ese archivo recarga la app completa al guardarlo | Normal — volver a iniciar sesión |

## Apagar todo al terminar

Cierra las dos ventanas de PowerShell (backend y Metro) con `Ctrl+C`, o:

```powershell
adb reverse --remove-all
```

para quitar los túneles (no es obligatorio, pero deja el dispositivo limpio).
