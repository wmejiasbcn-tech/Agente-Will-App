# AUDITORÍA REAL DE INTERFAZ — WILL APP

> **DOCUMENTO HISTÓRICO — auditoría de 2026-09-07.**
>
> El cuerpo principal conserva el estado observado en el commit auditado. No debe leerse como fotografía del `main` actual. Las correcciones posteriores se registran al final para impedir que hechos ya superados contaminen nuevas auditorías.

**Repositorio:** `wmejiasbcn-tech/Agente-Will-App`  
**Commit auditado:** `56e39fa9153f586c403aebfe5206bfa98eb8313a` (`main`, 2026-09-06)  
**Auditor:** Aether  
**Alcance:** interfaz existente. Cero modificación de backend, prompts o contenido en este documento.  
**Método:** inspección del árbol, lectura de componentes y datos, búsqueda de voz/blasón/a11y.

---

## 1. Estructura observada en el snapshot

Aplicación Vite + React + Tailwind + Express.

| Ruta | Función |
|---|---|
| `src/App.tsx` | Shell: tab activa + modal SOS |
| `src/main.tsx` | Mount React |
| `src/index.css` | Tailwind + familias tipográficas |
| `src/components/*` | UI |
| `src/data/*` | Contenido canónico |
| `src/utils/contextDetector.ts` | Detección de dominio en chat |
| `api/index.ts` | Entrada API serverless del snapshot |
| `server.ts` | Dev server del snapshot |
| `public/` | Assets gráficos del snapshot |

Navegación por estado React (`activeTab`), no por router. No hay React Router.

---

## 2. Pantallas existentes en el snapshot

Definidas en `App.tsx`. Default: `chat`.

| Tab id | Componente | Título visible |
|---|---|---|
| `chat` | `WillChat` | Hablar con Will |
| `topics` | `ExploreTopicsView` | Explorar Áreas y Temas |
| `resources` | `ResourcesView` | Recursos de Apoyo y Servicios |
| `how-it-works` | `HowWillWorksView` | Cómo Funciona Will |

`HowWillWorksView` contiene subsecciones: Principios, Constitución, P.R.E.S.E.N.T.E., Auditor Constitucional, Riesgo ≠ Daño y Arnés de Evidencia.

Modal global: `EmergencyModal` (SOS).

---

## 3. Componentes

En uso por el shell: `Navbar`, `WillChat`, `ExploreTopicsView`, `ResourcesView`, `HowWillWorksView`, `EmergencyModal` y sus subvistas.

Presentes en el árbol y no montados en `App.tsx`:

- `HarmReductionView.tsx`
- `CanonicalArchitectureView.tsx`

No se eliminan por esta auditoría; se reportan como deuda conocida.

---

## 4. Navegación observada en el snapshot

Jerarquía real del snapshot:

1. Marca W + WILL → chat
2. 4 ítems principales
3. SOS

La auditoría original consignó ausencia de semántica, foco y skip-link. Estos puntos fueron posteriormente corregidos en D1 y no deben marcarse como defectos actuales sin reproducirlos en `main`.

---

## 5. CSS / tokens del snapshot

La auditoría original identificó la paleta `stone` + ámbar y documentó una desviación respecto al lienzo canónico. D1 posterior estableció `#0A0A0B` como lienzo del producto y dejó constancia de su medición. Este apartado es, por tanto, **histórico**.

---

## 6. Tipografías del snapshot

Cargadas en `index.html` desde Google Fonts. No se introduce una cuarta familia.

---

## 7. Responsive

Los hallazgos de esta sección pertenecen al snapshot auditado. Las pruebas posteriores de D1/D2 cubrieron 390×844 y 1280×800. Para el estado actual debe utilizarse una prueba nueva sobre `main`.

---

## 8. Accesibilidad del snapshot

Los hallazgos de ausencia de `aria-*`, `role="dialog"`, foco y Escape pertenecen al estado previo a D1. D1 documentó la corrección de estos elementos. No deben reutilizarse como defectos actuales sin reproducción.

---

## 9. Chat del snapshot

`WillChat.tsx` contenía las puertas y comportamiento observados en aquella fecha. El comportamiento actual debe contrastarse con el código vigente y con el protocolo universal de entrada.

---

## 10. Sistema de voz — SNAPSHOT HISTÓRICO

**En la fecha de esta auditoría se observó Web Speech API del navegador.**

La referencia histórica a `speechSynthesis` queda expresamente cerrada como descripción del snapshot, no del runtime actual.

### Estado posterior

El runtime actual utiliza **ElevenLabs**, voz `DrwFQsjvHFpLcKyvtbE3`, modelo `eleven_multilingual_v2`. Las pruebas actuales verifican además que el runtime no utiliza `speechSynthesis` ni Kokoro.

---

## 11. Recursos gráficos del snapshot

Los estados de marca y blasón aquí descritos pertenecen al momento anterior a D1. D1 incorporó posteriormente el blasón oficial con bytes idénticos al origen.

---

## 12. Presencia del blasón

Esta sección es una fotografía previa a D1. El blasón estaba ausente en el `main` auditado y fue incorporado posteriormente según la especificación soberana.

SHA256 de origen conservado como referencia:

`f9dafd5dff8a4bf52b3fcad7b82a650055a4f562df6514c530ae4191ddfd3eded`

---

## 13. Estados de interacción

Estados observados en el snapshot. Las correcciones posteriores de D1/D2 deben verificarse mediante pruebas actuales, no por este documento.

---

## 14. Dependencias relevantes del snapshot

La lista refleja el estado auditado en 2026-09-07. Para dependencia y proveedor actuales, consultar `package.json` y `README.md` del `main` actual.

---

## 15. Diagnóstico histórico

La auditoría original identificó:

1. identidad visual a medio camino;
2. lienzo distinto del canon;
3. carencias de chrome/a11y;
4. voz de navegador;
5. vistas huérfanas;
6. otros puntos de deuda.

Los puntos que D1/D2 corrigieron no deben mantenerse como defectos actuales por inercia documental.

---

## 16. Perímetro D1 histórico

El perímetro autorizado fue:

- tokens y lienzo `#0A0A0B`;
- blasón oficial copy-paste;
- navegación y accesibilidad del chrome;
- cero reescritura de copy;
- cero cambio de prompts/API;
- cero motor de voz nuevo dentro de D1.

---

# RECALIBRACIÓN DOCUMENTAL POSTERIOR

**Fecha de actualización:** septiembre de 2026.  
**HEAD actual de referencia:** `d2cdcdcf17733d30c3353fa8d5d7617a354bab12`.

Esta auditoría queda clasificada como **EVIDENCIA HISTÓRICA**. Sus observaciones solo certifican el estado del commit `56e39fa`.

### Cambios posteriores ya conocidos

- D1 corrigió navegación, landmarks, foco, SOS y blasón.
- D1/D2 establecieron el lienzo `#0A0A0B`.
- Will pasó a disponer de **7 dominios**, incluido Prevención autónoma.
- La voz actual es ElevenLabs; la referencia a `speechSynthesis` es histórica.
- El servidor Express actual utiliza `api/app.ts` y puerto **8080** por defecto.
- La API serverless de Vercel conserva `api/index.ts` como entrada separada.
- `kokoro-js` no está en `package.json` actual; una expectativa Kokoro residual en `tests/browser-perf.test.ts` fue identificada y corregida posteriormente.
- La configuración de proveedor de conversación admite Gemini y fallback xAI/Grok; `.env.example` documenta ahora `XAI_API_KEY`.
- Los runners históricos que apuntaban a `localhost:3000` fueron corregidos para usar `WILL_URL` y, por defecto, el `8080` actual.

### Regla de no contaminación histórica

> **No trasladar un hallazgo histórico al estado actual sin reproducción. No cerrar un hallazgo actual únicamente porque exista una prueba histórica que salió verde.**

Para auditorías nuevas deben registrarse commit/HEAD, timestamp, entorno, proveedor/modelo efectivos, endpoint, respuesta y resultado. 

**Fuente actual de orientación del producto:** `README.md` y código de `main`. Este documento conserva únicamente la trazabilidad de la auditoría de 2026-09-07.
