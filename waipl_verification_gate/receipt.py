#!/usr/bin/env python3
"""Receipt binding — impide reutilizar o forjar cierres sin Gate."""

from __future__ import annotations

import hashlib
import json
from typing import Any


def case_fingerprint(case: dict[str, Any]) -> str:
    """Huella canónica del case (ignora campos de estado inyectados)."""
    material = {
        "id": case.get("id"),
        "resultado": bool(case.get("resultado")),
        "evidencia": bool(case.get("evidencia")),
        "verificacion": bool(case.get("verificacion")),
        "dictamen": bool(case.get("dictamen")),
        "requisitos_obligatorios": case.get("requisitos_obligatorios") or [],
        "confirmed_failure": bool(case.get("confirmed_failure") or case.get("rojo")),
        "human_acceptance_required": bool(case.get("human_acceptance_required")),
        "human_acceptance": bool(case.get("human_acceptance")),
        "ambiguous_final_state": bool(case.get("ambiguous_final_state")),
        "result_ref": case.get("result_ref"),
        "evidence_refs": case.get("evidence_refs") or [],
        "dictamen_ref": case.get("dictamen_ref"),
    }
    blob = json.dumps(material, sort_keys=True, ensure_ascii=False, separators=(",", ":"))
    return hashlib.sha256(blob.encode("utf-8")).hexdigest()


def bind_receipt(final_state: dict[str, Any], case: dict[str, Any]) -> dict[str, Any]:
    fp = case_fingerprint(case)
    receipt = {
        "contract": "WAIPL_VERIFICATION_GATE_v1.0_FINAL_STATE_CONTRACT",
        "case_id": case.get("id"),
        "case_fingerprint": fp,
        "state": final_state["state"],
        "closed": final_state["closed"],
        "open": final_state["open"],
        "result_status": final_state["result_status"],
        "evidence_status": final_state["evidence_status"],
        "verification_status": final_state["verification_status"],
        "dictamen_status": final_state["dictamen_status"],
        "gate_status": final_state["gate_status"],
        "mandatory_requirements_pending": final_state["mandatory_requirements_pending"],
        "gate_ref": final_state["gate_ref"],
        "timestamp_utc": final_state.get("timestamp_utc"),
        "closure_entry_point": "gate_close.close_case",
    }
    # seal
    seal_body = {k: receipt[k] for k in receipt if k != "seal"}
    receipt["seal"] = hashlib.sha256(
        json.dumps(seal_body, sort_keys=True, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    ).hexdigest()
    return receipt


def verify_receipt(case: dict[str, Any], receipt: dict[str, Any]) -> dict[str, Any]:
    """
    Valida que el receipt corresponde a ESTE case y es coherente con un re-cierre Gate.
    Nunca autoriza closed=true si el Gate actual no autoriza.
    """
    from final_state import build_final_state  # local import avoids cycles at module load

    reasons: list[str] = []
    if not isinstance(receipt, dict):
        return {"valid": False, "authorized_closure": False, "reasons": ["receipt_not_object"]}

    fp = case_fingerprint(case)
    if receipt.get("case_id") != case.get("id"):
        reasons.append("case_id_mismatch")
    if receipt.get("case_fingerprint") != fp:
        reasons.append("case_fingerprint_mismatch")

    # seal check
    seal = receipt.get("seal")
    probe = {k: v for k, v in receipt.items() if k != "seal"}
    expect = hashlib.sha256(
        json.dumps(probe, sort_keys=True, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    ).hexdigest()
    if seal != expect:
        reasons.append("seal_invalid")

    # Re-run Gate — source of truth
    live = build_final_state(case)
    if receipt.get("closed") is True and live.get("closed") is not True:
        reasons.append("receipt_claims_closed_but_gate_blocks")
    if receipt.get("gate_status") == "AUTHORIZED" and live.get("gate_status") != "AUTHORIZED":
        reasons.append("receipt_claims_authorized_but_gate_blocks")
    if live.get("gate_status") == "BLOCKED" and receipt.get("closed") is True:
        reasons.append("blocked_gate_forbids_closed_receipt")

    valid = len(reasons) == 0
    authorized = valid and live.get("closed") is True and live.get("gate_status") == "AUTHORIZED"
    return {
        "valid": valid,
        "authorized_closure": authorized,
        "reasons": reasons,
        "live_gate_status": live.get("gate_status"),
        "live_closed": live.get("closed"),
    }


def assert_closure_authorized(case: dict[str, Any], receipt: dict[str, Any]) -> None:
    result = verify_receipt(case, receipt)
    if not result["authorized_closure"]:
        raise PermissionError(f"closure not authorized: {result['reasons']}")
