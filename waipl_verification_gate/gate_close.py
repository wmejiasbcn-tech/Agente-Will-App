#!/usr/bin/env python3
"""Único punto de cierre operacional — Final-State Contract + receipt binding."""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

from final_state import REQUIRED_FIELDS, build_final_state
from receipt import assert_closure_authorized, bind_receipt, verify_receipt


class GateBypassError(PermissionError):
    pass


def close_case(
    case: dict[str, Any],
    *,
    force_verde: bool = False,
    force_closed: bool = False,
    desired_semaforo: str | None = None,
) -> dict[str, Any]:
    bypass = None
    if force_verde or force_closed or (desired_semaforo and str(desired_semaforo).upper() == "VERDE"):
        bypass = {
            "force_verde": force_verde,
            "force_closed": force_closed,
            "desired_semaforo": desired_semaforo,
        }
    final = build_final_state(case, bypass_attempt=bypass)
    receipt = bind_receipt(final, case)
    final["receipt"] = receipt
    final["authorized"] = final["closed"] and final["gate_status"] == "AUTHORIZED"
    final["semaforo"] = final["state"]
    final["CLOSED"] = final["closed"]
    final["OPEN"] = final["open"]
    return final


def close_case_file(path: str | Path, receipt_path: str | Path | None = None) -> dict[str, Any]:
    path = Path(path)
    case = json.loads(path.read_text(encoding="utf-8"))
    decision = close_case(case)
    out = Path(receipt_path) if receipt_path else path.with_suffix(path.suffix + ".gate_receipt.json")
    out.write_text(json.dumps(decision["receipt"], ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    decision["receipt_path"] = str(out)
    return decision


def accept_closure(case: dict[str, Any], receipt: dict[str, Any]) -> dict[str, Any]:
    """Única vía para aceptar un cierre persistido. Re-evalúa Gate + binding."""
    check = verify_receipt(case, receipt)
    if not check["authorized_closure"]:
        return {
            "accepted": False,
            "closed": False,
            "gate_status": "BLOCKED",
            "bypass_rejected": True,
            "reasons": check["reasons"],
            "verify": check,
        }
    assert_closure_authorized(case, receipt)
    return {
        "accepted": True,
        "closed": True,
        "gate_status": "AUTHORIZED",
        "bypass_rejected": False,
        "verify": check,
    }


def assert_no_alternate_close_api() -> None:
    forbidden = ["set_closed", "force_close", "mark_verde", "declare_verde"]
    for name in forbidden:
        if name in globals():
            raise GateBypassError(f"API prohibida presente: {name}")


assert_no_alternate_close_api()


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print("uso: gate_close.py <case.json> [--force-verde]", file=sys.stderr)
        return 2
    force = "--force-verde" in argv
    args = [a for a in argv[1:] if not a.startswith("--")]
    case = json.loads(Path(args[0]).read_text(encoding="utf-8"))
    decision = close_case(case, force_verde=force) if force else close_case_file(args[0])
    json.dump(decision, sys.stdout, ensure_ascii=False, indent=2)
    print()
    return 0 if decision["closed"] else 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
