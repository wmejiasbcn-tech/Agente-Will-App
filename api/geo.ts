import type { Express, Request, Response } from 'express';
import { emergencyForCountry } from '../src/data/emergencyNumbers';
import {
  LanguageFilterMode,
  languagesFromOsmTags,
  nameInLanguages,
  sortByLanguages,
} from '../src/data/spokenLanguages';
import { osmEmbedUrl } from '../src/utils/geolocation';

const UA = 'WillApp/1.0 (accompaniment; https://will.app)';
const NOMINATIM = 'https://nominatim.openstreetmap.org';
const OVERPASS_ENDPOINTS = [
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass-api.de/api/interpreter',
  'https://lz4.overpass-api.de/api/interpreter',
];

function validCoord(lat: unknown, lng: unknown) {
  const a = Number(lat);
  const b = Number(lng);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  if (a < -90 || a > 90 || b < -180 || b > 180) return null;
  return { lat: a, lng: b };
}

function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}

function kindLabel(tags: Record<string, string> | undefined) {
  const a = tags?.amenity || tags?.healthcare || '';
  if (a === 'hospital') return 'Hospital';
  if (a === 'clinic' || a === 'centre' || a === 'center') return 'Centro de salud';
  if (a === 'doctors' || a === 'doctor') return 'Consulta';
  if (a === 'pharmacy') return 'Farmacia';
  return 'Recurso sanitario';
}

async function nominatimSearch(q: string, acceptLang: string) {
  const url = `${NOMINATIM}/search?format=jsonv2&limit=1&addressdetails=1&q=${encodeURIComponent(q)}`;
  const r = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': acceptLang } });
  if (!r.ok) return null;
  const data = (await r.json()) as any[];
  const hit = data?.[0];
  if (!hit) return null;
  return {
    lat: Number(hit.lat),
    lng: Number(hit.lon),
    label: hit.display_name as string,
    address: hit.address || {},
  };
}

async function nominatimReverse(lat: number, lng: number, acceptLang: string) {
  const url = `${NOMINATIM}/reverse?format=jsonv2&zoom=12&addressdetails=1&lat=${lat}&lon=${lng}`;
  const r = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': acceptLang } });
  if (!r.ok) return null;
  const hit = (await r.json()) as any;
  if (!hit || hit.error) return null;
  return {
    label: hit.display_name as string,
    address: hit.address || {},
  };
}

async function overpassNearby(lat: number, lng: number) {
  const query = `[out:json][timeout:12];
(
  node["amenity"="hospital"](around:5000,${lat},${lng});
  way["amenity"="hospital"](around:5000,${lat},${lng});
  node["amenity"="clinic"](around:5000,${lat},${lng});
);
out center 20;`;
  let data: any = null;
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const r = await fetch(endpoint, {
        method: 'POST',
        headers: { 'User-Agent': UA, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`,
        signal: AbortSignal.timeout(14000),
      });
      if (!r.ok) continue;
      data = await r.json();
      if (data?.elements?.length) break;
    } catch {
      continue;
    }
  }
  const fromOverpass = parseSites(data, lat, lng, []);
  if (fromOverpass.length) return fromOverpass;
  return nominatimHealthcare(lat, lng, []);
}

function parseSites(data: any, lat: number, lng: number, preferred: string[]) {
  if (!data?.elements) return [];
  const seen = new Set<string>();
  const sites: Array<{
    name: string;
    kind: string;
    km: number;
    mapsUrl: string;
    languages: string[];
    lat: number;
    lng: number;
  }> = [];
  for (const el of data.elements || []) {
    const tags = el.tags || {};
    const name = nameInLanguages(tags, preferred);
    if (!name) continue;
    const plat = el.lat ?? el.center?.lat;
    const plng = el.lon ?? el.center?.lon;
    if (!Number.isFinite(plat) || !Number.isFinite(plng)) continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    sites.push({
      name,
      kind: kindLabel(tags),
      km: Math.round(distanceKm({ lat, lng }, { lat: plat, lng: plng }) * 10) / 10,
      mapsUrl: `https://www.openstreetmap.org/?mlat=${plat}&mlon=${plng}#map=16/${plat}/${plng}`,
      languages: languagesFromOsmTags(tags),
      lat: plat,
      lng: plng,
    });
  }
  sites.sort((a, b) => a.km - b.km);
  return sites.slice(0, 12);
}

async function nominatimHealthcare(lat: number, lng: number, preferred: string[]) {
  const delta = 0.08;
  const viewbox = `${lng - delta},${lat + delta},${lng + delta},${lat - delta}`;
  const queries = ['hospital', 'clinic', 'international hospital'];
  const seen = new Set<string>();
  const sites: Array<{
    name: string;
    kind: string;
    km: number;
    mapsUrl: string;
    languages: string[];
    lat: number;
    lng: number;
  }> = [];
  const accept = preferred.length ? preferred.join(',') : 'es,en';
  for (const q of queries) {
    try {
      const url = `${NOMINATIM}/search?format=jsonv2&limit=8&q=${encodeURIComponent(q)}&viewbox=${viewbox}&bounded=1`;
      const r = await fetch(url, {
        headers: { 'User-Agent': UA, 'Accept-Language': accept },
        signal: AbortSignal.timeout(10000),
      });
      if (!r.ok) continue;
      const hits = (await r.json()) as any[];
      for (const hit of hits || []) {
        const name = String(hit.namedetails?.name || hit.display_name || '').split(',')[0];
        if (!name) continue;
        const key = name.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        const plat = Number(hit.lat);
        const plng = Number(hit.lon);
        if (!Number.isFinite(plat) || !Number.isFinite(plng)) continue;
        const blob = String(hit.display_name || '').toLowerCase();
        const languages = /international|english/.test(blob) ? ['en'] : [];
        sites.push({
          name,
          kind: /hospital/.test(blob) ? 'Hospital' : 'Centro de salud',
          km: Math.round(distanceKm({ lat, lng }, { lat: plat, lng: plng }) * 10) / 10,
          mapsUrl: `https://www.openstreetmap.org/?mlat=${plat}&mlon=${plng}#map=16/${plat}/${plng}`,
          languages,
          lat: plat,
          lng: plng,
        });
      }
    } catch {
      continue;
    }
  }
  sites.sort((a, b) => a.km - b.km);
  return sites.slice(0, 12);
}

function placeLabel(address: any, fallback: string) {
  const city =
    address.city ||
    address.town ||
    address.village ||
    address.municipality ||
    address.hamlet ||
    address.county;
  const country = address.country;
  if (city && country) return `${city}, ${country}`;
  if (country) return country;
  return fallback.split(',').slice(0, 3).join(',').trim();
}

async function handleLookup(req: Request, res: Response) {
  try {
    const q = typeof req.body?.q === 'string' ? req.body.q.trim().slice(0, 80) : '';
    const languages = Array.isArray(req.body?.languages)
      ? req.body.languages.filter((l: unknown) => typeof l === 'string' && /^[a-z]{2}$/.test(l)).slice(0, 8)
      : [];
    const languageMode: LanguageFilterMode =
      req.body?.languageMode === 'only' ? 'only' : 'prioritize';
    const acceptLang = languages.length ? `${languages.join(',')},es,en` : 'es,en';
    let coords = validCoord(req.body?.lat, req.body?.lng);
    let address: any = {};
    let fallbackLabel = '';

    if (q && !coords) {
      const found = await nominatimSearch(q, acceptLang);
      if (!found) {
        return res.status(404).json({ error: 'No se ha encontrado ese lugar.' });
      }
      coords = { lat: found.lat, lng: found.lng };
      address = found.address;
      fallbackLabel = found.label;
    } else if (coords) {
      const rev = await nominatimReverse(coords.lat, coords.lng, acceptLang);
      address = rev?.address || {};
      fallbackLabel = rev?.label || '';
    } else {
      return res.status(400).json({ error: 'Indica un lugar o una ubicación.' });
    }

    const countryCode = (address.country_code || '').toUpperCase();
    const countryName = address.country || '';
    let sites: Awaited<ReturnType<typeof overpassNearby>> = [];
    try {
      sites = await overpassNearby(coords!.lat, coords!.lng);
    } catch {
      sites = [];
    }
    sites = sortByLanguages(sites, languages, languageMode);

    const center = { lat: coords!.lat, lng: coords!.lng };
    return res.json({
      label: placeLabel(address, fallbackLabel || 'Este lugar'),
      countryCode,
      countryName,
      emergency: emergencyForCountry(countryCode),
      sites,
      languages,
      languageMode,
      center,
      mapEmbedUrl: osmEmbedUrl(center, sites),
    });
  } catch {
    return res.status(502).json({ error: 'No se ha podido consultar el mapa ahora.' });
  }
}

export function registerGeoRoutes(app: Express) {
  app.post('/api/geo/lookup', handleLookup);
}
