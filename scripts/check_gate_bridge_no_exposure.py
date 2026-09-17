from pathlib import Path
import sys
ROOT = Path(__file__).resolve().parents[1]
needles = [
    "VITE_GATE_BRIDGE_TOKEN",
    "VITE_GATE_SHARED",
    "localStorage",
    "sessionStorage",
]
# For localStorage we only fail if GATE_BRIDGE appears nearby in same file in src/
bad = []
skip = {"node_modules", ".git", "dist", ".vercel", "pgdata"}

def walk():
    for p in ROOT.rglob("*"):
        if not p.is_file():
            continue
        if any(s in p.parts for s in skip):
            continue
        if p.suffix.lower() not in {".ts", ".tsx", ".js", ".jsx", ".cjs", ".mjs", ".html", ".css", ".md", ".json", ".env"}:
            continue
        # allow docs and tests mentioning the name GATE_BRIDGE_TOKEN as documentation
        text = p.read_text(encoding="utf-8", errors="replace")
        rel = str(p.relative_to(ROOT)).replace("\\", "/")
        if "VITE_GATE_BRIDGE_TOKEN" in text or "VITE_GATE_SHARED" in text:
            bad.append((rel, "VITE_ exposure"))
        if rel.startswith("src/") and "GATE_BRIDGE_TOKEN" in text:
            bad.append((rel, "GATE_BRIDGE_TOKEN in src/"))
        if rel.startswith("src/") and "GATE_SHARED_SECRET" in text:
            bad.append((rel, "GATE_SHARED_SECRET in src/"))
        if rel.endswith((".html",)) and "GATE_BRIDGE_TOKEN" in text:
            bad.append((rel, "token in html"))
        # public bundles if any
        if "dist/" in rel and "GATE_BRIDGE_TOKEN" in text:
            bad.append((rel, "token in dist"))

walk()
if bad:
    print("EXPOSURE FAIL")
    for b in bad:
        print(b)
    sys.exit(1)
print("NO_EXPOSURE PASS (0 VITE_GATE_*; 0 src GATE_BRIDGE_TOKEN/GATE_SHARED_SECRET; 0 html/dist)")
