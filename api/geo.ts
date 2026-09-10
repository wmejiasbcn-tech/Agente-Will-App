import type { Express, Request, Response } from 'express';
import { emergencyForCountry } from './emergencyNumbers';
import {
  extractLanguageLayers,
  LanguageFilterMode,
  nameInLanguages,
  ResourceCategory,
  sortByCareLanguages,
} from './spokenLanguages';

function osmEmbedUrl(
  center: { lat: number; lng: number },
  sites: { lat: number; lng: number }[],
) {
  const pts = [center, ...sites];
  const lats = pts.map((p) => p.lat);
  const lngs = pts.map((p) => p.lng);
  const pad = 0.02;
  const minLng = Math.min(...lngs) - pad;
  const minLat = Math.min(...lats) - pad;
  const maxLng = Math.max(...lngs) + pad;
  const maxLat = Math.max(...lats) + pad;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&layer=mapnik&marker=${center.lat}%2C${center.lng}`;
}

const UA = 'WillApp/1.0 (accompaniment; https://will.app)';
const NOMINATIM = 'https://nominatim.openstreetmap.org';
const OVERPASS_ENDPOINTS = [
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass-api.de/api/interpreter',
  'https://lz4.overpass-api.de/api/interpreter',
];

type Site = {
  name: string;
  kind: string;
  category: ResourceCategory;
  km: number;
  phone?: string;
  address?: string;
  website?: string;
  mapsUrl: string;
  careLanguages: string[];
  nameLanguages: string[];
  lat: number;
  lng: number;
  source: { name: string; url: string; checkedAt?: string };
};

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

function classify(tags: Record<string, string> | undefined): {
  kind: string;
  category: ResourceCategory;
} {
  const a = tags?.amenity || tags?.healthcare || tags?.office || '';
  if (a === 'hospital' || tags?.emergency === 'yes') {
    return { kind: 'Urgencias / Hospital', category: 'emergency' };
  }
  if (a === 'clinic' || a === 'doctors' || a === 'doctor' || a === 'centre' || a === 'center') {
    return { kind: 'Atención sanitaria', category: 'health' };
  }
  if (a === 'pharmacy') return { kind: 'Farmacia', category: 'health' };
  if (a === 'social_facility' || a === 'community_centre' || a === 'ngo') {
    return { kind: 'Recurso comunitario', category: 'community' };
  }
  return { kind: 'Otro recurso', category: 'other' };
}

function phoneFrom(tags: Record<string, string>) {
  return tags.phone || tags['contact:phone'] || tags['contact:mobile'] || undefined;
}

function addressFrom(tags: Record<string, string>) {
  const parts = [
    [tags['addr:street'], tags['addr:housenumber']].filter(Boolean).join(' '),
    tags['addr:city'] || tags['addr:town'],
  ].filter(Boolean);
  return parts.length ? parts.join(', ') : undefined;
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

const PHOTON = 'https://photon.komoot.io';

async function photonSearch(q: string) {
  const url = `${PHOTON}/api/?limit=1&q=${encodeURIComponent(q)}`;
  const r = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!r.ok) return null;
  const data = (await r.json()) as any;
  const hit = data?.features?.[0];
  if (!hit?.geometry?.coordinates) return null;
  const [lng, lat] = hit.geometry.coordinates;
  const props = hit.properties || {};
  return {
    lat: Number(lat),
    lng: Number(lng),
    label: [props.name, props.city, props.country].filter(Boolean).join(', ') || q,
    address: {
      country: props.country,
      country_code: props.countrycode,
      city: props.city || props.name,
    },
  };
}

async function geocodeSearch(q: string, acceptLang: string) {
  return (await nominatimSearch(q, acceptLang)) || photonSearch(q);
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

function toSite(
  tags: Record<string, string>,
  plat: number,
  plng: number,
  origin: { lat: number; lng: number },
  preferred: string[],
  checkedAt?: string,
): Site | null {
  const name = nameInLanguages(tags, preferred);
  if (!name) return null;
  const layers = extractLanguageLayers(tags);
  const { kind, category } = classify(tags);
  const phone = phoneFrom(tags);
  const address = addressFrom(tags);
  const website = tags.website || tags['contact:website'] || undefined;
  return {
    name,
    kind,
    category,
    km: Math.round(distanceKm(origin, { lat: plat, lng: plng }) * 10) / 10,
    phone,
    address,
    website,
    mapsUrl: `https://www.openstreetmap.org/?mlat=${plat}&mlon=${plng}#map=16/${plat}/${plng}`,
    careLanguages: layers.careLanguages,
    nameLanguages: layers.nameLanguages,
    lat: plat,
    lng: plng,
    source: {
      name: 'OpenStreetMap',
      url: `https://www.openstreetmap.org/?mlat=${plat}&mlon=${plng}`,
      checkedAt,
    },
  };
}

function parseSites(
  data: any,
  lat: number,
  lng: number,
  preferred: string[],
): { sites: Site[]; checkedAt?: string } {
  const checkedAt = data?.osm3s?.timestamp_osm_base;
  if (!data?.elements) return { sites: [], checkedAt };
  const seen = new Set<string>();
  const sites: Site[] = [];
  for (const el of data.elements || []) {
    const tags = el.tags || {};
    const plat = el.lat ?? el.center?.lat;
    const plng = el.lon ?? el.center?.lon;
    if (!Number.isFinite(plat) || !Number.isFinite(plng)) continue;
    const site = toSite(tags, plat, plng, { lat, lng }, preferred, checkedAt);
    if (!site) continue;
    const key = site.name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    sites.push(site);
  }
  sites.sort((a, b) => a.km - b.km);
  return { sites: sites.slice(0, 24), checkedAt };
}

async function overpassNearby(lat: number, lng: number, preferred: string[]) {
  const query = `[out:json][timeout:12];
(
  node["amenity"="hospital"](around:5000,${lat},${lng});
  way["amenity"="hospital"](around:5000,${lat},${lng});
  node["amenity"="clinic"](around:5000,${lat},${lng});
  way["amenity"="clinic"](around:5000,${lat},${lng});
  node["amenity"="pharmacy"](around:5000,${lat},${lng});
  node["amenity"="social_facility"](around:5000,${lat},${lng});
  node["office"="ngo"](around:5000,${lat},${lng});
);
out center 40;`;
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
  const parsed = parseSites(data, lat, lng, preferred);
  if (parsed.sites.length) return parsed;
  return nominatimHealthcare(lat, lng, preferred);
}

async function nominatimHealthcare(
  lat: number,
  lng: number,
  preferred: string[],
): Promise<{ sites: Site[]; checkedAt?: string }> {
  const delta = 0.08;
  const viewbox = `${lng - delta},${lat + delta},${lng + delta},${lat - delta}`;
  const queries = ['hospital', 'clinic', 'pharmacy', 'community health'];
  const seen = new Set<string>();
  const sites: Site[] = [];
  const accept = preferred.length ? preferred.join(',') : 'es,en';
  for (const q of queries) {
    try {
      const url = `${NOMINATIM}/search?format=jsonv2&limit=8&addressdetails=1&extratags=1&q=${encodeURIComponent(q)}&viewbox=${viewbox}&bounded=1`;
      const r = await fetch(url, {
        headers: { 'User-Agent': UA, 'Accept-Language': accept },
        signal: AbortSignal.timeout(10000),
      });
      if (!r.ok) continue;
      const hits = (await r.json()) as any[];
      for (const hit of hits || []) {
        const tags = {
          name: String(hit.namedetails?.name || '').split(',')[0] || String(hit.display_name || '').split(',')[0],
          amenity: /hospital/i.test(hit.display_name) ? 'hospital' : /pharm/i.test(hit.display_name) ? 'pharmacy' : 'clinic',
          ...(hit.extratags || {}),
        };
        const plat = Number(hit.lat);
        const plng = Number(hit.lon);
        if (!Number.isFinite(plat) || !Number.isFinite(plng)) continue;
        const site = toSite(tags, plat, plng, { lat, lng }, preferred);
        if (!site) continue;
        const key = site.name.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        sites.push(site);
      }
    } catch {
      continue;
    }
  }
  sites.sort((a, b) => a.km - b.km);
  return { sites: sites.slice(0, 24) };
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
    const origin = req.body?.origin === 'gps' ? 'gps' : 'search';
    const acceptLang = languages.length ? `${languages.join(',')},es,en` : 'es,en';
    let coords = validCoord(req.body?.lat, req.body?.lng);
    let address: any = {};
    let fallbackLabel = '';
    const sent: Array<{ service: string; fields: string[] }> = [];

    if (q && origin === 'search') {
      sent.push({ service: 'nominatim.openstreetmap.org', fields: ['q'] });
      const found = await geocodeSearch(q, acceptLang);
      if (!found) {
        return res.status(404).json({
          error: 'No se ha encontrado ese lugar en el mapa abierto.',
          absence: 'place_not_found',
          privacy: { stored: false, origin, sent, keptAfterResponse: false },
        });
      }
      coords = { lat: found.lat, lng: found.lng };
      address = found.address;
      fallbackLabel = found.label;
      sent.push({ service: 'openstreetmap', fields: ['lat', 'lng del lugar buscado'] });
    } else if (coords && origin === 'gps') {
      sent.push({ service: 'nominatim.openstreetmap.org', fields: ['lat', 'lng'] });
      sent.push({ service: 'openstreetmap', fields: ['lat', 'lng'] });
      const rev = await nominatimReverse(coords.lat, coords.lng, acceptLang);
      address = rev?.address || {};
      fallbackLabel = rev?.label || '';
    } else if (q) {
      const found = await geocodeSearch(q, acceptLang);
      if (!found) {
        return res.status(404).json({
          error: 'No se ha encontrado ese lugar en el mapa abierto.',
          absence: 'place_not_found',
          privacy: { stored: false, origin: 'search', sent, keptAfterResponse: false },
        });
      }
      coords = { lat: found.lat, lng: found.lng };
      address = found.address;
      fallbackLabel = found.label;
    } else {
      return res.status(400).json({ error: 'Indica un lugar o una ubicación.' });
    }

    const countryCode = (address.country_code || '').toUpperCase();
    const countryName = address.country || '';
    let fetched: { sites: Site[]; checkedAt?: string } = { sites: [] };
    try {
      fetched = await overpassNearby(coords!.lat, coords!.lng, languages);
    } catch {
      fetched = { sites: [] };
    }

    const unfilteredCount = fetched.sites.length;
    let sites = sortByCareLanguages(fetched.sites, languages, languageMode);
    let absence: 'none' | 'no_map_hits' | 'filter_empty' = 'none';
    if (unfilteredCount === 0) absence = 'no_map_hits';
    else if (sites.length === 0) absence = 'filter_empty';

    const center = { lat: coords!.lat, lng: coords!.lng };
    return res.json({
      label: placeLabel(address, fallbackLabel || 'Este lugar'),
      countryCode,
      countryName,
      emergency: emergencyForCountry(countryCode),
      sites,
      languages,
      languageMode,
      origin,
      absence,
      unfilteredCount,
      center,
      mapEmbedUrl: osmEmbedUrl(center, sites),
      privacy: {
        stored: false,
        origin,
        sent,
        keptAfterResponse: false,
      },
    });
  } catch {
    return res.status(502).json({
      error: 'No se ha podido consultar el mapa ahora.',
      absence: 'map_error',
      privacy: { stored: false, origin: 'search', sent: [], keptAfterResponse: false },
    });
  }
}

async function handleGeocode(req: Request, res: Response) {
  try {
    const q = typeof req.body?.q === 'string' ? req.body.q.trim().slice(0, 80) : '';
    const origin = req.body?.origin === 'gps' ? 'gps' : 'search';
    const coords = validCoord(req.body?.lat, req.body?.lng);
    const sent: Array<{ service: string; fields: string[] }> = [];
    let found: { lat: number; lng: number; label: string; address: any } | null = null;

    if (q) {
      sent.push({ service: 'nominatim.openstreetmap.org', fields: ['q'] });
      found = await geocodeSearch(q, 'es,en');
      if (!found) sent.push({ service: 'photon.komoot.io', fields: ['q'] });
    } else if (coords && origin === 'gps') {
      sent.push({ service: 'nominatim.openstreetmap.org', fields: ['lat', 'lng'] });
      const rev = await nominatimReverse(coords.lat, coords.lng, 'es,en');
      found = {
        lat: coords.lat,
        lng: coords.lng,
        label: rev?.label || `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`,
        address: rev?.address || {},
      };
    } else {
      return res.status(400).json({ error: 'Indica un lugar o una ubicación.' });
    }

    if (!found) {
      return res.status(404).json({
        error: 'No hemos encontrado resultados para esta búsqueda.',
        absence: 'place_not_found',
        privacy: { stored: false, origin, sent, keptAfterResponse: false },
      });
    }

    return res.json({
      lat: found.lat,
      lng: found.lng,
      label: placeLabel(found.address, found.label),
      countryCode: (found.address?.country_code || '').toUpperCase(),
      countryName: found.address?.country || '',
      origin,
      privacy: { stored: false, origin, sent, keptAfterResponse: false },
    });
  } catch {
    return res.status(502).json({
      error: 'No se ha podido consultar el lugar ahora.',
      absence: 'map_error',
      privacy: { stored: false, origin: 'search', sent: [], keptAfterResponse: false },
    });
  }
}

export function registerGeoRoutes(app: Express) {
  app.post('/api/geo/lookup', handleLookup);
  app.post('/api/geo/geocode', handleGeocode);
}
