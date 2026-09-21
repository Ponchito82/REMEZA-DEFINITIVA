# Rediseño Remeza — Glassmorphism + Neon

Referencia visual: `Diseños de Pantallas Remeza.pdf` (71 pantallas).
Las maquetas extraídas están en `design/mockups/sNN.jpg`, numeradas en orden de
lectura del PDF (izquierda→derecha, arriba→abajo).

## Sistema de diseño

| Pieza | Archivo |
| --- | --- |
| Tokens (paleta, glass, gradientes, radios, glow) | `src/theme/theme.ts` |
| Fondo: negro + cintas de luz adaptables | `src/components/ui/NeonBackground.tsx` |
| Panel de cristal (frosted real) | `src/components/ui/GlassCard.tsx` |
| Botón violeta con glow + flecha | `src/components/ui/NeonButton.tsx` |
| Campo de formulario en cristal | `src/components/ui/GlassField.tsx` |
| Selector segmentado | `src/components/ui/SegmentedToggle.tsx` |
| Selector de idioma (icono + segmentado) | `src/components/ui/LanguagePicker.tsx` |
| Logo Remeza con glow | `src/components/ui/BrandLogo.tsx` |
| Degradado lineal (extremos en fracciones, sin dependencias nativas) | `src/components/ui/Gradient.tsx` |
| Luz de 1 dp del canto superior | `src/components/ui/TopLight.tsx` |

## Tema negro con vidrio

La especificación vigente es la de implementación ("REMEZA — CÓMO IMPLEMENTAR EL
LOGIN Y LA BIENVENIDA EN REACT NATIVE"), con su maqueta renderizada en el
dispositivo. Los valores están en `src/theme/theme.ts` y salen tal cual de ella.

### El card es vidrio de verdad: translúcido sobre un fondo casi negro

Los valores salen de medir la captura de referencia del dispositivo:

| Pieza | Medido | Token |
| --- | --- | --- |
| Fondo | `#010104` — casi negro puro | `backdrop.black` |
| Interior del card | `#0C0A15` = violeta claro al 7 % sobre el fondo | `glass.cardInterior` |
| Inputs | `#1A1823` = blanco al 6 % sobre el card | `glass.inputFill` |
| Núcleo de las cintas | `#230B8B` | `beam` |

Lo que hace que el recuadro se lea como una lámina de vidrio es **el contraste
entre los dos**: un fondo que no deja pasar nada y un card que deja pasar algo.
Se probó con el interior opaco —incluso del color exacto del fondo— y el card se
leía como un agujero recortado, no como cristal.

El velo va **plano, no en degradado**: a estos valores quedan ocho o nueve
niveles por canal y un degradado extendido se corta en bandas.

**El filo se dibuja como trazo, no como relleno con padding.** Con el interior
opaco las dos técnicas daban lo mismo; con el interior translúcido un relleno se
vería entero por debajo del velo y teñiría el card de punta a punta. Un trazo
sólo pinta el perímetro. `borderColor` no sirve: no admite degradados.

### El fondo es adaptable y está dibujado

Dos cintas de luz en las esquinas opuestas —arriba a la izquierda y abajo a la
derecha—, sin ninguna imagen. Sus medidas van en **fracciones de la diagonal de
la pantalla**, así que se adaptan a cualquier resolución y proporción.

Las dos **no son simétricas**: medida en la referencia, la de arriba cae a 72°
sobre la horizontal y la de abajo a 38°.

Cada cinta son **tres capas**, y hacen falta las tres. El perfil perpendicular
medido en la referencia lo exige: el núcleo ocupa 5 dp, la anchura a media
altura son 17 dp y la cola sigue viva a 55 dp.

| Capa | Grosor | Qué es |
| --- | --- | --- |
| `core` | 3 dp, macizo | el filamento |
| `glow` | 34 dp, degradado | el resplandor que lo abraza |
| `halo` | 130 dp, degradado | la cola larga |

Con menos capas no sale, y se probó:

- **Con una sola capa ancha**, la cinta es una mancha difusa sin filamento.
- **Con dos** (núcleo + una cola larga), el resplandor se despega del filamento
  y se ve una línea de láser encima de una mancha. Es el fallo que más costó
  ver, porque cada cifra por separado parecía razonable.

**El núcleo va macizo, sin degradado transversal.** Un rectángulo de ocho
píxeles relleno con un degradado y girado en diagonal se come su propio pico en
el antialiasing: al probarlo, el núcleo desapareció y el perfil medido se quedó
en puro halo con el pico a la mitad. La suavidad la ponen las otras dos capas.

**La cinta cruza su esquina como una cuerda, no pasa por el vértice.** Centrada
en el vértice, la mitad del trazo se va fuera de pantalla y el máximo de la
máscara radial cae en un rincón de nada, así que apenas se ve. Su centro se mete
un 11 % de la diagonal hacia dentro, y ahí va también el centro de la máscara.

### Los degradados van en diagonal, no en ángulo

El eje de los morados es diagonal y **casi vertical**: claro arriba a la
izquierda, profundo abajo a la derecha. Aplanarlo a horizontal es lo que deja el
morado lavado. Por eso `Gradient` toma los extremos en **fracciones de la caja**
(`start`/`end`), con la misma semántica que react-native-linear-gradient, y los
valores de la especificación entran tal cual.

Se dibuja con `react-native-svg` y no con `react-native-linear-gradient`:
`react-native-svg` ya es dependencia del proyecto —lo usa el logo— y
`objectBoundingBox` de SVG es el mismo sistema de coordenadas que `start`/`end`,
así que el resultado es idéntico sin añadir una dependencia nativa nueva.

### Las luces de 1 dp las recorta el contenedor

`TopLight` es una vista absoluta de 1 dp que va de lado a lado; quien la redondea
en las esquinas es el `overflow: hidden` de la pieza. Recortarla a mano con
márgenes deja los extremos en seco y se lee como una raya pegada encima.

Ojo con dónde se pone ese recorte: el track del selector **no** puede llevarlo,
porque recortaría también el halo de la pastilla, que tiene que derramarse fuera.
En esos casos la luz va en su propia caja con recorte, y el halo queda libre.

### Sombras de color: `boxShadow`, nunca `elevation`

En Android `elevation` sólo da sombra negra —el halo morado no sale— y además la
pinta debajo de la vista, así que a través del canto se ve como un marco por
dentro del borde. `boxShadow` existe desde RN 0.76 con la nueva arquitectura
(aquí va 0.84), respeta el color y admite varias sombras en una misma vista, así
que el halo y la profundidad del card no necesitan Views separados y no hace
falta `react-native-shadow-2`. La decisión vive en el tema, no pieza por pieza.

### Inter, por nombre de familia

En Android `ReactFontManager` sólo resuelve la variante normal y la negrita a
partir de `fontWeight`, así que un 500 o un 600 caen en la regular y el sistema
finge la negrita estirando los trazos. Cada estilo nombra `Inter-Medium` o
`Inter-SemiBold` y **ninguno lleva `fontWeight`**.

Los .ttf están en `src/assets/fonts`, declarados en `react-native.config.js` y
enlazados con `npx react-native-asset`, que los copia al assets de Android y los
da de alta en el Info.plist de iOS. Dejarlos sólo dentro de `android/` funciona
en Android y deja iOS sin la fuente. **Tocarlos obliga a recompilar**: no basta
con recargar Metro.

### Una desviación consciente

El enlace "Forgot your access code?" sí está en la especificación de
implementación (paso 9 del login), así que ya no es un añadido mío. Sigue siendo
el único acceso a recuperar el código y `forgotAccessCode.spec.js` depende de su
`testID`.

## Paleta

`python design/extract-palette.py` agrupa los píxeles del fondo por bandas de
luminancia y devuelve los colores dominantes de cada una. Los valores de
`src/theme/theme.ts` salen de ahí, así que la interfaz usa exactamente los
mismos colores que las cintas de neón:

| Banda | Colores |
| --- | --- |
| Núcleos brillantes | `#9B42F6` `#E5A9FF` `#4882F9` `#A0D9FF` |
| Filamentos | `#5206D9` `#290AEC` `#1049E3` `#9150F7` `#CBBBFF` |
| Halos medios | `#020F7A` `#180172` `#240199` `#011DA1` |
| Fondo profundo | `#010222` `#010119` `#02022B` |

`GlassCard` pinta esa copia desenfocada dentro del panel, desplazada para que
coincida con lo que hay justo detrás (usa la posición que publica
`NeonBackground` vía `BackdropContext`). Así el cristal difumina el fondo de
verdad, sin necesidad de una librería nativa de blur.

## Inventario de pantallas

| # | Pantalla |
| --- | --- |
| s01 | Bienvenida (Remeza / Comenzar / Idioma) |
| s02 | Login (Language / Welcome / Sign In) |
| s03 | Verificación en dos pasos (OTP 6 dígitos) |
| s04 | Habilitar biometría |
| s05 | Alerta de seguridad (inicio de sesión no reconocido) |
| s06 | Soporte en vivo |
| s07 | Control de tu tarjeta |
| s08 | Historial de movimientos |
| s09 | Beneficiarios |
| s10 | Cuentas multidivisa |
| s11 | Cancelar o disputar |
| s12 | Dashboard (saldo + acciones + actividad) |
| s13 | Vincular cuenta bancaria |
| s14 | Banco conectado |
| s15 | Tipo de cambio |
| s16 | Notificaciones (switches) |
| s17 | Enviar dinero (cotizador) |
| s18 | Recupera tu acceso |
| s19 | Historial (lista con avatares) |
| s20 | Cancelar operación (cuenta regresiva) |
| s21 | Soporte 24/7 (chat) |
| s22 | Pago de servicios |
| s23 | Centro de ayuda |
| s24 | Perfil |
| s25 | Recupera tu cuenta (email) |
| s26 | Ingresa el código (email OTP) |
| s27 | Crea una nueva contraseña |
| s28 | ¡Contraseña actualizada! |
| s29 | Código incorrecto |
| s30 | ¡Biometría activada! |
| s31 | No se pudo reconocer tu huella |
| s32 | No se pudo vincular tu banco |
| s33 | Cuenta bancaria vinculada |
| s34 | ¿Desvincular cuenta bancaria? |
| s35 | Nueva moneda |
| s36 | Detalle de saldo |
| s37 | Seleccionar destinatario |
| s38 | Agregar nuevo beneficiario |
| s39 | Confirmar datos del beneficiario |
| s40 | Beneficiario agregado |
| s41 | Detalle del beneficiario |
| s42 | Editar beneficiario |
| s43 | Eliminar beneficiario |
| s44 | Revisar transferencia |
| s45 | Procesando transferencia |
| s46 | Transferencia exitosa |
| s47 | Comprobante de transferencia |
| s48 | Transferencia fallida |
| s49 | Detalle de movimiento |
| s50 | ¿Cancelar operación? |
| s51 | Operación cancelada |
| s52 | Configurar límites de tarjeta |
| s53 | Confirmar bloqueo de tarjeta |
| s54 | Tarjeta bloqueada |
| s55 | Eliminar tarjeta |
| s56 | Capturar referencia de servicio |
| s57 | Ingresar monto del servicio |
| s58 | Procesando pago de servicio |
| s59 | ¡Pago exitoso! |
| s60 | Comprobante de pago |
| s61 | No se pudo realizar el pago |
| s62 | Preguntas frecuentes |
| s63 | Guías y tutoriales |
| s64 | Límites y comisiones |
| s65 | Información de seguridad |
| s66 | Editar perfil |
| s67 | Métodos de pago |
| s68 | Preferencias |
| s69 | Cambiar contraseña |
| s70 | Verificación en dos pasos (ajustes) |
| s71 | Confirmar cierre de sesión |

## Plan por partes

1. **Base + acceso** — sistema de diseño, s01 bienvenida, s02 login. ✅
2. **Autenticación** — s03 OTP, s18/s25/s26/s27/s28/s29 recuperación, s04/s30/s31 biometría, s05 alerta de seguridad.
3. **Dashboard y saldo** — s12, s36, s10, s35, s15.
4. **Envío de dinero** — s17, s37–s48, s20, s50, s51.
5. **Beneficiarios** — s09, s38–s43.
6. **Tarjetas** — s07, s52–s55, s67.
7. **Movimientos** — s08, s19, s49, s11.
8. **Pago de servicios** — s22, s56–s61.
9. **Perfil y ajustes** — s24, s66, s68, s69, s70, s71, s16, s33, s34, s13, s14, s32, s64, s65.
10. **Ayuda y soporte** — s06, s21, s23, s62, s63.
