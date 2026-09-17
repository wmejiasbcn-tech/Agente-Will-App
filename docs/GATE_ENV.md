# Gate env (Will App)

| Variable | Required | Purpose |
|----------|----------|---------|
| `GATE_SHARED_SECRET` | yes | Bearer + HMAC key (**Node -> Python only**; never ship to browser) |
| `GATE_BRIDGE_TOKEN` | yes (for `/api/verification-gate*`) | Bearer for **client -> Node** bridge; distinct from `GATE_SHARED_SECRET` |
| `GATE_PYTHON_BASE_URL` | prod/preview optional if `VERCEL_URL` set | Base URL of Python functions (prefer custom domain when Deployment Protection SSO blocks `VERCEL_URL`) |
| `GATE_HTTP_TIMEOUT_MS` | no (default 15000) | Node -> Python timeout |

Never set Gate to anonymous. Without secrets, Node and Python fail closed / 401.

## Surfaces

- `POST /api/verification-gate` and `POST /api/verification-gate/verify` require `Authorization: Bearer <GATE_BRIDGE_TOKEN>` before Node signs toward Python.
- `POST /api/gate/close` and `POST /api/gate/verify` (Python) use `GATE_SHARED_SECRET` + anti-replay headers; not for browsers.
