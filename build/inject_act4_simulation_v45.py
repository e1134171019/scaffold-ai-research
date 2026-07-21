from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "_site" / "index.html"
CSS = ROOT / "act4-simulation-v45.css"
JS = ROOT / "act4-simulation-v45.js"
MARKER = "act4-simulation-v45"


def main() -> None:
    required = [OUTPUT, CSS, JS]
    missing = [str(path.relative_to(ROOT)) for path in required if not path.exists()]
    if missing:
        raise FileNotFoundError(f"Missing ACT 04 simulation input: {', '.join(missing)}")

    html = OUTPUT.read_text(encoding="utf-8")
    if MARKER in html:
        print("ACT 04 simulation narrative already injected")
        return

    if html.count("</head>") != 1 or html.count("</body>") != 1:
        raise RuntimeError("Generated site head/body boundary is missing or ambiguous")

    css = CSS.read_text(encoding="utf-8").strip()
    js = JS.read_text(encoding="utf-8").strip()

    html = html.replace("</head>", f"<style>\n{css}\n</style>\n</head>", 1)
    html = html.replace("</body>", f"<script>\n{js}\n</script>\n</body>", 1)

    required_markers = [
        MARKER,
        "原本程式已能重新驗算",
        "再加入一條不看人工答案的仿真路徑",
        "差異不是判決，而是審查範圍",
    ]
    missing_markers = [marker for marker in required_markers if marker not in html]
    if missing_markers:
        raise RuntimeError(f"ACT 04 simulation markers are missing: {missing_markers}")

    OUTPUT.write_text(html, encoding="utf-8")
    print(f"Injected ACT 04 simulation narrative into {OUTPUT}")


if __name__ == "__main__":
    main()
