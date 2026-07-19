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
PART_NAMES = [
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
PARTS = [BUILD_DIR / name for name in PART_NAMES]
OUTPUT_DIR = ROOT / "_site"
OUTPUT = OUTPUT_DIR / "index.html"

SITE_ASSETS = [
    "narrative-v23.css",
    "storyline-v26.css",
    "feature-bridge-v24.css",
    "act3-v29.css",
    "narrative-v23.js",
    "feature-bridge-v24.js",
    "act3-v29.js",
]

STYLE_MARKUP = (
    '<link rel="stylesheet" href="./narrative-v23.css?v=29">'
    '<link rel="stylesheet" href="./storyline-v26.css?v=29">'
    '<link rel="stylesheet" href="./feature-bridge-v24.css?v=29">'
    '<link rel="stylesheet" href="./act3-v29.css?v=29">'
    '<style>@media (max-width:760px){'
    '.nv-feature-stage-v24:not(:last-child)::after{display:grid}'
    '}</style>'
)

SCRIPT_MARKUP = (
    '<script src="./narrative-v23.js?v=29"></script>'
    '<script src="./feature-bridge-v24.js?v=29"></script>'
    '<script src="./act3-v29.js?v=29"></script>'
)


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def inject_site_assets(html: str) -> str:
    """Attach the narrative/layout layer to the generated single-page report."""
    if "narrative-v23.css?v=29" not in html:
        if "</head>" not in html:
            raise RuntimeError("Generated HTML is missing </head>")
        html = html.replace("</head>", f"{STYLE_MARKUP}</head>", 1)

    if "narrative-v23.js?v=29" not in html:
        if "</body>" not in html:
            raise RuntimeError("Generated HTML is missing </body>")
        html = html.replace("</body>", f"{SCRIPT_MARKUP}</body>", 1)

    return html


def copy_site_assets() -> None:
    for name in SITE_ASSETS:
        source = ROOT / name
        if not source.exists():
            raise FileNotFoundError(f"Missing site asset: {source}")
        shutil.copy2(source, OUTPUT_DIR / name)


def main() -> None:
    if not SOURCE.exists():
        raise FileNotFoundError(f"Missing source file: {SOURCE}")

    missing = [path.name for path in PARTS if not path.exists()]
    if missing:
        raise FileNotFoundError(f"Missing delta parts: {', '.join(missing)}")

    encoded = "".join(path.read_text(encoding="ascii").strip() for path in PARTS)
    payload = zlib.decompress(base64.b64decode(encoded))
    delta = json.loads(payload.decode("utf-8"))

    old = SOURCE.read_bytes()
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
            raise RuntimeError(f"Unknown delta operation: {kind}")

    final = bytes(result)
    if sha256(final) != delta["new_sha256"]:
        raise RuntimeError("Generated v26 checksum verification failed")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    html = final.decode("utf-8")
    html = inject_site_assets(html)
    OUTPUT.write_text(html, encoding="utf-8")
    copy_site_assets()

    (OUTPUT_DIR / ".nojekyll").write_text("", encoding="utf-8")
    print(f"Generated {OUTPUT} ({OUTPUT.stat().st_size:,} bytes) with narrative assets")


if __name__ == "__main__":
    main()
