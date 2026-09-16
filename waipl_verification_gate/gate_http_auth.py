"""Auth + anti-replay for Will App Node → Python Gate Function."""
from __future__ import annotations

import hashlib
import hmac
import json
import os
import time
from typing import Any

MAX_BODY_BYTES = 256 * 1024
TIMESTAMP_SKEW_SEC = 300  # ±5 minutes


def _secret() -> str:
    return (os.environ.get("GATE_SHARED_SECRET") or "").strip()


def unauthorized(reason: str) -> dict[str, Any]:
    return {
        "error": "unauthorized",
        "reason": reason,
        "state": "AMARILLO",
        "closed": False,
        "open": True,
        "gate_status": "BLOCKED",
    }


def fail_closed(reason: str, **extra: Any) -> dict[str, Any]:
    body = {
        "state": "AMARILLO",
        "closed": False,
        "open": True,
        "gate_status": "BLOCKED",
        "result_status": "AUSENTE",
        "evidence_status": "INSUFICIENTE",
        "verification_status": "NO_VERIFICADO",
        "dictamen_status": "NO_CERRABLE",
        "mandatory_requirements_pending": [{"id": "_runtime", "estado": "DESCONOCIDO"}],
        "gate_ref": "gate:v1.0:fail-closed",
        "fail_closed_reason": reason,
    }
    body.update(extra)
    return body


def verify_request(headers: dict[str, str], raw_body: bytes) -> tuple[bool, str]:
    secret = _secret()
    if not secret:
        return False, "GATE_SHARED_SECRET missing"
    if len(raw_body) > MAX_BODY_BYTES:
        return False, "body too large"
    # header names case-insensitive
    h = {k.lower(): v for k, v in headers.items()}
    auth = h.get("authorization", "")
    if not auth.startswith("Bearer "):
        return False, "missing bearer"
    token = auth[7:].strip()
    if not hmac.compare_digest(token, secret):
        return False, "invalid bearer"

    ts_s = h.get("x-waipl-timestamp", "")
    sig = h.get("x-waipl-signature", "")
    if not ts_s or not sig:
        return False, "missing anti-replay headers"
    try:
        ts = int(ts_s)
    except ValueError:
        return False, "bad timestamp"
    now = int(time.time())
    if abs(now - ts) > TIMESTAMP_SKEW_SEC:
        return False, "timestamp skew"

    msg = f"{ts}.".encode("utf-8") + raw_body
    expect = hmac.new(secret.encode("utf-8"), msg, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(sig, expect):
        return False, "bad signature"
    return True, "ok"
