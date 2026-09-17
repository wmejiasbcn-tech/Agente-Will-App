# Gate env (Will App)

| Variable | Required | Purpose |
|----------|----------|---------|
| `GATE_SHARED_SECRET` | yes | Bearer + HMAC key (**Node → Python only**; never ship to browser) |
| `GATE_BRIDGE_TOKEN` | yes (for `/api/verification-gate*`) | Bearer for **client → Node** bridge; distinct from `GATE_SHARED_SECRET` |
| `GATE_PYTHON_BASE_URL` | prod/preview optional if `VERCEL_URL` set | Base URL of Python functions (prefer custom domain when Deployment Protection SSO blocks `VERCEL_URL`) |
| `GATE_HTTP_TIMEOUT_MS` | no (default 15000) | Node → Python timeout |

Never set Gate to anonymous. Without secrets, Node and Python fail closed / 401.

## Surfaces

- `POST /api/verification-gate` and `POST /api/verification-gate/verify` require `Authorization: Bearer <GATE_BRIDGE_TOKEN>` before Node signs toward Python.
- `POST /api/gate/close` and `POST /api/gate/verify` (Python) use `GATE_SHARED_SECRET` + anti-replay headers; not for browsers.

## Contrato GATE_BRIDGE_TOKEN (server-to-server)

`GATE_BRIDGE_TOKEN` es una credencial **client → Node** de uso **EXCLUSIVAMENTE SERVER-TO-SERVER**.

Prohibido:

- `VITE_*` / cualquier prefijo expuesto al bundle frontend
- browser / HTML / JS público
- `localStorage` / `sessionStorage`
- valor en repositorio, commits, chat o respuestas HTTP
- uso como credencial de usuario final

Permitido:

- variable de entorno server-side del **caller** (hoy: SENTINEL)
- variable de entorno server-side en Vercel (Production/Preview) para el Node bridge

Flujo acreditado:

```text
SENTINEL (plano de control / auditoría / acreditación técnica)
        ↓  Authorization: Bearer GATE_BRIDGE_TOKEN
NODE bridge  (/api/verification-gate | /verify)
        ↓  GATE_SHARED_SECRET + HMAC (solo server-side)
HTTPS
        ↓
PYTHON Gate  (/api/gate/close | /verify)
        ↓
WAIPL Verification Gate v1.0 (pin f877f2e)
```

Caller S2S actual: **SENTINEL**, exclusivamente para control/auditoría/acreditación técnica.
El producto (Will App UI) **no** depende actualmente de este caller para su flujo de usuario.

## Jurisdicción SENTINEL respecto al bridge

SENTINEL **puede**:

- invocar el bridge con `GATE_BRIDGE_TOKEN`
- ejecutar smokes T-A/B/R/F/X
- capturar evidencia
- comprobar procedencia Node → Python → Gate
- verificar receipts
- emitir dictamen

SENTINEL **NO puede**:

- convertir por sí mismo un estado en `CLOSED=true`
- autorizar cierres fuera del WAIPL Verification Gate
- modificar la autoridad del Gate
- convertir `GATE_BRIDGE_TOKEN` en credencial de usuario
- sustituir a Vár ni a Yata
- formar parte del runtime funcional de Will App

La autoridad de cierre sigue perteneciendo al **WAIPL Verification Gate** conforme a sus reglas (`gate_close` / Final-State Contract / receipt).
