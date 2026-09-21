"""
Reconstruye el fondo neón a resolución nativa a partir de la imagen de
referencia (769x1600, muy comprimida).

Escalar la referencia tal cual la deja borrosa: sus filamentos miden 1 px y al
ampliarlos se ensanchan. La imagen se separa en dos capas:

  · Baja frecuencia (halos, degradados, viñeta): se escala sin pérdida visible,
    porque no tiene detalle fino que perder.
  · Filamentos: se amplían y se les re-estrecha el perfil con una curva gamma
    (un lomo suave elevado a una potencia vuelve a ser estrecho) y se les
    devuelve el brillo. Así recuperan el grosor de un trazo nítido sin
    inventar geometría: la composición es exactamente la de la referencia.

Salidas:
  src/assets/neon-bg.jpg       fondo nítido
  src/assets/neon-bg-blur.jpg  el mismo fondo desenfocado (cristal de los paneles)
  design/source/neon-bg-preview.jpg  referencia | resultado, para revisar

    python design/prepare-background.py
"""

import os

import cv2
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "source", "neon-bg-reference.jpg")
OUT = os.path.join(HERE, "..", "src", "assets", "neon-bg.jpg")
OUT_BLUR = os.path.join(HERE, "..", "src", "assets", "neon-bg-blur.jpg")
PREVIEW = os.path.join(HERE, "source", "neon-bg-preview.jpg")

OUT_H = 3200  # alto del asset final (cubre 1440p a resolución nativa)
SPLIT_SIGMA = 2.2  # separa filamentos (alta) de halos (baja), en px de origen
DENOISE = 3  # limpia el ruido JPEG antes de realzar
GAMMA = 1.9  # >1 estrecha el perfil del filamento
GAIN = 2.1  # brillo que se le devuelve tras estrecharlo
BLUR_RADIUS = 38  # desenfoque del cristal, en px del asset final
BLUR_SCALE = 0.6  # resolución del asset desenfocado
BLUR_EXPOSURE = 1.18  # la luz que "atraviesa" el cristal
DITHER = 0.6  # ruido sub-nivel: evita el bandeado en los degradados oscuros


def split_layers(img):
    """Separa la imagen en capa suave y capa de filamentos."""
    smooth = cv2.GaussianBlur(img, (0, 0), SPLIT_SIGMA)
    detail = np.clip(img - smooth, 0, None)
    return smooth, detail


def sharpen_filaments(detail, out_size):
    """
    Amplía los filamentos y les re-estrecha el perfil.

    El realce se hace sobre la intensidad (no por canal) para no desplazar el
    color: se calcula el factor con la luminancia y se aplica a los tres
    canales por igual.
    """
    detail = cv2.bilateralFilter(detail.astype(np.float32), DENOISE, 24, 6)
    big = cv2.resize(detail, out_size, interpolation=cv2.INTER_LANCZOS4)
    big = np.clip(big, 0, None)

    lum = big.max(axis=2)
    peak = np.percentile(lum[lum > 0], 99.5) if (lum > 0).any() else 1.0
    norm = np.clip(lum / max(peak, 1e-3), 0, 1.4)

    # gamma: estrecha el lomo; el factor devuelve el pico al brillo original
    narrowed = np.power(norm, GAMMA)
    factor = np.divide(narrowed, np.maximum(norm, 1e-4)) * GAIN

    return big * factor[:, :, None]


def main():
    ref = cv2.imread(SRC, cv2.IMREAD_COLOR)
    if ref is None:
        raise SystemExit(f"No se encontró la referencia: {SRC}")
    ref = ref.astype(np.float32)

    src_h, src_w = ref.shape[:2]
    out_w = int(round(src_w * OUT_H / src_h))
    out_size = (out_w, OUT_H)

    smooth, detail = split_layers(ref)

    base = cv2.resize(smooth, out_size, interpolation=cv2.INTER_CUBIC)
    base = cv2.GaussianBlur(base, (0, 0), 1.2)  # borra el bloqueo JPEG residual

    canvas = base + sharpen_filaments(detail, out_size)

    # Ruido sub-nivel: en 8 bits, los degradados oscuros se escalonan; un dither
    # de amplitud menor a un nivel lo rompe sin ensuciar la imagen.
    rng = np.random.default_rng(7)
    canvas += rng.normal(0.0, DITHER, canvas.shape).astype(np.float32)
    canvas = np.clip(canvas, 0, 255).astype(np.uint8)

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    cv2.imwrite(
        OUT,
        canvas,
        [cv2.IMWRITE_JPEG_QUALITY, 96, cv2.IMWRITE_JPEG_SAMPLING_FACTOR, 0x111111],
    )
    print("escrito", os.path.normpath(OUT), out_size, os.path.getsize(OUT) // 1024, "KB")

    blurred = cv2.GaussianBlur(canvas.astype(np.float32), (0, 0), BLUR_RADIUS)
    blurred = cv2.resize(
        blurred,
        (int(out_w * BLUR_SCALE), int(OUT_H * BLUR_SCALE)),
        interpolation=cv2.INTER_AREA,
    )
    # El cristal deja pasar la luz: se sube algo la exposición y la saturación
    # para que el panel no parezca un filtro gris sobre el fondo.
    blurred *= BLUR_EXPOSURE
    hsv = cv2.cvtColor(np.clip(blurred, 0, 255).astype(np.uint8), cv2.COLOR_BGR2HSV).astype(np.float32)
    hsv[:, :, 1] = np.clip(hsv[:, :, 1] * 1.12, 0, 255)
    blurred = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR).astype(np.float32)
    blurred += rng.normal(0.0, DITHER, blurred.shape).astype(np.float32)
    cv2.imwrite(OUT_BLUR, np.clip(blurred, 0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 95, cv2.IMWRITE_JPEG_SAMPLING_FACTOR, 0x111111])
    print("escrito", os.path.normpath(OUT_BLUR), blurred.shape[1::-1], os.path.getsize(OUT_BLUR) // 1024, "KB")

    # Recorte al 100 % de la esquina superior izquierda: referencia ampliada
    # frente al resultado, para juzgar la nitidez real.
    crop_w, crop_h = out_w // 2, OUT_H // 4
    ref_zoom = cv2.resize(ref, out_size, interpolation=cv2.INTER_CUBIC)[:crop_h, :crop_w]
    new_zoom = canvas[:crop_h, :crop_w]
    cv2.imwrite(
        PREVIEW,
        np.hstack([ref_zoom.astype(np.uint8), new_zoom]),
        [cv2.IMWRITE_JPEG_QUALITY, 95],
    )
    print("comparación (izq: escalado simple, der: reconstruido):", os.path.normpath(PREVIEW))

    full = os.path.join(HERE, "source", "neon-bg-full.jpg")
    side = (out_w // 3, OUT_H // 3)
    cv2.imwrite(
        full,
        np.hstack(
            [
                cv2.resize(ref, side, interpolation=cv2.INTER_AREA).astype(np.uint8),
                cv2.resize(canvas, side, interpolation=cv2.INTER_AREA),
            ]
        ),
        [cv2.IMWRITE_JPEG_QUALITY, 92],
    )
    print("comparación completa:", os.path.normpath(full))


if __name__ == "__main__":
    main()
