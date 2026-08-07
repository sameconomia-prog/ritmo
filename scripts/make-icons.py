#!/usr/bin/env python3
"""Genera los íconos PWA de RITMO. Ejecuta: npm run icons"""
from PIL import Image, ImageDraw
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "public" / "icons"
OUT.mkdir(parents=True, exist_ok=True)

BASE = (11, 15, 20)
ACCENT = (255, 122, 26)
ACCENT_SOFT = (255, 164, 92)

# Alturas relativas de las barras: un pulso rítmico que sube.
BARS = [0.30, 0.52, 0.86, 0.62, 0.40]


def draw_icon(size: int, padding_ratio: float, rounded: bool) -> Image.Image:
    """Dibuja el ícono a 4x y reduce, para bordes suaves sin antialias manual."""
    ss = 4
    s = size * ss
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    if rounded:
        d.rounded_rectangle([0, 0, s - 1, s - 1], radius=int(s * 0.22), fill=BASE)
    else:
        d.rectangle([0, 0, s - 1, s - 1], fill=BASE)

    pad = s * padding_ratio
    area = s - pad * 2
    n = len(BARS)
    gap = area / (n * 2.6)
    bar_w = (area - gap * (n - 1)) / n
    cy = s / 2

    for i, h in enumerate(BARS):
        bar_h = area * h
        x0 = pad + i * (bar_w + gap)
        y0 = cy - bar_h / 2
        # Degradado simple: las barras centrales, más claras.
        t = 1 - abs(i - (n - 1) / 2) / ((n - 1) / 2)
        color = tuple(int(ACCENT[c] + (ACCENT_SOFT[c] - ACCENT[c]) * t) for c in range(3))
        d.rounded_rectangle(
            [x0, y0, x0 + bar_w, y0 + bar_h],
            radius=bar_w / 2,
            fill=color,
        )

    return img.resize((size, size), Image.LANCZOS)


targets = [
    ("icon-192.png", 192, 0.26, True),
    ("icon-512.png", 512, 0.26, True),
    # Maskable: más margen porque Android recorta hasta un 20 % del borde.
    ("icon-512-maskable.png", 512, 0.34, False),
    ("apple-touch-icon.png", 180, 0.26, False),
    ("favicon.png", 64, 0.22, True),
]

for name, size, pad, rounded in targets:
    draw_icon(size, pad, rounded).save(OUT / name)
    print(f"  ✓ {name}  ({size}×{size})")

print(f"\nÍconos generados en {OUT}")
