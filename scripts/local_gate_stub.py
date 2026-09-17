#!/usr/bin/env python3
"""Minimal local Python Gate HTTP stub for S2S bridge tests (not for production)."""
from __future__ import annotations

import json
import os
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GATE = ROOT / "waipl_verification_gate"
sys.path.insert(0, str(GATE))

from gate_http_auth import fail_closed, unauthorized, verify_request  # noqa: E402
from will_app_adapter import close_will_cycle  # noqa: E402
from receipt import verify_receipt  # noqa: E402
from will_app_adapter import will_cycle_to_case  # noqa: E402


class Handler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):  # noqa: A003
        return

    def _read(self) -> bytes:
        n = int(self.headers.get("Content-Length") or 0)
        return self.rfile.read(n) if n else b"{}"

    def _send(self, code: int, obj: dict):
        raw = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)

    def do_POST(self):  # noqa: N802
        raw = self._read()
        headers = {k: v for k, v in self.headers.items()}
        ok, reason = verify_request(headers, raw)
        if not ok:
            self._send(401, unauthorized(reason))
            return
        try:
            body = json.loads(raw.decode("utf-8"))
            if not isinstance(body, dict):
                self._send(400, fail_closed("body must be object"))
                return
            path = self.path.split("?", 1)[0].rstrip("/")
            if path.endswith("/verify") or path.endswith("/api/gate/verify"):
                cycle = body.get("cycle") or body.get("case")
                receipt = body.get("receipt")
                if cycle is None or receipt is None:
                    self._send(400, fail_closed("cycle and receipt required"))
                    return
                check = verify_receipt(will_cycle_to_case(cycle), receipt)
                out = {
                    "accepted": bool(check.get("valid") and check.get("authorized_closure")),
                    "closed": bool(check.get("authorized_closure")),
                    "gate_status": "AUTHORIZED" if check.get("authorized_closure") else "BLOCKED",
                    "bypass_rejected": False,
                    "verify": check,
                }
                self._send(200, out)
                return
            # close
            out = close_will_cycle(body)
            self._send(200, out)
        except Exception as e:  # noqa: BLE001
            self._send(500, fail_closed(f"gate_error:{e}"))


def main():
    if not (os.environ.get("GATE_SHARED_SECRET") or "").strip():
        raise SystemExit("GATE_SHARED_SECRET required")
    host = os.environ.get("GATE_STUB_HOST", "127.0.0.1")
    port = int(os.environ.get("GATE_STUB_PORT", "8765"))
    httpd = ThreadingHTTPServer((host, port), Handler)
    print(f"GATE_STUB {host}:{port}", flush=True)
    httpd.serve_forever()


if __name__ == "__main__":
    main()
