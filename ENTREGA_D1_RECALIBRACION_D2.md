# D1 RECALIBRACIÓN + D2 — ESPACIO, 7 DOMINIOS, RRDD, KNOWLEDGE LAYER

> **DOCUMENTO HISTÓRICO — snapshot de D1/D2.** Este documento conserva qué se decidió y qué se verificó en aquella ejecución. El estado de `main` evolucionó después. La sección **RECALIBRACIÓN POSTERIOR** evita que hechos históricos se propaguen como estado actual.

Rama histórica: `tuneado-interfaz-d1`  
Base D1 histórica: `e34c976`  
PR histórico: no merge.

Orden: ORDEN SOBERANA DE RECALIBRACIÓN Y CONTINUIDAD. Autonomía de implementación. Sin autonomía conceptual.

## CAMBIOS

### D1 — recalibración (no redo)
1. Principio incorporado: «Tecnología del futuro habitando un espacio humano.»
2. Paleta: negro `#0A0A0B`, petróleo `#0c141c`, ámbar `#e8c37a` como LUZ, blanco cálido `#f4efe6`, vidrio.
3. Chat: espacio + presencia + conversación. El blasón oficial flota sobre un resplandor. Copy de bienvenida intacto.
4. Navegación: ámbar no rellena botones. Activo = vidrio + luz (`rgba(232,195,122,0.1)` / `rgb(232,195,122)`).
5. Blasón: mismo PNG, copy-paste, sin contenedor. Medido: fondo transparente, box-shadow none, radius 0.
6. Voz: no sustituida **en el snapshot de esta entrega**.

### D2 — arquitectura
7. Dominio 07 Prevención: autónomo, visual y estructural. 0 fichas. Empty state → «Este dominio no tiene fichas. No se ha inventado contenido. Pregunta a Will.»
8. Detector: prevención solo con lenguaje explícito (`prevención`, `prevenir`, `preventivo`). Prioridad SLAM → Chemsex → Prevención → Salud sexual. `preservativo` no activa Prevención.
9. RRDD: overlay `RRDD SEXUAL | RRDD SUSTANCIAS`. No fusiona. Chemsex ≠ SLAM.
10. Knowledge Layer documentado en Cómo funciona Will. No se finge un RAG en ejecución.
11. Kairos / Dike / procedencia / VERIFICADO·INFERIDO·DESCONOCIDO: texto de la orden.
12. `api/index.ts`: apéndice dominio 7 + línea de diferenciación. No se reescribe el prompt.

## NO TOCADO

- Copy existente de fichas, constitución, recursos, bienvenida
- Motor de voz en el alcance D1/D2 histórico
- Recreación del blasón
- Merge a `main`
- Fichas de Prevención (no existen; no se inventan)

## PRUEBAS HISTÓRICAS

| Prueba | Resultado en el snapshot |
|---|---|
| `vite build` | OK (1689 módulos) |
| Detector: `prevención de ITS` | prevencion |
| Detector: `preservativo` | salud-sexual (no prevencion) |
| Detector: `sexo oral` | salud-sexual |
| Detector: `prevención y slam` | slam |
| Detector: `chemsex con mefedrona` | chemsex |
| Playwright 1280×800 | 7 pestañas, puerta Prevención, RRDD SEXUAL + SUSTANCIAS, Knowledge Layer, SOS Escape, 0 errores de consola |
| Playwright 390×844 | composer visible, 7 áreas, empty state Prevención, 0 errores |
| Lienzo | `rgb(10, 10, 11)` = `#0A0A0B` |
| Nav activa | fondo `rgba(232, 195, 122, 0.1)`, texto `rgb(232, 195, 122)` — no `bg-amber-500` |
| img blasón | background transparent, box-shadow none, border-radius 0 |
| Welcome copy | snapshot de aquella ejecución |

## AUDITORÍA CONTRA LA ORDEN — HISTÓRICA

| Criterio | Resultado |
|---|---|
| No rehacer D1 desde cero | CUMPLE |
| Tecnología del futuro habitando un espacio humano | CUMPLE |
| No cyberpunk / no HUD / no dashboard | CUMPLE |
| Chat no es avatar+burbujas genérico | CUMPLE |
| Ámbar como luz | CUMPLE |
| 7 dominios, Prevención autónoma | CUMPLE |
| sexo ≠ prevención automática | CUMPLE |
| RRDD sexual ≠ RRDD sustancias | CUMPLE |
| Chemsex ≠ SLAM | CUMPLE |
| Knowledge Layer no fingido como RAG ejecutado | CUMPLE |
| Kairos ≠ Dike | CUMPLE |
| Sin fichas inventadas | CUMPLE |

## RESULTADO HISTÓRICO

**D1 recalibrado + D2: VERDE** en el perímetro de aquella orden y en el snapshot auditado.

---

# RECALIBRACIÓN POSTERIOR — ESTADO ACTUAL

Fecha: septiembre de 2026.  
HEAD actual de referencia: `d2cdcdcf17733d30c3353fa8d5d7617a354bab12`.

### Correcciones documentales

- La afirmación histórica sobre `speechSynthesis` no representa el runtime actual. La voz actual es **ElevenLabs**, voz `DrwFQsjvHFpLcKyvtbE3`, modelo `eleven_multilingual_v2`.
- El servidor Express actual (`server.ts` → `api/app.ts`) utiliza **8080** por defecto. Cualquier referencia a 3000 en documentación o runners anteriores es histórica/obsoleta.
- La aplicación actual conserva **7 dominios**, incluido Prevención autónoma.
- La arquitectura de Knowledge Layer documentada aquí no debe interpretarse como RAG ejecutándose en este repositorio.
- El estado actual de despliegue y comportamiento debe verificarse contra `main`; las pruebas de esta entrega son evidencia del snapshot correspondiente.
- La regla universal de entrada queda canonizada: **NO ELEGIR POR LA PERSONA LO QUE LA PERSONA TODAVÍA NO HA ELEGIDO.**

### Incidencias posteriores que no deben confundirse con D1/D2

La revisión posterior identificó, entre otras, ambigüedad del proveedor Gemini/xAI, runners con puerto obsoleto y una expectativa Kokoro residual en `tests/browser-perf.test.ts`. Estas discrepancias ya se han corregido documentalmente o en el código de pruebas cuando correspondía.

### Regla de trazabilidad

> **Un snapshot histórico demuestra el estado de ese snapshot. No certifica el estado actual.**
