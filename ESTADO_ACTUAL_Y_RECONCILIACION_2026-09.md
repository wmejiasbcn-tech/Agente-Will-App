# ESTADO ACTUAL Y RECONCILIACIÓN DOCUMENTAL — WILL APP

**Fecha:** septiembre de 2026  
**Repositorio:** `wmejiasbcn-tech/Agente-Will-App`  
**HEAD de referencia:** `d2cdcdcf17733d30c3353fa8d5d7617a354bab12`

## Propósito

Este documento evita la contaminación entre snapshots históricos y estado actual. No sustituye las evidencias históricas: las contextualiza.

## Estado consolidado

| Elemento | Estado actual conocido | Tratamiento |
|---|---|---|
| HEAD `d2cdcdc` | Verificado | Referencia actual |
| Vercel asociado | SUCCESS | Despliegue completado; no equivale por sí solo a prueba funcional exhaustiva |
| Voz TTS | ElevenLabs / `DrwFQsjvHFpLcKyvtbE3` / `eleven_multilingual_v2` | Actual |
| `speechSynthesis` en producción | No | Solo referencias históricas/pruebas negativas |
| Kokoro en producción | No | `kokoro-js` no está en `package.json`; expectativa residual de prueba corregida |
| Conversación | Gemini con `GEMINI_API_KEY`; fallback xAI/Grok | Actual |
| `XAI_API_KEY` documentada | Sí | `.env.example` actualizado |
| Dev server | `server.ts` → `api/app.ts`, puerto 8080 por defecto | Actual |
| Vercel serverless | `api/index.ts` | Actual |
| Dominios | 7, con Prevención autónoma | Actual |
| Entrada | Protocolo de no presunción | Canon de producto |
| RAG/Graphify ejecutándose en este repo | No | Estado conocido, no defecto |
| CI | Typecheck + build | Añadido |
| Runner batería | `WILL_URL`, default `http://localhost:8080` | Corregido |

## Correcciones realizadas en esta reconciliación

1. `README.md`: actualizado de 6 a 7 dominios y reconciliado con voz, proveedor, puerto, entrada y estado actual.
2. `ENTREGA_D1.md`: marcado como snapshot histórico; corregidas las afirmaciones que podían leerse como estado actual.
3. `ENTREGA_D1_RECALIBRACION_D2.md`: marcado como snapshot histórico; añadida reconciliación posterior.
4. `AUDITORIA_INTERFAZ_2026-09-07.md`: marcado como auditoría histórica; sus hallazgos previos a D1 no se presentan como defectos actuales.
5. `.env.example`: documentado `XAI_API_KEY` como fallback de conversación y configuración de STT.
6. `tests/browser-perf.test.ts`: eliminada la expectativa obsoleta de proveedor `Kokoro`; ahora verifica ElevenLabs y su configuración canónica.
7. `run_tests.mjs`: eliminado el puerto fijo `3000`, añadido `WILL_URL` y actualizado el snapshot de bienvenida al texto actual.
8. `run_full_battery.mjs`: mismo ajuste de endpoint y snapshot actual.
9. `package.json`: corregido el nombre de paquete residual `react-example` → `will-app` y expuestos los runners de batería como scripts npm.
10. `.github/workflows/ci.yml`: incorporada validación automática de typecheck y build en `main` y pull requests.

## Hallazgos que siguen abiertos y no se deben falsear como resueltos

### H-WILL-01 — conducta histórica de apertura

Estado: **PENDIENTE DE REPRODUCCIÓN ACTUAL**.

La evidencia histórica puede ser real sin demostrar que el comportamiento siga presente en `main`.

### H-WILL-02 — E/J

Estado: **ABIERTO**.

La discrepancia de puerto del harness era real y ya está corregida. Eso no demuestra todavía la causa funcional de los resultados E/J.

### H-WILL-03 — modelos Gemini

Estado: **CERRADO** como discrepancia de modelos inválidos. La existencia/validez de los modelos debe considerarse separada de la configuración efectiva del entorno.

### H-WILL-04 — proveedor efectivo

Estado: **REFORMULADO / ABIERTO COMO REPRODUCIBILIDAD**.

Gemini y xAI son rutas posibles. Las pruebas deben registrar proveedor y modelo efectivos.

### H-WILL-05 — higiene de proyecto

Estado: **PARCIALMENTE CORREGIDO**. El nombre residual del paquete ya se corrigió; pueden existir otras piezas de higiene que requieran revisión futura.

### H-WILL-06 — vistas no montadas

Estado: **CONOCIDO / NO INCIDENTE**. Se mantienen como deuda de producto/documentación mientras su no montaje sea intencional.

### H-WILL-07 — ausencia de RAG/Graphify ejecutable

Estado: **ESPERADO**. Este repositorio no debe fingir que esa capa está operativa.

### H-WILL-08 — mojibake

Estado: **NO CONFIRMADO ACTUALMENTE**.

### H-WILL-09 — CI

Estado: **CORREGIDO PARCIALMENTE** mediante workflow de typecheck + build. No se afirma que toda la batería funcional esté automatizada.

### H-WILL-10 — despliegue

Estado: **DEPLOYMENT VERIFIED** por estado SUCCESS del despliegue asociado a `d2cdcdc`. El comportamiento live completo requiere pruebas funcionales independientes.

### H-WILL-11 — Kokoro

Estado: **CORREGIDO EN PRODUCCIÓN Y QA CONOCIDO**. No hay dependencia `kokoro-js` en `package.json`; la expectativa residual del benchmark de rendimiento fue corregida.

### H-WILL-12 — welcome desincronizado

Estado: **CORREGIDO EN RUNNERS**. La batería ya refleja el welcome actual.

### H-WILL-13 — puerto 3000/8080

Estado: **CORREGIDO EN RUNNERS**. Los runners aceptan `WILL_URL` y usan 8080 por defecto.

### H-WILL-14 — Playwright opcional

Estado: **DEUDA DE QA**. La prueba reconoce explícitamente la ausencia de Playwright como no verificada.

### H-WILL-15 — documentación `speechSynthesis`

Estado: **CORREGIDO EN DOCUMENTACIÓN HISTÓRICA PRINCIPAL**. Las menciones restantes deben entenderse como evidencia histórica o aserciones negativas de tests.

### H-WILL-16 — runners sin scripts npm

Estado: **CORREGIDO**.

### H-WILL-17 — XAI ausente de `.env.example`

Estado: **CORREGIDO**.

### H-WILL-18 — Auditor Constitucional dependiente de LLM

Estado: **OBSERVACIÓN ARQUITECTÓNICA ABIERTA**. No se trata como bug automático; requiere decisión de arquitectura si se quiere un gate determinista adicional.

### H-WILL-19 — evidencia histórica de contenido procedimental SLAM

Estado: **P0 POTENCIAL / PENDIENTE DE REPRODUCCIÓN ACTUAL**.

Debe probarse en `main` actual. Si se reproduce una instrucción operativa que contradice la regla constitucional vigente, requiere corrección inmediata.

### H-WILL-20 — README 6 vs 7 dominios

Estado: **CORREGIDO**.

### H-WILL-21 — D1/D2 stale

Estado: **CORREGIDO** mediante marcación histórica y reconciliación.

## Próxima verificación funcional obligatoria

Sobre el `main` actual, no sobre baterías históricas:

1. **E** — apertura ambigua.
2. **G** — dependencia/validación.
3. **C** — SLAM con petición de información sobre venas/asepsia, comprobando ausencia de instrucciones operativas.
4. **J** — tres turnos.

Cada ejecución debe registrar:

- commit/HEAD;
- fecha y hora;
- entorno;
- `WILL_URL`;
- proveedor efectivo;
- modelo efectivo;
- HTTP status;
- duración;
- respuesta íntegra;
- error, si existe.

## Regla final de trazabilidad

> **Histórico no significa falso. Actual no significa supuesto.**
>
> Un registro histórico conserva lo que ocurrió. Una verificación actual demuestra lo que ocurre ahora. Ninguno sustituye al otro.
