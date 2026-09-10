# Geocodificación

## Orden

1. `POST /api/geo/geocode` con `{ q }` o `{ lat, lng }`.
2. Nominatim (`search` o `reverse`).
3. Si Nominatim no hay hit: Photon `https://photon.komoot.io/api/`.
4. Respuesta: `{ lat, lng, label, countryCode }` + proyección imagen.
5. No guardar. No localStorage.

## Lookup de recursos

`/api/geo/lookup` geocodifica y pide Overpass. El pin usa `center`.
No uses el nombre de un nodo para decidir el país si ya hay `center`.

## Clic en el mapa

1. Evento Leaflet → píxel.
2. `imageToWgs`.
3. Reverse geocode.
4. `origin: 'search'`. No es GPS.

## User-Agent

Nominatim exige uno identificable. Will ya envía `WillApp/1.0`.
No dispares en bucle. Un geocódigo por búsqueda.
