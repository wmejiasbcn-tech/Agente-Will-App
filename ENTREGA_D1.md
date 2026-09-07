# D1 — SISTEMA VISUAL + NAVEGACIÓN

Rama: `tuneado-interfaz-d1`  
Base: `56e39fa` (`main`)

## CAMBIOS REALIZADOS

1. **Blasón oficial** copiado a `public/blason-oficial-waipl.png`.
   - SHA256: `f9dafd5ff8a4bf52b3fcad7b82a650055a4f562df6514c530ae4191ddfd3eded`
   - Bytes idénticos al archivo entregado por William (origen = public = dist).
   - Inserción vía `OfficialBlason`: `<img>` transparente, sin caja, sombra, recorte ni etiqueta.
   - Escala de *visualización* 40px (header) y 20px (hilo). El archivo no se redimensiona ni se reencodea.
   - Sustituye la W en recuadro ámbar. No se mete dentro de ese recuadro.
2. **Lienzo** `#0A0A0B` (`html`, `body`, shell, header, `theme-color`). Medido en runtime: `rgb(10, 10, 11)`.
3. **Tokens** extraídos en `src/index.css` (`@theme`): void, accent, sos, las 3 fuentes ya existentes. No hay paleta nueva.
4. **Navegación**
   - Will (blasón + nombre) es el centro; clic → chat.
   - «Hablar con Will» marcado como destino primario cuando está activo (ámbar).
   - `<nav aria-label>`, `aria-current="page"`.
   - Skip link «Saltar al contenido».
   - `<main id="contenido-principal">`.
   - Targets táctiles `min-h-11`.
   - Foco visible global (`:focus-visible`).
   - Etiquetas de las 4 áreas: sin reescritura.
   - Chat usa el alto restante del viewport (flex), no un `calc` frágil.
5. **SOS**: `role="dialog"`, Escape, clic en overlay, foco inicial, `aria-labelledby`. Copy intacto.
6. **Voz**: no tocada. Sigue `speechSynthesis` es-ES rate 1.0.
7. **API / prompts / datos**: no tocados.
8. **server.ts**: `PORT` lee `process.env.PORT` (default 3000).

## NO TOCADO

- Copy de pantallas, fichas, constitución, recursos
- Chemsex ≠ SLAM y detector de contexto
- `api/index.ts`
- Motor de voz
- `HarmReductionView` y `CanonicalArchitectureView` (huérfanas; reportadas)

## PRUEBAS

| Prueba | Resultado |
|---|---|
| `vite build` | OK (1688 módulos) |
| PNG público vs origen | SHA256 idéntico |
| Preview UI 8080 | HTTP 200 |
| `/blason-oficial-waipl.png` | HTTP 200 |
| Playwright 1280×800 | 4 áreas, blasón sin contenedor, SOS Escape, 0 errores de consola |
| Playwright 390×844 | composer visible, topics con scroll interno, blasón 40×40, 0 errores |
| Lienzo medido | `rgb(10, 10, 11)` = `#0A0A0B` |
| img blasón | background transparent, box-shadow none, border-radius 0 |
| `tsc --noEmit` | FALLA en `server.ts` **ya en `main`** (Vercel handler ≠ Express). No introducido por D1 |
| `npm run dev` (`tsx server.ts`) | FALLA ya en `main`: `app.use is not a function`. No tocado salvo `PORT` |

## AUDITORÍA D1 CONTRA EL BRIEF

| Criterio | Resultado |
|---|---|
| Chapa y pintura, no reconstrucción | CUMPLE |
| Identidad extraída, no inventada | CUMPLE |
| Blasón oficial, copy-paste, sin IA | CUMPLE |
| Sin contenedor / sombra / etiqueta en el blasón | CUMPLE |
| Fondo `#0A0A0B` | CUMPLE |
| 4 áreas conservadas, Will al centro | CUMPLE |
| Contenido no reescrito | CUMPLE |
| Voz no sustituida | CUMPLE |
| Backend no tocado | CUMPLE (salvo `PORT` env) |
| Responsive 390 / 1280 | CUMPLE |
| Chrome a11y (nav, skip, dialog, foco) | CUMPLE |

## RESULTADO

**D1: VERDE** (alcance interfaz + navegación).

Fuera de D1, **NO VERDE** el arranque `npm run dev` de `main` (server.ts vs export de Vercel). No se ha “arreglado” porque no es D1 y no está en el perímetro de interfaz. Se eleva.

Siguiente: D2, cuando se autorice el merge o se pida continuar en esta rama.
