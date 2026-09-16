# Anti-replay Gate Will App v1 — decisión

**Decisión: INCORPORADO (obligatorio), no opcional.**

## Mecanismo
- `Authorization: Bearer $GATE_SHARED_SECRET`
- `X-WAIPL-Timestamp`: unix seconds
- `X-WAIPL-Signature`: hex HMAC-SHA256(secret, `"{timestamp}." || raw_body`)
- Ventana ±300s

## Por qué es necesario
Sin firma temporal, un capturador con el Bearer podría reenviar un body B (AUTHORIZED) fuera de contexto. El HMAC liga body+tiempo.

## Riesgo residual
Dentro de la ventana de 5 minutos, un replay exacto del mismo body+timestamp+sig sigue siendo posible (no hay store de nonces en serverless sin KV). Aceptado en v1; mitigación futura: nonce en Vercel KV/Upstash.
