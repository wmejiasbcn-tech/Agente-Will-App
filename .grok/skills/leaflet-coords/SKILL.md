---
name: leaflet-coords
description: >
  Corregir coordenadas mal colocadas y colocar puntos con Leaflet + proyección
  web, no a ojo. Geocodificar el lugar, proyectar WGS84→Web Mercator→espacio
  de imagen, actualizar GCP. Triggers: "Leaflet", "geocodificación",
  "coordenadas", "proyección", "Nueva York en Colorado", "Buenos Aires en
  Colombia", "punto mal", "mapamundi", "EPSG", "Nominatim".
metadata:
  short-description: "Fix map points with geocoding + Leaflet, never by guessing percentages"
user-invocable: true
---

# $leaflet-coords — Corregir coordenadas y usar Leaflet

Esta skill **corrige puntos**. No adivina un `%` sobre una foto.

Cuando un punto cae en el país equivocado: geocodificar, proyectar, colocar
con Leaflet, actualizar el GCP. No volver a poner Nueva York «hacia la
derecha» a mano.

Abrir con ella:

- `references/projections.md`
- `references/geocoding.md`

Will App / Otros recursos es el caso canónico.

---

## 0. Encargo

**Qué:** cada marcador está en la tierra de esa ciudad.

**Hecho:** geocódigo WGS84 → Web Mercator → píxel del mapamundi. Leaflet
mueve el mapa a esa coordenada. Un clic o una búsqueda no inventan el país.

**Prohibido:**

- Colocar una ciudad en el centro del continente.
- Sustituir geocodificación por un array de porcentajes adivinados.
- Poner teselas tipo Google Maps como estética de Will.
- Declarar VERDE porque el pin «queda bonito».

---

## 1. Protocolo (ejecutar)

### Paso 1 — No adivinar el píxel

Si «Buenos Aires está en Colombia»:

1. Geocodificar `Buenos Aires` (Nominatim; Photon si Nominatim falla).
2. Obtener `lat`, `lng` WGS84.
3. Proyectar con `wgsToImage` (`src/utils/mapGeoref.ts`).
4. Colocar el marcador Leaflet en esa coordenada de imagen.
5. Si el GCP está mal, **actualizar el GCP** con el píxel calibrado, no
   parchear un `x: 28` suelto en el componente.

### Paso 2 — Proyección

Orden obligatorio:

```
WGS84 (EPSG:4326)
  → Web Mercator (EPSG:3857)
  → espacio imagen (GCP + IDW)
  → Leaflet CRS.Simple
```

Nunca: `x = (lng + 180) / 360` sobre el mapamundi artístico.
Esa foto no es equirectangular.

### Paso 3 — Leaflet

- El fondo es el mapamundi de Will (`world-map-screen.jpg`), no OSM raster
  como héroe.
- `L.CRS.Simple` + `L.imageOverlay`.
- Icono propio (ámbar/cristal). No el pin azul por defecto.
- `flyTo` tras geocodificar. `fitBounds` del mundo al volver.
- Clic en el mapa: imagen → WGS84 inverso → reverse geocode → recursos.
  El origen es `search`, no `gps`.

### Paso 4 — APIs

- Nominatim para geocódigo y reverse. User-Agent de Will. No persistir.
- Photon (Komoot) como respaldo.
- Overpass sigue siendo recursos, no el pin.
- Nada de Google Geocoding, Mapbox ni clave en el frontend.

### Paso 5 — Verificar

- Nueva York al este de Colorado, no en Colorado.
- Buenos Aires al sur de Bogotá, no en Colombia.
- Mumbai al este de Dubái, no en Arabia.
- Un GCP proyectado sobre sí mismo cae a menos de 2% de su píxel.
- La búsqueda textual sigue funcionando sin tocar el mapa.

---

## 2. Cierre

| Estado | Cuándo |
|---|---|
| **VERDE** | El pin está en la tierra correcta; geocódigo real; Leaflet mueve; no hay tesela turística. |
| **ROJO** | El pin sigue en el país equivocado. |
| **BLOQUEADO** | Nominatim/Photon no responden. No inventar coordenadas. |

**«He movido el porcentaje» no es VERDE.**
