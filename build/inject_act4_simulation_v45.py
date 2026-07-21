from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "_site" / "index.html"
CSS = ROOT / "act4-simulation-v45.css"
PLACEMENT_CSS = ROOT / "act2-simulation-placement-v46.css"
JS = ROOT / "act4-simulation-v45.js"
MARKER = "act4-simulation-v45"


def main() -> None:
    required = [OUTPUT, CSS, PLACEMENT_CSS, JS]
    missing = [str(path.relative_to(ROOT)) for path in required if not path.exists()]
    if missing:
        raise FileNotFoundError(f"Missing ACT 02 twin narrative input: {', '.join(missing)}")

    html = OUTPUT.read_text(encoding="utf-8")
    if MARKER in html:
        print("ACT 02 twin scrollytelling already injected")
        return

    if html.count("</head>") != 1 or html.count("</body>") != 1:
        raise RuntimeError("Generated site head/body boundary is missing or ambiguous")

    css = CSS.read_text(encoding="utf-8").strip()
    placement_css = PLACEMENT_CSS.read_text(encoding="utf-8").strip()
    js = JS.read_text(encoding="utf-8").strip()

    html = html.replace(
        "</head>",
        f"<style>\n{css}\n\n{placement_css}\n</style>\n</head>",
        1,
    )
    html = html.replace("</body>", f"<script>\n{js}\n</script>\n</body>", 1)

    required_markers = [
        MARKER,
        "document.querySelector('#act2')",
        "act2.appendChild(story)",
        "從人工配置稽核",
        "自主配置前的驗證",
        "act4TwinCanvasV45",
        "比較不是判決",
        "ACT 03：自主配置成立的條件",
    ]
    missing_markers = [marker for marker in required_markers if marker not in html]
    if missing_markers:
        raise RuntimeError(f"ACT 02 twin scrollytelling markers are missing: {missing_markers}")

    if "document.querySelector('#act4')" in js:
        raise RuntimeError("Twin narrative still targets ACT 04")

    OUTPUT.write_text(html, encoding="utf-8")
    print(f"Injected ACT 02 twin scrollytelling and 01-03 narrative bridge in {OUTPUT}")


if __name__ == "__main__":
    main()
