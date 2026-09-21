"""
Extrae la paleta del fondo de la app agrupando los píxeles por bandas de
luminancia (k-means sobre cada banda). De aquí salen los valores de
`src/theme/theme.ts`, para que botones, bordes y halos usen exactamente los
mismos colores que las cintas de neón del fondo.

    python design/extract-palette.py
"""

import os

import cv2
import numpy as np

SRC = os.path.join(os.path.dirname(os.path.abspath(__file__)), "source", "neon-bg-reference.jpg")

BANDS = [
    ("Núcleos brillantes", 99.5, 100.0, 4),
    ("Filamentos", 97.0, 100.0, 5),
    ("Halos medios", 80.0, 96.0, 5),
    ("Fondo profundo", 0.0, 40.0, 3),
]


def dominant(pixels, k):
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 40, 0.5)
    _, labels, centers = cv2.kmeans(np.float32(pixels), k, None, criteria, 8, cv2.KMEANS_PP_CENTERS)
    counts = np.bincount(labels.flatten(), minlength=k)
    return [(centers[i], counts[i] / len(pixels)) for i in np.argsort(-counts)]


def main():
    img = cv2.imread(SRC, cv2.IMREAD_COLOR)
    if img is None:
        raise SystemExit(f"No se encontró la referencia: {SRC}")

    rgb = img[:, :, ::-1].reshape(-1, 3).astype(np.float32)
    lum = rgb.sum(axis=1)

    for name, low, high, k in BANDS:
        lo, hi = np.percentile(lum, low), np.percentile(lum, high)
        band = rgb[(lum >= lo) & (lum <= hi)]
        print(f"\n{name}  (percentil {low:g}–{high:g})")
        for color, share in dominant(band, k):
            r, g, b = [int(round(v)) for v in np.clip(color, 0, 255)]
            print(f"  #{r:02X}{g:02X}{b:02X}   {share * 100:5.1f}%")


if __name__ == "__main__":
    main()
