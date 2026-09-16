#!/usr/bin/env python3
"""
Adaptador mínimo Will App → WAIPL Verification Gate v1.0.

No reimplementa el Gate. Solo:
1) normaliza un ciclo Will App (resultado/evidencia/verificación/dictamen) al case JSON del Gate;
2) llama a gate_close.close_case / accept_closure.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

# Gate modules live alongside this file (vendored from SENTINEL)
from gate_close import accept_closure, close_case
from receipt import verify_receipt


def will_cycle_to_case(cycle: dict[str, Any]) -> dict[str, Any]:
    """
    Ciclo Will App esperado (mínimo):
      id, resultado, evidencia, verificacion, dictamen,
      requisitos_obligatorios[], refs opcionales
    """
    return {
        "id": cycle.get("id") or cycle.get("cycle_id") or "WILL_APP_CYCLE",
        "resultado": bool(cycle.get("resultado")),
        "evidencia": bool(cycle.get("evidencia")),
        "verificacion": bool(cycle.get("verificacion")),
        "dictamen": bool(cycle.get("dictamen")),
        "result_ref": cycle.get("result_ref") or cycle.get("id"),
        "evidence_refs": cycle.get("evidence_refs") or [],
        "dictamen_ref": cycle.get("dictamen_ref"),
        "requisitos_obligatorios": cycle.get("requisitos_obligatorios") or [],
        "confirmed_failure": bool(cycle.get("confirmed_failure")),
        "human_acceptance_required": bool(cycle.get("human_acceptance_required")),
        "human_acceptance": bool(cycle.get("human_acceptance")),
        "source": "will_app",
        "integration_point": "api/audit → verification-gate adapter",
    }


def close_will_cycle(cycle: dict[str, Any], **kwargs: Any) -> dict[str, Any]:
    case = will_cycle_to_case(cycle)
    return close_case(case, **kwargs)


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print("uso: will_app_adapter.py <will_cycle.json> [--force-verde]", file=sys.stderr)
        return 2
    force = "--force-verde" in argv
    path = Path([a for a in argv[1:] if not a.startswith("--")][0])
    cycle = json.loads(path.read_text(encoding="utf-8"))
    out = close_will_cycle(cycle, force_verde=force)
    # persist receipt next to case when closed or always
    receipt_path = path.with_suffix(path.suffix + ".gate_receipt.json")
    if "receipt" in out:
        receipt_path.write_text(json.dumps(out["receipt"], ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        out["receipt_path"] = str(receipt_path)
        # prove binding
        out["receipt_verify"] = verify_receipt(will_cycle_to_case(cycle), out["receipt"])
    json.dump(out, sys.stdout, ensure_ascii=False, indent=2)
    print()
    return 0 if out.get("closed") else 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
