#!/usr/bin/env python3
"""Mandatory Final-State Contract builder — WAIPL Verification Gate v1.0."""

from __future__ import annotations

import hashlib
import json
from datetime import datetime, timezone
from typing import Any

from gate_evaluate import evaluate

REQUIRED_FIELDS = (
    "state",
    "closed",
    "open",
    "result_status",
    "evidence_status",
    "verification_status",
    "dictamen_status",
    "gate_status",
    "mandatory_requirements_pending",
    "gate_ref",
)


def build_final_state(case: dict[str, Any], *, bypass_attempt: dict[str, Any] | None = None) -> dict[str, Any]:
    """
    Única construcción autorizada del objeto de estado final.
    Ignora force/inyecciones: gobierna evaluate + invariante CLOSED.
    """
    ev = evaluate(case)

    # Caller-injected closed/state MUST NOT win
    _ = case.get("closed"), case.get("state"), case.get("CLOSED"), case.get("semaforo")

    if ev.get("ambiguous"):
        state = "AMARILLO"
        closed = False
        gate_status = "BLOCKED"
        result_status = "AUSENTE"
        evidence_status = "INSUFICIENTE"
        verification_status = "DESCONOCIDO"
        dictamen_status = "NO_CERRABLE"
        pending = ev["pending_mandatory"]
    else:
        result_status = "PRESENTE" if ev["pieces"]["resultado"] else "AUSENTE"
        evidence_status = "SUFICIENTE" if ev["pieces"]["evidencia"] else "INSUFICIENTE"
        dictamen_status = "CERRABLE" if ev["pieces"]["dictamen"] else "NO_CERRABLE"
        pending = list(ev["pending_mandatory"])
        verification_status = ev["verification_status"]

        if not ev["pieces"]["verificacion"]:
            verification_status = "NO_VERIFICADO"
            if not any(p.get("id") == "verificacion_pieza" for p in pending):
                pending.append({"id": "verificacion_pieza", "estado": "NO_VERIFICADO"})

        predicates_pass = (
            result_status == "PRESENTE"
            and evidence_status == "SUFICIENTE"
            and verification_status == "CONFORME"
            and dictamen_status == "CERRABLE"
            and len(pending) == 0
        )

        if ev.get("confirmed_failure"):
            state = "ROJO"
            closed = False
            gate_status = "BLOCKED"
        elif predicates_pass:
            state = "VERDE"
            closed = True
            gate_status = "AUTHORIZED"
        else:
            state = "AMARILLO"
            closed = False
            gate_status = "BLOCKED"

    # CLOSED invariant enforcement (fail-safe)
    if closed:
        if not (
            result_status == "PRESENTE"
            and evidence_status == "SUFICIENTE"
            and verification_status == "CONFORME"
            and dictamen_status == "CERRABLE"
            and pending == []
            and gate_status == "AUTHORIZED"
        ):
            state = "AMARILLO"
            closed = False
            gate_status = "BLOCKED"

    if state in ("AMARILLO", "ROJO") and closed:
        closed = False
        gate_status = "BLOCKED"

    if bypass_attempt and not closed:
        bypass_attempt = {**bypass_attempt, "blocked": True, "reason": "Gate no autoriza CLOSED=true"}

    open_flag = not closed
    if gate_status == "BLOCKED":
        closed = False
        open_flag = True

    body = {
        "state": state,
        "closed": closed,
        "open": open_flag,
        "result_status": result_status if not ev.get("ambiguous") else "AUSENTE",
        "evidence_status": evidence_status if not ev.get("ambiguous") else "INSUFICIENTE",
        "verification_status": verification_status if not ev.get("ambiguous") else "DESCONOCIDO",
        "dictamen_status": dictamen_status if not ev.get("ambiguous") else "NO_CERRABLE",
        "gate_status": gate_status,
        "mandatory_requirements_pending": pending,
        "gate_ref": "",  # filled below
        "case_id": case.get("id"),
        "contract": "WAIPL_VERIFICATION_GATE_v1.0_FINAL_STATE_CONTRACT",
        "closure_entry_point": "gate_close.close_case",
        "trace": {
            "result_ref": case.get("result_ref"),
            "evidence_refs": case.get("evidence_refs") or [],
            "dictamen_ref": case.get("dictamen_ref"),
            "evaluation": {
                "pieces": ev.get("pieces"),
                "pending": pending,
            },
        },
        "timestamp_utc": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "jurisdicciones": {
            "Var": "verdad / auditoría de agentes-resultados-fuentes",
            "Yata": "auditoría de validadores (no de agentes)",
            "Gate": "gobernanza de cierre / estado final",
        },
    }
    if bypass_attempt:
        body["bypass_attempt"] = bypass_attempt

    digest = hashlib.sha256(
        json.dumps({k: body[k] for k in REQUIRED_FIELDS if k != "gate_ref"}, sort_keys=True, ensure_ascii=False).encode(
            "utf-8"
        )
    ).hexdigest()
    body["gate_ref"] = f"gate:v1.0:{digest[:16]}"

    for f in REQUIRED_FIELDS:
        if f not in body:
            raise RuntimeError(f"final-state missing required field: {f}")

    # Machine invariant
    if body["closed"] is True:
        assert body["gate_status"] == "AUTHORIZED"
        assert body["state"] == "VERDE"
        assert body["open"] is False
        assert body["mandatory_requirements_pending"] == []
    if body["gate_status"] == "BLOCKED":
        assert body["closed"] is False

    return body
