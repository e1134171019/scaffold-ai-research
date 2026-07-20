from __future__ import annotations

import base64
import hashlib
import json
from pathlib import Path
import shutil
import zlib

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "施工架AI換算研究_第五篇規則化總結版_v22.html"
BUILD_DIR = ROOT / "build"
BASE_PART_NAMES = [
    "v26.delta.00a.part",
    "v26.delta.00b.part",
    "v26.delta.01a.part",
    "v26.delta.01b.part",
    "v26.delta.02.part",
    "v26.delta.03.part",
    "v26.delta.04.part",
    "v26.delta.05.part",
    "v26.delta.06.part",
]
BASE_PARTS = [BUILD_DIR / name for name in BASE_PART_NAMES]
SCHEME2_DELTA = BUILD_DIR / "scheme2-babylon-v36.delta"
SCHEME3_DELTA = BUILD_DIR / "scheme3-autonomous-v37.delta"
OUTPUT_DIR = ROOT / "_site"
OUTPUT = OUTPUT_DIR / "index.html"


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def load_delta(parts: list[Path]) -> dict:
    encoded = "".join(path.read_text(encoding="ascii").strip() for path in parts)
    return json.loads(zlib.decompress(base64.b64decode(encoded)).decode("utf-8"))


def apply_byte_delta(old: bytes, delta: dict) -> bytes:
    if sha256(old) != delta["old_sha256"]:
        raise RuntimeError("Source v22 checksum does not match the expected version")

    result = bytearray()
    for operation in delta["ops"]:
        kind = operation[0]
        if kind == "c":
            start, length = operation[1], operation[2]
            result.extend(old[start : start + length])
        elif kind == "i":
            result.extend(base64.b64decode(operation[1]))
        else:
            raise RuntimeError(f"Unknown byte-delta operation: {kind}")

    final = bytes(result)
    if sha256(final) != delta["new_sha256"]:
        raise RuntimeError("Generated v26 checksum verification failed")
    return final


def apply_line_delta(old: bytes, delta: dict, label: str) -> bytes:
    if delta.get("format") != "line-copy-insert-v1":
        raise RuntimeError(f"Unsupported {label} delta format")
    if sha256(old) != delta["old_sha256"]:
        raise RuntimeError(f"Input does not match the {label} delta base")

    old_lines = old.splitlines(keepends=True)
    if len(old_lines) != delta["old_line_count"]:
        raise RuntimeError(f"Input line count does not match the {label} delta")

    result = bytearray()
    for operation in delta["ops"]:
        kind = operation[0]
        if kind == "c":
            start, end = operation[1], operation[2]
            result.extend(b"".join(old_lines[start:end]))
        elif kind == "i":
            result.extend(base64.b64decode(operation[1]))
        else:
            raise RuntimeError(f"Unknown {label} line-delta operation: {kind}")

    final = bytes(result)
    if len(final.splitlines(keepends=True)) != delta["new_line_count"]:
        raise RuntimeError(f"Generated {label} line count verification failed")
    if sha256(final) != delta["new_sha256"]:
        raise RuntimeError(f"Generated {label} checksum verification failed")
    return final


def main() -> None:
    required = [SOURCE, SCHEME2_DELTA, SCHEME3_DELTA, *BASE_PARTS]
    missing = [str(path.relative_to(ROOT)) for path in required if not path.exists()]
    if missing:
        raise FileNotFoundError(f"Missing build input: {', '.join(missing)}")

    v22 = SOURCE.read_bytes()
    v26 = apply_byte_delta(v22, load_delta(BASE_PARTS))
    scheme2 = apply_line_delta(v26, load_delta([SCHEME2_DELTA]), "Scheme 2")
    scheme3 = apply_line_delta(scheme2, load_delta([SCHEME3_DELTA]), "Scheme 3")

    shutil.rmtree(OUTPUT_DIR, ignore_errors=True)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_bytes(scheme3)
    (OUTPUT_DIR / ".nojekyll").write_text("", encoding="utf-8")

    print(
        f"Generated {OUTPUT} ({OUTPUT.stat().st_size:,} bytes, "
        f"sha256={sha256(scheme3)})"
    )


if __name__ == "__main__":
    main()
