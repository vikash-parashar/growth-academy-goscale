#!/usr/bin/env python3
"""Make Gopher Lab mark PNG transparent: outer near-white + connected navy card.

Usage:
  python3 scripts/transparent-gopher-mark.py public/gopher-lab-mark.png
  python3 scripts/transparent-gopher-mark.py public/gopher-lab-mark.png ../src/app/icon.png
"""
from __future__ import annotations

from collections import deque
import math
import sys

from PIL import Image

WHITE_TH = 236
# Brand-ish dark navy from logo background; Euclidean distance for anti-aliased edges
NAVY_REF = (27, 60, 83)
NAVY_DIST = 52


def is_near_white(r: int, g: int, b: int) -> bool:
    return r >= WHITE_TH and g >= WHITE_TH and b >= WHITE_TH


def is_navyish(r: int, g: int, b: int) -> bool:
    d = math.sqrt(
        (r - NAVY_REF[0]) ** 2 + (g - NAVY_REF[1]) ** 2 + (b - NAVY_REF[2]) ** 2,
    )
    return d <= NAVY_DIST


def flood_white_edges(px, w: int, h: int) -> None:
    visited: set[tuple[int, int]] = set()
    q: deque[tuple[int, int]] = deque()

    for xi in range(w):
        for yi in (0, h - 1):
            if is_near_white(*px[xi, yi][:3]) and (xi, yi) not in visited:
                visited.add((xi, yi))
                q.append((xi, yi))
    for yi in range(h):
        for xi in (0, w - 1):
            if is_near_white(*px[xi, yi][:3]) and (xi, yi) not in visited:
                visited.add((xi, yi))
                q.append((xi, yi))

    while q:
        x, y = q.popleft()
        r, g, b, _ = px[x, y]
        px[x, y] = (r, g, b, 0)
        for dx, dy in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            nx, ny = x + dx, y + dy
            if (
                0 <= nx < w
                and 0 <= ny < h
                and (nx, ny) not in visited
                and is_near_white(*px[nx, ny][:3])
            ):
                visited.add((nx, ny))
                q.append((nx, ny))


def flood_navy_touching_transparent(px, w: int, h: int) -> None:
    visited: set[tuple[int, int]] = set()
    q: deque[tuple[int, int]] = deque()

    def neighbors(x: int, y: int):
        for dx, dy in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            yield x + dx, y + dy

    for y in range(h):
        for x in range(w):
            if px[x, y][3] != 0:
                continue
            for nx, ny in neighbors(x, y):
                if not (
                    0 <= nx < w
                    and 0 <= ny < h
                    and px[nx, ny][3] != 0
                    and is_navyish(*px[nx, ny][:3])
                ):
                    continue
                if (nx, ny) not in visited:
                    visited.add((nx, ny))
                    q.append((nx, ny))

    while q:
        x, y = q.popleft()
        r, g, b, a = px[x, y]
        if a == 0:
            continue
        px[x, y] = (r, g, b, 0)
        for nx, ny in neighbors(x, y):
            if not (0 <= nx < w and 0 <= ny < h):
                continue
            if px[nx, ny][3] == 0 or (nx, ny) in visited:
                continue
            if not is_navyish(*px[nx, ny][:3]):
                continue
            visited.add((nx, ny))
            q.append((nx, ny))


def soften_halo(px, w: int, h: int) -> None:
    """Dim near-white pixels next to transparent (leftover AA fringe)."""
    for y in range(h):
        for x in range(w):
            if px[x, y][3] == 0:
                continue
            r, g, b, _ = px[x, y]
            if not (r >= 210 and g >= 210 and b >= 210):
                continue
            touches = False
            for dx, dy in ((-1, 0), (1, 0), (0, -1), (0, 1)):
                nx, ny = x + dx, y + dy
                if (
                    0 <= nx < w
                    and 0 <= ny < h
                    and px[nx, ny][3] == 0
                ):
                    touches = True
                    break
            if touches:
                px[x, y] = (r, g, b, 0)


def make_transparent(src: str) -> Image.Image:
    img = Image.open(src).convert("RGBA")
    w, h = img.size
    px = img.load()

    flood_white_edges(px, w, h)
    flood_navy_touching_transparent(px, w, h)
    soften_halo(px, w, h)
    return img


def main() -> None:
    args = [a for a in sys.argv[1:] if a]
    if len(args) < 1:
        print("usage: transparent-gopher-mark.py <input.png> [output.png ...]")
        sys.exit(1)
    src = args[0]
    outs = args[1:] if len(args) > 1 else [src]
    img = make_transparent(src)
    for dst in outs:
        img.save(dst, "PNG", optimize=True)
        print("wrote", dst, img.size)


if __name__ == "__main__":
    main()
