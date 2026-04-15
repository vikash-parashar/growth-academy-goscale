#!/usr/bin/env python3
"""Flood-fill near-white edge background to alpha. Usage:
  python3 scripts/make-logo-transparent.py ../logo.png public/logo.png
"""
from collections import deque
from PIL import Image
import sys


def main():
    if len(sys.argv) < 3:
        print("usage: make-logo-transparent.py <input.png> <output.png>")
        sys.exit(1)
    src, dst = sys.argv[1], sys.argv[2]
    TH = 248

    img = Image.open(src).convert("RGBA")
    w, h = img.size
    px = img.load()

    def is_bg(x, y):
        r, g, b, _ = px[x, y]
        return r >= TH and g >= TH and b >= TH

    visited = set()
    q = deque()

    for xi in range(w):
        for yi in (0, h - 1):
            if is_bg(xi, yi) and (xi, yi) not in visited:
                visited.add((xi, yi))
                q.append((xi, yi))
    for yi in range(h):
        for xi in (0, w - 1):
            if is_bg(xi, yi) and (xi, yi) not in visited:
                visited.add((xi, yi))
                q.append((xi, yi))

    while q:
        x, y = q.popleft()
        r, g, b, _ = px[x, y]
        px[x, y] = (r, g, b, 0)
        for dx, dy in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in visited and is_bg(nx, ny):
                visited.add((nx, ny))
                q.append((nx, ny))

    img.save(dst, "PNG", optimize=True)
    print("wrote", dst)


if __name__ == "__main__":
    main()
