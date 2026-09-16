#!/usr/bin/env python3
"""Fail if vendored Gate core files diverge from GATE_MANIFEST.json."""
from __future__ import annotations
import hashlib, json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "waipl_verification_gate"
manifest = json.loads((ROOT / "GATE_MANIFEST.json").read_text(encoding="utf-8"))
failed = []
for name, expect in manifest["files"].items():
    path = ROOT / name
    if not path.exists():
        failed.append(f"missing {name}")
        continue
    got = hashlib.sha256(path.read_bytes()).hexdigest()
    if got != expect:
        failed.append(f"hash mismatch {name}: got {got} expected {expect}")
print("pinned_commit=", manifest.get("pinned_commit"))
if failed:
    print("DIVERGENCE:")
    for f in failed:
        print(" -", f)
    sys.exit(1)
print("GATE_MANIFEST OK")
