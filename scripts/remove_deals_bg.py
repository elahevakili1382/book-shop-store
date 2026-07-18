"""Remove cream background from deals banner PNGs, preserving book shadows."""
from __future__ import annotations

import math
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
IMAGES = [
    ROOT / "public" / "images" / "deals-books-left.png",
    ROOT / "public" / "images" / "deals-books-right.png",
]

# Cream/peach background tolerance (corners ~253,245,241)
BG_TOLERANCE = 28
FEATHER = 18


def sample_background(img: Image.Image) -> tuple[float, float, float]:
    w, h = img.size
    samples: list[tuple[int, int, int]] = []
    for x in range(w):
        samples.append(img.getpixel((x, 0))[:3])
        samples.append(img.getpixel((x, h - 1))[:3])
    for y in range(1, h - 1):
        samples.append(img.getpixel((0, y))[:3])
        samples.append(img.getpixel((w - 1, y))[:3])
    n = len(samples)
    return (
        sum(c[0] for c in samples) / n,
        sum(c[1] for c in samples) / n,
        sum(c[2] for c in samples) / n,
    )


def color_distance(rgb: tuple[int, ...], bg: tuple[float, float, float]) -> float:
    return math.sqrt(sum((rgb[i] - bg[i]) ** 2 for i in range(3)))


def remove_background(path: Path) -> None:
    img = Image.open(path).convert("RGBA")
    bg = sample_background(img)
    pixels = img.load()
    w, h = img.size
    transparent = 0

    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            dist = color_distance((r, g, b), bg)
            if dist <= BG_TOLERANCE:
                pixels[x, y] = (r, g, b, 0)
                transparent += 1
            elif dist <= BG_TOLERANCE + FEATHER:
                factor = (dist - BG_TOLERANCE) / FEATHER
                new_a = int(a * factor)
                pixels[x, y] = (r, g, b, new_a)
                if new_a < 128:
                    transparent += 1

    img.save(path, "PNG", optimize=True)
    total = w * h
    print(f"{path.name}: bg={tuple(round(v) for v in bg)}, transparent={transparent}/{total} ({100*transparent/total:.1f}%)")


def main() -> None:
    for path in IMAGES:
        if not path.exists():
            raise FileNotFoundError(path)
        remove_background(path)


if __name__ == "__main__":
    main()
