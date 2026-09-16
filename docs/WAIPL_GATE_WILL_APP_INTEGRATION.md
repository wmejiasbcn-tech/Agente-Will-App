# Integración mínima — WAIPL Verification Gate v1.0 en Will App

## Punto exacto de integración

**Superficie existente:** `POST /api/audit` (`api/app.ts`) ← `AuditorView` → `AuditResult`
(`resultado` verificable de auditoría constitucional / no directividad).

**Consumo Gate (nuevo, mínimo):**
1. Python: `waipl_verification_gate/will_app_adapter.py` → `gate_close.close_case` (SENTINEL).
2. HTTP opcional: `api/verificationGate.ts` (bridge; requiere Python en el host).

No se modifica la UI de `AuditorView` en este entregable.

## Adaptador

`will_app_adapter.will_cycle_to_case` + `close_will_cycle` — **solo mapeo**; la autoridad de cierre sigue en el Gate vendored desde SENTINEL `@f877f2e`.

## Pruebas

```bash
cd waipl_verification_gate
python3 -m unittest test_will_app_integration.py -v
```

- A `WILL_AUDIT_A_INCOMPLETO` → AMARILLO / CLOSED=false  
- B `WILL_AUDIT_B_COMPLETO` → VERDE / CLOSED=true + receipt válido  

## Conflictos / límites

- Will App es TypeScript/Vercel; el Gate es Python → el bridge Node usa subprocess.
- En serverless sin Python, el endpoint HTTP no podrá ejecutar el Gate (los tests Python siguen siendo la acreditación de cierre).
- No se altera Vár/Yata.
