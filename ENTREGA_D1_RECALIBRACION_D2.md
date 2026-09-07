# D1 RECALIBRACIÓN + D2 — ESPACIO, 7 DOMINIOS, RRDD, KNOWLEDGE LAYER

Rama: `tuneado-interfaz-d1`  
Base D1: `e34c976`  
PR: no merge.

Orden: ORDEN SOBERANA DE RECALIBRACIÓN Y CONTINUIDAD. Autonomía de implementación. Sin autonomía conceptual.

## CAMBIOS

### D1 — recalibración (no redo)
1. Principio incorporado: «Tecnología del futuro habitando un espacio humano.»
2. Paleta: negro `#0A0A0B`, petróleo `#0c141c`, ámbar `#e8c37a` como LUZ, blanco cálido `#f4efe6`, vidrio.
3. Chat: espacio + presencia + conversación. El blasón oficial flota sobre un resplandor. Copy de bienvenida intacto.
4. Navegación: ámbar no rellena botones. Activo = vidrio + luz (`rgba(232,195,122,0.1)` / `rgb(232,195,122)`).
5. Blasón: mismo PNG, copy-paste, sin contenedor. Medido: fondo transparente, box-shadow none, radius 0.
6. Voz: no sustituida. Sigue `speechSynthesis` es-ES rate 1.0.

### D2 — arquitectura
7. Dominio 07 Prevención: autónomo, visual y estructural. 0 fichas. Empty state → «Este dominio no tiene fichas. No se ha inventado contenido. Pregunta a Will.»
8. Detector: prevención solo con lenguaje explícito (`prevención`, `prevenir`, `preventivo`). Prioridad SLAM → Chemsex → Prevención → Salud sexual. `preservativo` no activa Prevención.
9. RRDD: overlay `RRDD SEXUAL | RRDD SUSTANCIAS`. No fusiona. Chemsex ≠ SLAM.
10. Knowledge Layer documentado en Cómo funciona Will. No se finge un RAG en ejecución.
11. Kairos / Dike / procedencia / VERIFICADO·INFERIDO·DESCONOCIDO: texto de la orden.
12. `api/index.ts`: apéndice dominio 7 + línea de diferenciación. No se reescribe el prompt.

## NO TOCADO
- Copy existente de fichas, constitución, recursos, bienvenida
- Motor de voz
- Recreación del blasón
- Merge a `main`
- Fichas de Prevención (no existen; no se inventan)
- Identidad sonora ejecutada (queda vigente, no sustituida)

## PRUEBAS

| Prueba | Resultado |
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
| Welcome copy | «Hola. Soy Will.» intacto |

## AUDITORÍA CONTRA LA ORDEN

| Criterio | Resultado |
|---|---|
| No rehacer D1 desde cero | CUMPLE |
| Tecnología del futuro habitando un espacio humano | CUMPLE |
| No cyberpunk / no HUD / no dashboard | CUMPLE |
| Chat no es avatar+burbujas genérico | CUMPLE (presencia + espacio + vidrio) |
| Ámbar como luz | CUMPLE |
| 7 dominios, Prevención autónoma | CUMPLE |
| sexo ≠ prevención automática | CUMPLE (detector) |
| RRDD sexual ≠ RRDD sustancias | CUMPLE |
| Chemsex ≠ SLAM | CUMPLE |
| RAG no decisor | CUMPLE (documentado, no ejecutado) |
| Kairos ≠ Dike | CUMPLE |
| Voz no sustituida | CUMPLE |
| Blasón no recreado | CUMPLE |
| Sin fichas inventadas | CUMPLE |

## RESULTADO

**D1 recalibrado + D2: VERDE** en el perímetro de esta orden.

Fuera de perímetro, **NO VERDE** el arranque `npm run dev` de `main` (server.ts vs export de Vercel). No se ha “arreglado”.

No merge.
