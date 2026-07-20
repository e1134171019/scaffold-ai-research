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
ARRANGEMENT_HTML = ROOT / "arrangement-methods-v38.html"
ARRANGEMENT_CSS = ROOT / "arrangement-methods-v38.css"
FEATURE_BRIDGE_CSS = ROOT / "feature-bridge-v39.css"
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


def inject_arrangement_method_story(old: bytes) -> bytes:
    """Add the ACT 02 narrative bridge after the case context and before details."""
    html = old.decode("utf-8")
    if 'id="arrangementMethodsTitle"' in html:
        return old

    arrangement_html = ARRANGEMENT_HTML.read_text(encoding="utf-8").strip()
    arrangement_css = ARRANGEMENT_CSS.read_text(encoding="utf-8").strip()
    feature_bridge_css = FEATURE_BRIDGE_CSS.read_text(encoding="utf-8").strip()
    act2_start = html.find('<section class="section act2')
    act3_start = html.find('<section class="section act3', act2_start + 1)
    if act2_start < 0 or act3_start < 0 or act3_start <= act2_start:
        raise RuntimeError("ACT 02 boundaries are missing or ambiguous")
    act2 = html[act2_start:act3_start]
    anchor = '<div class="case-stack">'
    if act2.count(anchor) != 1:
        raise RuntimeError("ACT 02 case-stack anchor is missing or ambiguous")
    if "</head>" not in html:
        raise RuntimeError("Generated site head is missing")

    insertion_point = act2_start + act2.index(anchor)
    html = html[:insertion_point] + f"{arrangement_html}\n\n" + html[insertion_point:]
    html = html.replace(
        "</head>",
        f"<style>\n{arrangement_css}\n\n{feature_bridge_css}\n</style>\n</head>",
        1,
    )

    replacements = [
        (
            "ACT 02 introduction",
            "先確認本案使用哪一種施工架，再把建築外形拆成直線、轉角、短跨、突出物與屋頂等工程特徵。這些特徵，才是後續CAD程式真正需要辨識的對象。",
            "本章先分清兩種資料：建商提供的建築圖，以及已經畫好施工架的歷史 CAD。前者是未來系統要理解的輸入；後者用來說明人工怎麼配置、怎麼計數，並驗證規則是否正確。",
        ),
        (
            "historical case heading",
            "本案初步判斷：傳統框式施工架",
            "本案案例：已完成的傳統框式施工架配置",
        ),
        (
            "historical case explanation",
            "客戶圖面具有固定架跨、矩形排列與 X 形拉桿。圖面另標示標準尺寸約 183 × 80，並以「2 組鷹架＝3 支主架」說明基本關係。",
            "這張案例圖已經包含繪圖員完成的施工架配置，可看到固定架跨、矩形排列、X 形拉桿，以及 183 × 80 等配置標記。這些是本案的結果資料，不是建商建築圖必備的輸入。",
        ),
        (
            "project specification heading",
            "設計與計算依據",
            "先確認搭架法與元件規格",
        ),
        (
            "project specification explanation",
            "法規決定安全限制，CNS 與產品型錄決定元件能力，CAD 記錄本案配置。自動換算前必須先確認元件規格、圖層語意與工程條件。",
            "系統不能先看到一條線就開始計數。要先由客戶／專案 Profile 確認搭架法、產品型號、標準尺寸與計數項目，再判斷圖面能不能進入計算。",
        ),
        (
            "historical assembly heading",
            "<h3>傳統框式施工架基本概念</h3>",
            "<h3>案例圖：人工配置如何形成數量</h3>",
        ),
        (
            "historical assembly explanation",
            "先看懂一個架跨，再理解架列遇到外凸角與內凹角時，為什麼數量關係會改變。",
            "以下先用已完成的案例圖，說明架跨、轉角與分段會怎麼改變數量。這不是建商建築圖的內容，也不是所有搭架法的通用答案。",
        ),
        (
            "historical map instruction",
            "點擊右側圖中的對應區域，查看客戶 DXF 的實際位置與判讀過程。",
            "點擊右側圖中的區域，查看這張歷史案例如何形成工程特徵；建商建築圖的辨識流程會在後續階段說明。",
        ),
        (
            "special case heading",
            "標準模數無法直接處理的情況",
            "歷史案例中的特殊位置",
        ),
        (
            "special case explanation",
            "剩餘尺寸、突出物與屋頂收頭，不能只用建築周長除以 183 cm。",
            "以下位置來自歷史案例中已經遇到的配置問題，先用來建立規則候選；實際能否計算，仍要看搭架法、元件規格與輸入資料是否齊全。",
        ),
        (
            "special case instruction",
            "3D 圖先說明概念；點擊後，詳解會指出 DXF 中的候選位置或明確顯示資料缺口。",
            "3D 圖先說明案例；點擊後查看配置問題與資料缺口。資料不足時回報缺件，不把未知位置當成零。",
        ),
    ]
    for label, old_text, new_text in replacements:
        if html.count(old_text) != 1:
            raise RuntimeError(f"{label} replacement target is missing or ambiguous")
        html = html.replace(old_text, new_text, 1)

    markers = {
        "head_end": html.find("</head>"),
        "act2": html.find('<section class="section act2'),
        "method_bridge": html.find('<section class="method-bridge'),
        "case_stack": html.find(anchor),
        "act3": html.find('<section class="section act3'),
    }
    positions = list(markers.values())
    if any(position < 0 for position in positions) or positions != sorted(positions):
        raise RuntimeError(f"Arrangement block is outside the ACT 02 boundary: {markers}")
    if html.count('<section class="method-bridge') != 1:
        raise RuntimeError("Arrangement block count is not exactly one")
    if html.count('class="method-step"') != 3:
        raise RuntimeError("Arrangement block must contain exactly three method steps")
    return html.encode("utf-8")


def main() -> None:
    required = [
        SOURCE,
        SCHEME2_DELTA,
        SCHEME3_DELTA,
        ARRANGEMENT_HTML,
        ARRANGEMENT_CSS,
        FEATURE_BRIDGE_CSS,
        *BASE_PARTS,
    ]
    missing = [str(path.relative_to(ROOT)) for path in required if not path.exists()]
    if missing:
        raise FileNotFoundError(f"Missing build input: {', '.join(missing)}")

    v22 = SOURCE.read_bytes()
    v26 = apply_byte_delta(v22, load_delta(BASE_PARTS))
    scheme2 = apply_line_delta(v26, load_delta([SCHEME2_DELTA]), "Scheme 2")
    scheme3 = apply_line_delta(scheme2, load_delta([SCHEME3_DELTA]), "Scheme 3")
    scheme3 = inject_arrangement_method_story(scheme3)

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
