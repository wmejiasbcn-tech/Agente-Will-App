from http.server import BaseHTTPRequestHandler
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
GATE = ROOT / "waipl_verification_gate"
sys.path.insert(0, str(GATE))

from gate_http_auth import fail_closed, unauthorized, verify_request  # noqa: E402
from will_app_adapter import close_will_cycle  # noqa: E402


class handler(BaseHTTPRequestHandler):
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
            cycle = json.loads(raw.decode("utf-8"))
            if not isinstance(cycle, dict):
                self._send(400, fail_closed("body must be object"))
                return
            out = close_will_cycle(cycle)
            self._send(200, out)
        except Exception as e:  # noqa: BLE001
            self._send(500, fail_closed(f"gate_error:{e}"))

    def do_OPTIONS(self):  # noqa: N802
        self.send_response(204)
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
