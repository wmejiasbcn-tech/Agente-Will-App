# AUDITORÍA REAL DE INTERFAZ — WILL APP

**Repositorio:** `wmejiasbcn-tech/Agente-Will-App`  
**Commit auditado:** `56e39fa9153f586c403aebfe5206bfa98eb8313a` (`main`, 2026-09-06)  
**Auditor:** Aether  
**Alcance:** interfaz existente. Cero modificación de backend, prompts o contenido en este documento.  
**Método:** inspección del árbol, lectura de componentes y datos, búsqueda de voz/blasón/a11y.

---

## 1. Estructura actual

Aplicación Vite + React 19 + Tailwind v4 + Express.

| Ruta | Función |
|---|---|
| `src/App.tsx` | Shell: tab activa + modal SOS |
| `src/main.tsx` | Mount React |
| `src/index.css` | Tailwind + 3 familias tipográficas |
| `src/components/*` | UI |
| `src/data/*` | Contenido canónico (no tocado) |
| `src/utils/contextDetector.ts` | Detección de dominio en chat |
| `api/index.ts` | `/api/chat`, `/api/audit`, `/api/explore-topic` (Gemini) |
| `server.ts` | Dev server en puerto **3000** |
| `public/` | Vacío en `main` (sin assets gráficos) |

Navegación por estado React (`activeTab`), no por router. No hay React Router.

---

## 2. Pantallas existentes (4 áreas públicas)

Definidas en `App.tsx`. Default: `chat`.

| Tab id | Componente | Título visible |
|---|---|---|
| `chat` | `WillChat` | Hablar con Will |
| `topics` | `ExploreTopicsView` | Explorar Áreas y Temas |
| `resources` | `ResourcesView` | Recursos de Apoyo y Servicios |
| `how-it-works` | `HowWillWorksView` | Cómo Funciona Will |

`HowWillWorksView` contiene subsecciones: Principios, Constitución (8 arts), P.R.E.S.E.N.T.E., Auditor Constitucional, Riesgo ≠ Daño, Arnés de Evidencia.

Modal global: `EmergencyModal` (SOS / 112 / 061 / PLS).

---

## 3. Componentes

**En uso por el shell**

- `Navbar`
- `WillChat`
- `ExploreTopicsView`
- `ResourcesView`
- `HowWillWorksView`
- `EmergencyModal`
- `ConstitutionView` (subvista)
- `PresenteView` (subvista)
- `AuditorView` (subvista)

**Presentes en el árbol y no montados en `App.tsx`**

- `HarmReductionView.tsx` — no importado
- `CanonicalArchitectureView.tsx` — no importado

No se eliminan. Se reportan.

---

## 4. Navegación

Jerarquía real hoy:

1. Marca (W + «WILL») → fuerza tab `chat`
2. 4 ítems de igual peso visual: Hablar / Explorar / Recursos / Cómo funciona
3. SOS a la derecha (rose)

Desktop: fila de botones en header (`hidden md:flex`).  
Móvil: segunda barra horizontal scrollable (`md:hidden`).

No hay `<nav>` semántico, ni `aria-current`, ni skip-link, ni landmark `main`.

Etiquetas actuales (se conservan; no se reescriben):

- Hablar con Will
- Explorar Temas
- Recursos de Apoyo
- Cómo funciona Will
- SOS / Urgencias

---

## 5. CSS / tokens

No existe un design system. Solo `src/index.css` (23 líneas): import Tailwind + fuentes + `.no-scrollbar`.

Identidad visual **de facto**, extraída de clases Tailwind en componentes (no inventada):

| Rol | Token Tailwind | Hex extraído |
|---|---|---|
| Lienzo | `bg-stone-950` | `#0c0a09` |
| Superficie | `bg-stone-900` | `#1c1917` |
| Superficie 2 | `bg-stone-800` | `#292524` |
| Línea | `border-stone-800` / `stone-700` | `#292524` / `#44403c` |
| Texto | `text-stone-100` | `#f5f5f4` |
| Texto secundario | `text-stone-400` | `#a8a29e` |
| Acento | `amber-500` / `amber-400` / `amber-300` | `#f59e0b` / `#fbbf24` / `#fcd34d` |
| SOS | `rose-600` / `rose-950` | `#e11d48` / `#4c0519` |

Acentos de dominio (chemsex/slam/salud, etc.): amber, rose, cyan, indigo, red, emerald. Son semántica de **categoría**, no paleta de marca.

Radio habitual: `rounded-xl` / `rounded-2xl` / `rounded-3xl`.

**Desviación respecto al canon del blasón:** el lienzo no es `#0A0A0B`. Es stone-950 (`#0c0a09`).

---

## 6. Tipografías (ya en código)

Cargadas en `index.html` desde Google Fonts:

| Rol | Familia | Uso |
|---|---|---|
| Cuerpo | Plus Jakarta Sans | `body`, `.font-sans` |
| Títulos | Newsreader | `h1–h3`, `.font-serif` |
| Técnico | JetBrains Mono | `.font-mono`, badges |

No se introduce una cuarta familia.

---

## 7. Responsive

- Breakpoints Tailwind: `sm` / `md` / `lg`
- Header móvil: dos filas (marca + SOS, luego tabs en scroll)
- Chat: `h-[calc(100vh-4.5rem)]` — frágil si el header móvil mide más de 4.5rem
- Puertas de entrada: 1 / 2 / 3 columnas
- Dominios: grid 2 / 3 / 6
- Targets táctiles a menudo < 44px (`text-xs`, `py-1.5`)

No se observó layout por debajo de 390px en runtime en esta auditoría (se verificará en pruebas D1).

---

## 8. Accesibilidad (estado en `main`)

Hallazgos (código):

- Cero atributos `aria-*` en `src/`
- Cero `role="dialog"` en el modal SOS
- `focus:outline-none` en marca, inputs y varios botones — anillo de foco ausente o sustituido solo por cambio de borde
- Modal SOS: no cierra con Escape; no trampín de foco; overlay clicable no definido
- Botón hablar: `title` nativo, sin `aria-label`
- Imágenes: no hay `<img>` de marca (logo es texto «W»)

Contraste ámbar-sobre-stone: razonable en dark. SOS rose sobre stone: razonable.

---

## 9. Chat

`WillChat.tsx` (~600 líneas).

- Mensaje de bienvenida existente (no se reescribe)
- 7 puertas de entrada desde `HUMAN_ENTRANCE_DOORS`
- Composer: textarea + enviar
- Acciones por mensaje: hablar, copiar, «Verificación ética»
- Lentes P.R.E.S.E.N.T.E. opcionales
- Detector de contexto (chemsex ≠ slam, etc.) — no se toca
- API: `POST /api/chat` con `messages`, `contextDimension`, `detectedContext`

Avatar de Will: recuadro ámbar `rounded-md` con letra **W**. Eso no es el blasón. Meter el blasón en ese recuadro sería infracción de contenedor.

---

## 10. Sistema actual de voz

**Existe. Es Web Speech API del navegador. No hay proveedor TTS propio.**

Ubicación: `WillChat.tsx` `handleToggleSpeak` (aprox. líneas 184–201).

Comportamiento exacto:

```
if (!('speechSynthesis' in window)) return;
window.speechSynthesis.cancel();
utterance.lang = 'es-ES';
utterance.rate = 1.0;
window.speechSynthesis.speak(utterance);
```

No hay:

- selección de `SpeechSynthesisVoice`
- pitch
- rate distinto de 1.0
- proveedor (ElevenLabs, Azure, Google TTS, etc.)
- audio pregrabado
- componente de voz aparte

Campo `audioPlaying?: boolean` en `ChatMessage` — declarado, no usado en el flujo de speak.

La especificación maestra de voz del brief **no está implementada**. D1 no la sustituye ni la inventa. Queda para D6, con autorización.

---

## 11. Recursos gráficos

En `main`:

- Cero PNG/SVG de marca en el repo de Will App
- `assets/.aistudio/` solo gitignore
- Marca = letra W en gradiente `from-amber-500 to-amber-600`, con `shadow-md`
- Iconos: `lucide-react`

Blasón oficial: **ausente** del repositorio objetivo hasta D1.

---

## 12. Presencia del blasón

| Dónde | Estado |
|---|---|
| `Agente-Will-App` (`main`) | Ausente |
| Header | Sustituto: recuadro ámbar + «W» |
| Burbujas de Will | Sustituto: recuadro ámbar + «W» |
| Favicon | Ausente |

Dónde debe incorporarse (solo archivo oficial, copy-paste, sin contenedor, sobre `#0A0A0B`):

1. Marca del header (sustituye la W, no se mete dentro del recuadro)
2. Marca de presencia de Will en el hilo (misma regla)

Orden soberana: usar el PNG entregado. SHA256 origen:

`f9dafd5ff8a4bf52b3fcad7b82a650055a4f562df6514c530ae4191ddfd3eded`

---

## 13. Estados de interacción

| Estado | Dónde | Qué hay |
|---|---|---|
| Default / hover / active de nav | Navbar | stone-800 + amber-300 si activo |
| Loading chat | WillChat | «Will está preparando la respuesta...» + spin |
| Disabled send | botón ámbar → stone-800 |
| Copiado | icono check emerald 2s |
| Speak on | VolumeX + amber |
| Modal SOS | open/close por estado; sin Escape |
| Error de chat | mensaje de fallback en el hilo (copy existente) |
| Contexto en vivo | badge «Tema identificado» al escribir |

No hay empty-state distinto del welcome. No hay skeleton.

---

## 14. Dependencias relevantes (UI)

De `package.json`:

- `react` / `react-dom` 19
- `vite` 6 + `@vitejs/plugin-react` + `@tailwindcss/vite`
- `lucide-react`
- `motion` (dependencia presente; **no se observa uso** en `src/`)
- `@google/genai` — backend, fuera de D1
- `express` — server

---

## 15. Diagnóstico (hechos, no rediseño)

1. La app ya es Will. No hay que reconstruirla.
2. La identidad visual de producto está a medio camino: paleta stone+ámbar seria, pero la marca es una W genérica, no el blasón.
3. El lienzo no cumple `#0A0A0B`.
4. La navegación cubre las 4 áreas correctas; le falta semántica, foco y jerarquía de Will como centro.
5. Accesibilidad de chrome (nav, modal, foco) está por debajo del umbral de un producto serio.
6. Voz: hay un interruptor de lectura del navegador. No es la voz del brief.
7. Contenido canónico y prompts: no se tocan.
8. Dos vistas huérfanas en disco.

---

## 16. Perímetro D1 (lo que se implementa a continuación)

Autorizado por el brief + orden de ejecución:

- Tokens extraídos del sistema actual + lienzo `#0A0A0B`
- Blasón oficial copy-paste (bytes idénticos), sin contenedor
- Navegación: landmarks, foco visible, Will como centro visual
- A11y del chrome (skip link, dialog SOS, aria-current)
- Tipografías existentes
- Cero reescritura de copy de pantallas
- Cero cambio de prompts / API
- Cero motor de voz nuevo
