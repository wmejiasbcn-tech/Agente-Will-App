# D1 — SISTEMA VISUAL + NAVEGACIÓN

> **DOCUMENTO HISTÓRICO — snapshot de D1.**
>
> Este documento conserva la evidencia de la ejecución original de D1. Los estados descritos a continuación no deben interpretarse automáticamente como estado actual de `main`. La sección **RECALIBRACIÓN HISTÓRICA** al final registra las correcciones necesarias para evitar efecto mariposa documental.

Rama histórica: `tuneado-interfaz-d1`  
Base histórica: `56e39fa` (`main` en el momento de D1)

## CAMBIOS REALIZADOS

1. **Blasón oficial** copiado a `public/blason-oficial-waipl.png`.
   - SHA256: `f9dafd5dff8a4bf52b3fcad7b82a650055a4f562df6514c530ae4191ddfd3eded`
   - Bytes idénticos al archivo entregado por William (origen = public = dist).
   - Inserción vía `OfficialBlason`: `<img>` transparente, sin caja, sombra, recorte ni etiqueta.
   - Escala de visualización 40px (header) y 20px (hilo). El archivo no se redimensiona ni se reencodea.
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
6. **Voz**: no tocada en el snapshot D1.
7. **API / prompts / datos**: no tocados.
8. **server.ts**: en el snapshot D1 se documentó `PORT` con default 3000.

## NO TOCADO

- Copy de pantallas, fichas, constitución, recursos
- Chemsex ≠ SLAM y detector de contexto
- `api/index.ts`
- Motor de voz
- `HarmReductionView` y `CanonicalArchitectureView` (huérfanas; reportadas)

## PRUEBAS HISTÓRICAS

| Prueba | Resultado en el snapshot D1 |
|---|---|
| `vite build` | OK (1688 módulos) |
| PNG público vs origen | SHA256 idéntico |
| Preview UI 8080 | HTTP 200 |
| `/blason-oficial-waipl.png` | HTTP 200 |
| Playwright 1280×800 | 4 áreas, blasón sin contenedor, SOS Escape, 0 errores de consola |
| Playwright 390×844 | composer visible, topics con scroll interno, blasón 40×40, 0 errores |
| Lienzo medido | `rgb(10, 10, 11)` = `#0A0A0B` |
| `img` blasón | background transparent, box-shadow none, border-radius 0 |

Las incidencias de arranque y tipado consignadas en la documentación original pertenecían a ese snapshot y no deben proyectarse sobre el `main` actual sin reproducción.

## AUDITORÍA D1 CONTRA EL BRIEF

| Criterio | Resultado histórico |
|---|---|
| Chapa y pintura, no reconstrucción | CUMPLE |
| Identidad extraída, no inventada | CUMPLE |
| Blasón oficial, copy-paste, sin IA | CUMPLE |
| Sin contenedor / sombra / etiqueta en el blasón | CUMPLE |
| Fondo `#0A0A0B` | CUMPLE |
| Navegación y Will al centro | CUMPLE |
| Contenido no reescrito | CUMPLE |
| Responsive 390 / 1280 | CUMPLE |
| Chrome a11y (nav, skip, dialog, foco) | CUMPLE |

## RESULTADO HISTÓRICO

**D1: VERDE** en el alcance de interfaz + navegación evaluado en aquel snapshot.

---

# RECALIBRACIÓN HISTÓRICA — ESTADO ACTUAL

Fecha de actualización: septiembre de 2026.  
HEAD actual de referencia: `d2cdcdcf17733d30c3353fa8d5d7617a354bab12`.

### Correcciones aplicadas a este documento

- La voz ya **no** debe describirse como `speechSynthesis`: el runtime actual utiliza **ElevenLabs**, voz `DrwFQsjvHFpLcKyvtbE3`, modelo `eleven_multilingual_v2`.
- El servidor Express de desarrollo actual utiliza `api/app.ts` y tiene **8080** como puerto por defecto; el `3000` de este documento queda identificado como dato histórico.
- El estado actual de Vercel y del runtime no se infiere de las pruebas históricas de D1.
- D1 no debe utilizarse como evidencia de que la arquitectura de voz, backend o pruebas actuales sean las del snapshot original.
- El dominio de **Prevención** es actualmente el séptimo dominio autónomo de Will; D1 solo conserva la fotografía de su momento.

### Estado actual relacionado

La documentación actual de referencia es `README.md`. Las pruebas históricas deben conservarse como evidencia histórica y las nuevas ejecuciones deben registrar el proveedor/modelo efectivos.

**Regla:** una prueba histórica puede demostrar lo que ocurrió en su fecha; no demuestra por sí sola lo que ocurre hoy.
