# Proyecciones

## WGS84 (EPSG:4326)

`lat` ∈ [-90, 90], `lng` ∈ [-180, 180]. Es lo que devuelve Nominatim.

## Web Mercator (EPSG:3857)

Es la proyección de Leaflet/OSM cuando hay teselas.

```
x = R * lng * π/180
y = R * ln(tan(π/4 + lat * π/360))
R = 6378137
```

Usarla para interpolar entre GCPs. No interpolar en grados: cerca de los
polos y a lo largo del Pacífico miente.

## Espacio imagen (mapamundi de Will)

`world-map-screen.jpg` es 1200×556 y **no** es equirectangular. Es una
vista artística. Por eso:

1. GCPs: ciudad con `lat,lng` reales y `x,y` % calibrados sobre esa foto.
2. IDW en espacio Mercator → `%` de la imagen.
3. Leaflet `CRS.Simple` con bounds `[[0,0],[556,1200]]`.
   Coordenada Leaflet: `[yPx, xPx]` = `[y% * 556 / 100, x% * 1200 / 100]`.

## Qué no hacer

- `object-fit: cover` sobre el overlay de puntos. Recorta y mueve países.
- Un `aspect-ratio` distinto al de la foto.
- Un solo ancla «América = Nueva York».
