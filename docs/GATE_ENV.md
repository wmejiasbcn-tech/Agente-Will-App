# Gate env (Will App)

| Variable | Required | Purpose |
|----------|----------|---------|
| `GATE_SHARED_SECRET` | yes | Bearer + HMAC key (Node ↔ Python) |
| `GATE_PYTHON_BASE_URL` | prod/preview optional if `VERCEL_URL` set | Base URL of Python functions |
| `GATE_HTTP_TIMEOUT_MS` | no (default 15000) | Node → Python timeout |

Never set Gate to anonymous. Without secret, Node and Python fail closed / 401.
