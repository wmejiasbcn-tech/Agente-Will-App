var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// api/app.ts
var app_exports = {};
__export(app_exports, {
  app: () => app,
  default: () => app_default
});
module.exports = __toCommonJS(app_exports);
var import_express = __toESM(require("express"), 1);
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);

// api/emergencyNumbers.ts
var E = {
  ES: { numbers: ["112", "061"], note: "Emergencias y urgencias sanitarias." },
  AD: { numbers: ["112"], note: "Emergencias." },
  PT: { numbers: ["112"], note: "Emergencias." },
  FR: { numbers: ["112", "15"], note: "Emergencias y SAMU." },
  DE: { numbers: ["112"], note: "Emergencias." },
  IT: { numbers: ["112", "118"], note: "Emergencias y sanitarias." },
  GB: { numbers: ["999", "112"], note: "Emergencias." },
  IE: { numbers: ["112", "999"], note: "Emergencias." },
  NL: { numbers: ["112"], note: "Emergencias." },
  BE: { numbers: ["112"], note: "Emergencias." },
  CH: { numbers: ["144", "112"], note: "Sanitarias y emergencias." },
  AT: { numbers: ["112", "144"], note: "Emergencias y sanitarias." },
  SE: { numbers: ["112"], note: "Emergencias." },
  NO: { numbers: ["113", "112"], note: "Ambulancia y emergencias." },
  FI: { numbers: ["112"], note: "Emergencias." },
  DK: { numbers: ["112"], note: "Emergencias." },
  IS: { numbers: ["112"], note: "Emergencias." },
  PL: { numbers: ["112"], note: "Emergencias." },
  CZ: { numbers: ["112"], note: "Emergencias." },
  GR: { numbers: ["112", "166"], note: "Emergencias y ambulancia." },
  TR: { numbers: ["112"], note: "Emergencias." },
  UA: { numbers: ["103", "112"], note: "Ambulancia y emergencias." },
  RU: { numbers: ["103", "112"], note: "Ambulancia y emergencias." },
  US: { numbers: ["911"], note: "Emergencias." },
  CA: { numbers: ["911"], note: "Emergencias." },
  MX: { numbers: ["911"], note: "Emergencias." },
  GT: { numbers: ["123", "128"], note: "Emergencias y bomberos/sanitario." },
  CR: { numbers: ["911"], note: "Emergencias." },
  PA: { numbers: ["911"], note: "Emergencias." },
  CO: { numbers: ["123"], note: "Emergencias." },
  VE: { numbers: ["171"], note: "Emergencias." },
  EC: { numbers: ["911"], note: "Emergencias." },
  PE: { numbers: ["105", "117"], note: "Polic\xEDa y SAMU." },
  BO: { numbers: ["911"], note: "Emergencias." },
  BR: { numbers: ["192", "190"], note: "SAMU y polic\xEDa." },
  PY: { numbers: ["911"], note: "Emergencias." },
  UY: { numbers: ["911"], note: "Emergencias." },
  AR: { numbers: ["911", "107"], note: "Emergencias y SAME." },
  CL: { numbers: ["131", "133"], note: "Ambulancia y carabineros." },
  JP: { numbers: ["119", "110"], note: "Bomberos/ambulancia y polic\xEDa." },
  KR: { numbers: ["119", "112"], note: "Ambulancia y polic\xEDa." },
  CN: { numbers: ["120", "110"], note: "Ambulancia y polic\xEDa." },
  TW: { numbers: ["119", "110"], note: "Ambulancia y polic\xEDa." },
  HK: { numbers: ["999"], note: "Emergencias." },
  SG: { numbers: ["995", "999"], note: "Ambulancia y polic\xEDa." },
  MY: { numbers: ["999"], note: "Emergencias." },
  TH: { numbers: ["1669", "191"], note: "Ambulancia y polic\xEDa." },
  VN: { numbers: ["115"], note: "Ambulancia." },
  PH: { numbers: ["911"], note: "Emergencias." },
  ID: { numbers: ["112", "118"], note: "Emergencias y ambulancia." },
  IN: { numbers: ["112", "108"], note: "Emergencias y ambulancia." },
  NP: { numbers: ["102"], note: "Ambulancia." },
  PK: { numbers: ["15", "1122"], note: "Polic\xEDa y rescate." },
  AU: { numbers: ["000", "112"], note: "Emergencias." },
  NZ: { numbers: ["111"], note: "Emergencias." },
  ZA: { numbers: ["10177", "112"], note: "Ambulancia y emergencias." },
  NG: { numbers: ["112"], note: "Emergencias." },
  KE: { numbers: ["112", "999"], note: "Emergencias." },
  EG: { numbers: ["123"], note: "Ambulancia." },
  MA: { numbers: ["15", "190"], note: "Ambulancia y polic\xEDa." },
  IL: { numbers: ["101"], note: "Ambulancia (Magen David Adom)." },
  AE: { numbers: ["998", "999"], note: "Ambulancia y polic\xEDa." },
  SA: { numbers: ["997", "911"], note: "Ambulancia y emergencias." }
};
function emergencyForCountry(code) {
  if (!code) {
    return {
      numbers: [],
      note: "No hay un n\xFAmero \xFAnico verificado para este lugar. Pregunta en recepci\xF3n o busca el servicio de emergencias local."
    };
  }
  const info = E[code.toUpperCase()];
  if (info) return info;
  return {
    numbers: ["112"],
    note: "No hay un n\xFAmero verificado para este pa\xEDs. 112 funciona en muchos territorios; confirma el de all\xED."
  };
}

// api/spokenLanguages.ts
function extractLanguageLayers(tags) {
  const nameLanguages = /* @__PURE__ */ new Set();
  const careLanguages = /* @__PURE__ */ new Set();
  if (!tags) return { nameLanguages: [], careLanguages: [] };
  for (const key of Object.keys(tags)) {
    const named = key.match(/^name:([a-z]{2})$/);
    if (named) nameLanguages.add(named[1]);
    const spoken = key.match(/^language:([a-z]{2})$/);
    if (spoken) careLanguages.add(spoken[1]);
  }
  const listed = (tags.languages || tags.language || tags["contact:language"] || "").toLowerCase().split(/[;,/\s]+/).map((s) => s.trim()).filter((s) => /^[a-z]{2}$/.test(s));
  listed.forEach((l) => careLanguages.add(l));
  const blob = `${tags.name || ""} ${tags.operator || ""}`.toLowerCase();
  if (/\binternational\b|\benglish[- ]speaking\b/.test(blob)) {
    careLanguages.add("en");
  }
  return {
    nameLanguages: [...nameLanguages],
    careLanguages: [...careLanguages]
  };
}
function siteMatchesCareLanguages(careLanguages, selected) {
  if (!selected.length) return true;
  return selected.some((l) => careLanguages.includes(l));
}
function sortByCareLanguages(sites, selected, mode) {
  if (!selected.length) return sites;
  const matched = sites.filter((s) => siteMatchesCareLanguages(s.careLanguages, selected));
  const rest = sites.filter((s) => !siteMatchesCareLanguages(s.careLanguages, selected));
  if (mode === "only") return matched;
  const byKm = (a, b) => a.km - b.km;
  return [...matched.sort(byKm), ...rest.sort(byKm)];
}
function nameInLanguages(tags, preferred) {
  if (!tags) return "";
  for (const lang of preferred) {
    const n = tags[`name:${lang}`];
    if (n) return n;
  }
  return tags.name || tags["name:en"] || tags["name:es"] || "";
}

// api/geo.ts
function osmEmbedUrl(center, sites) {
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
var UA = "WillApp/1.0 (accompaniment; https://will.app)";
var NOMINATIM = "https://nominatim.openstreetmap.org";
var OVERPASS_ENDPOINTS = [
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass-api.de/api/interpreter",
  "https://lz4.overpass-api.de/api/interpreter"
];
function validCoord(lat, lng) {
  const a = Number(lat);
  const b = Number(lng);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  if (a < -90 || a > 90 || b < -180 || b > 180) return null;
  return { lat: a, lng: b };
}
function distanceKm(a, b) {
  const R = 6371;
  const toRad = (d) => d * Math.PI / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}
function classify(tags) {
  const a = tags?.amenity || tags?.healthcare || tags?.office || "";
  if (a === "hospital" || tags?.emergency === "yes") {
    return { kind: "Urgencias / Hospital", category: "emergency" };
  }
  if (a === "clinic" || a === "doctors" || a === "doctor" || a === "centre" || a === "center") {
    return { kind: "Atenci\xF3n sanitaria", category: "health" };
  }
  if (a === "pharmacy") return { kind: "Farmacia", category: "health" };
  if (a === "social_facility" || a === "community_centre" || a === "ngo") {
    return { kind: "Recurso comunitario", category: "community" };
  }
  return { kind: "Otro recurso", category: "other" };
}
function phoneFrom(tags) {
  return tags.phone || tags["contact:phone"] || tags["contact:mobile"] || void 0;
}
function addressFrom(tags) {
  const parts = [
    [tags["addr:street"], tags["addr:housenumber"]].filter(Boolean).join(" "),
    tags["addr:city"] || tags["addr:town"]
  ].filter(Boolean);
  return parts.length ? parts.join(", ") : void 0;
}
async function nominatimSearch(q, acceptLang) {
  const url = `${NOMINATIM}/search?format=jsonv2&limit=1&addressdetails=1&q=${encodeURIComponent(q)}`;
  const r = await fetch(url, { headers: { "User-Agent": UA, "Accept-Language": acceptLang } });
  if (!r.ok) return null;
  const data = await r.json();
  const hit = data?.[0];
  if (!hit) return null;
  return {
    lat: Number(hit.lat),
    lng: Number(hit.lon),
    label: hit.display_name,
    address: hit.address || {}
  };
}
async function nominatimReverse(lat, lng, acceptLang) {
  const url = `${NOMINATIM}/reverse?format=jsonv2&zoom=12&addressdetails=1&lat=${lat}&lon=${lng}`;
  const r = await fetch(url, { headers: { "User-Agent": UA, "Accept-Language": acceptLang } });
  if (!r.ok) return null;
  const hit = await r.json();
  if (!hit || hit.error) return null;
  return {
    label: hit.display_name,
    address: hit.address || {}
  };
}
function toSite(tags, plat, plng, origin, preferred, checkedAt) {
  const name = nameInLanguages(tags, preferred);
  if (!name) return null;
  const layers = extractLanguageLayers(tags);
  const { kind, category } = classify(tags);
  const phone = phoneFrom(tags);
  const address = addressFrom(tags);
  const website = tags.website || tags["contact:website"] || void 0;
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
      name: "OpenStreetMap",
      url: `https://www.openstreetmap.org/?mlat=${plat}&mlon=${plng}`,
      checkedAt
    }
  };
}
function parseSites(data, lat, lng, preferred) {
  const checkedAt = data?.osm3s?.timestamp_osm_base;
  if (!data?.elements) return { sites: [], checkedAt };
  const seen = /* @__PURE__ */ new Set();
  const sites = [];
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
async function overpassNearby(lat, lng, preferred) {
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
  let data = null;
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const r = await fetch(endpoint, {
        method: "POST",
        headers: { "User-Agent": UA, "Content-Type": "application/x-www-form-urlencoded" },
        body: `data=${encodeURIComponent(query)}`,
        signal: AbortSignal.timeout(14e3)
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
async function nominatimHealthcare(lat, lng, preferred) {
  const delta = 0.08;
  const viewbox = `${lng - delta},${lat + delta},${lng + delta},${lat - delta}`;
  const queries = ["hospital", "clinic", "pharmacy", "community health"];
  const seen = /* @__PURE__ */ new Set();
  const sites = [];
  const accept = preferred.length ? preferred.join(",") : "es,en";
  for (const q of queries) {
    try {
      const url = `${NOMINATIM}/search?format=jsonv2&limit=8&addressdetails=1&extratags=1&q=${encodeURIComponent(q)}&viewbox=${viewbox}&bounded=1`;
      const r = await fetch(url, {
        headers: { "User-Agent": UA, "Accept-Language": accept },
        signal: AbortSignal.timeout(1e4)
      });
      if (!r.ok) continue;
      const hits = await r.json();
      for (const hit of hits || []) {
        const tags = {
          name: String(hit.namedetails?.name || "").split(",")[0] || String(hit.display_name || "").split(",")[0],
          amenity: /hospital/i.test(hit.display_name) ? "hospital" : /pharm/i.test(hit.display_name) ? "pharmacy" : "clinic",
          ...hit.extratags || {}
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
function placeLabel(address, fallback) {
  const city = address.city || address.town || address.village || address.municipality || address.hamlet || address.county;
  const country = address.country;
  if (city && country) return `${city}, ${country}`;
  if (country) return country;
  return fallback.split(",").slice(0, 3).join(",").trim();
}
async function handleLookup(req, res) {
  try {
    const q = typeof req.body?.q === "string" ? req.body.q.trim().slice(0, 80) : "";
    const languages = Array.isArray(req.body?.languages) ? req.body.languages.filter((l) => typeof l === "string" && /^[a-z]{2}$/.test(l)).slice(0, 8) : [];
    const languageMode = req.body?.languageMode === "only" ? "only" : "prioritize";
    const origin = req.body?.origin === "gps" ? "gps" : "search";
    const acceptLang = languages.length ? `${languages.join(",")},es,en` : "es,en";
    let coords = validCoord(req.body?.lat, req.body?.lng);
    let address = {};
    let fallbackLabel = "";
    const sent = [];
    if (q && origin === "search") {
      sent.push({ service: "nominatim.openstreetmap.org", fields: ["q"] });
      const found = await nominatimSearch(q, acceptLang);
      if (!found) {
        return res.status(404).json({
          error: "No se ha encontrado ese lugar en el mapa abierto.",
          absence: "place_not_found",
          privacy: { stored: false, origin, sent, keptAfterResponse: false }
        });
      }
      coords = { lat: found.lat, lng: found.lng };
      address = found.address;
      fallbackLabel = found.label;
      sent.push({ service: "openstreetmap", fields: ["lat", "lng del lugar buscado"] });
    } else if (coords && origin === "gps") {
      sent.push({ service: "nominatim.openstreetmap.org", fields: ["lat", "lng"] });
      sent.push({ service: "openstreetmap", fields: ["lat", "lng"] });
      const rev = await nominatimReverse(coords.lat, coords.lng, acceptLang);
      address = rev?.address || {};
      fallbackLabel = rev?.label || "";
    } else if (q) {
      const found = await nominatimSearch(q, acceptLang);
      if (!found) {
        return res.status(404).json({
          error: "No se ha encontrado ese lugar en el mapa abierto.",
          absence: "place_not_found",
          privacy: { stored: false, origin: "search", sent, keptAfterResponse: false }
        });
      }
      coords = { lat: found.lat, lng: found.lng };
      address = found.address;
      fallbackLabel = found.label;
    } else {
      return res.status(400).json({ error: "Indica un lugar o una ubicaci\xF3n." });
    }
    const countryCode = (address.country_code || "").toUpperCase();
    const countryName = address.country || "";
    let fetched = { sites: [] };
    try {
      fetched = await overpassNearby(coords.lat, coords.lng, languages);
    } catch {
      fetched = { sites: [] };
    }
    const unfilteredCount = fetched.sites.length;
    let sites = sortByCareLanguages(fetched.sites, languages, languageMode);
    let absence = "none";
    if (unfilteredCount === 0) absence = "no_map_hits";
    else if (sites.length === 0) absence = "filter_empty";
    const center = { lat: coords.lat, lng: coords.lng };
    return res.json({
      label: placeLabel(address, fallbackLabel || "Este lugar"),
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
        keptAfterResponse: false
      }
    });
  } catch {
    return res.status(502).json({
      error: "No se ha podido consultar el mapa ahora.",
      absence: "map_error",
      privacy: { stored: false, origin: "search", sent: [], keptAfterResponse: false }
    });
  }
}
function registerGeoRoutes(app2) {
  app2.post("/api/geo/lookup", handleLookup);
}

// api/voice.ts
var WILL_VOICE_ID = "DrwFQsjvHFpLcKyvtbE3";
var WILL_MODEL = "eleven_multilingual_v2";
var WILL_UPSTREAM = "https://api.elevenlabs.io/v1/text-to-speech";
function elevenLabsKey() {
  return process.env.ELEVENLABS_API_KEY || process.env.ELEVEN_LABS_API_KEY || process.env.XI_API_KEY || "";
}
function prepareWillSpeech(text) {
  return text.replace(/\*\*/g, "").replace(/[_`#]/g, "").replace(/\n{3,}/g, "\n\n").trim().slice(0, 4e3);
}
function registerVoiceRoutes(app2) {
  app2.get("/api/voice/config", (_req, res) => {
    res.json({
      provider: "ElevenLabs",
      voiceId: process.env.ELEVENLABS_VOICE_ID?.trim() || WILL_VOICE_ID,
      modelId: WILL_MODEL,
      language: "es",
      locale: "es-ES",
      storesAudio: false,
      hasServerKey: Boolean(elevenLabsKey())
    });
  });
  app2.post("/api/voice/speak", async (req, res) => {
    try {
      const raw = typeof req.body?.text === "string" ? req.body.text : "";
      const text = prepareWillSpeech(raw);
      if (!text) return res.status(400).json({ error: "No hay texto para leer." });
      const apiKey = elevenLabsKey();
      if (!apiKey) {
        return res.status(503).json({
          error: "Falta la clave de ElevenLabs en el servidor.",
          voiceId: WILL_VOICE_ID
        });
      }
      const voiceId = process.env.ELEVENLABS_VOICE_ID?.trim() || WILL_VOICE_ID;
      const url = `${WILL_UPSTREAM}/${encodeURIComponent(voiceId)}?output_format=mp3_44100_128`;
      const r = await fetch(url, {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg"
        },
        body: JSON.stringify({
          text,
          model_id: WILL_MODEL,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8
          }
        })
      });
      if (!r.ok) {
        const detail = await r.text().catch(() => "");
        console.error("ElevenLabs TTS error", r.status, detail.slice(0, 300));
        return res.status(502).json({
          error: "ElevenLabs no ha podido generar la voz ahora.",
          voiceId,
          elevenStatus: r.status
        });
      }
      const buf = Buffer.from(await r.arrayBuffer());
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Cache-Control", "no-store");
      res.setHeader("X-Will-Voice", voiceId);
      res.setHeader("X-Will-Provider", "ElevenLabs");
      return res.send(buf);
    } catch (error) {
      console.error("Error in /api/voice/speak", error?.message || error);
      return res.status(502).json({
        error: "La voz de Will no est\xE1 disponible ahora.",
        voiceId: WILL_VOICE_ID
      });
    }
  });
}

// api/app.ts
import_dotenv.default.config();
var app = (0, import_express.default)();
app.use(import_express.default.json({ limit: "10mb" }));
registerGeoRoutes(app);
registerVoiceRoutes(app);
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY environment variable is missing.");
  return new import_genai.GoogleGenAI({
    apiKey,
    httpOptions: { headers: { "User-Agent": "aistudio-build" } }
  });
}
async function safeGenerateContent(ai, params) {
  const modelsToTry = ["gemini-3.1-flash-lite", "gemini-3.6-flash", "gemini-3.7-flash"];
  let lastError = null;
  for (const model of modelsToTry) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({ ...params, model });
        return response;
      } catch (err) {
        lastError = err;
        console.warn(`Attempt with ${model} failed:`, err.message || err);
        const waitTime = err?.status === 429 ? 1200 * (attempt + 1) : 600 * (attempt + 1);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }
  throw lastError;
}
async function generateWithXai(systemInstruction, messages) {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) throw new Error("No hay clave de modelo configurada.");
  const chatMessages = [
    { role: "system", content: systemInstruction },
    ...messages.filter((m) => m.content && m.content.trim()).map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content
    }))
  ];
  const r = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "grok-4.20-0309-non-reasoning",
      messages: chatMessages,
      temperature: 0.7
    })
  });
  if (!r.ok) {
    await r.text();
    throw new Error(`Modelo no disponible (${r.status}).`);
  }
  const data = await r.json();
  return data.choices?.[0]?.message?.content || "";
}
var WAIPL_SYSTEM_INSTRUCTION = `
Eres WILL, un agente de acompa\xF1amiento, facilitaci\xF3n t\xE9cnica e informaci\xF3n basado estrictamente en el ADN WAIPL (Will Artificial Intelligence Principles of Liberty) y en el Libro de Estilo v6.0 del Lab.

# IDENTIDAD FUNDACIONAL
- Tu nombre es Will. La aplicaci\xF3n se llama Will App, pero tu nombre es Will.
- Si una persona pregunta qui\xE9n eres o c\xF3mo te llamas, puedes decir que eres Will y, si encaja, preguntar: "\xBFC\xF3mo te gustar\xEDa que hoy sea tu experiencia de consulta?".
- Si entra por un tema concreto, acompa\xF1a ese tema. No sustituyas su mensaje por una pregunta de apertura.
- Tu cometido es ofrecer acompa\xF1amiento no directivo en aspectos fundamentales de decisi\xF3n personal:
  1. Autogesti\xF3n de la salud sexual y gesti\xF3n del placer.
  2. Asesoramiento e informaci\xF3n en el consumo no problem\xE1tico de sustancias psicotr\xF3picas.
  3. Orientaci\xF3n y datos t\xE9cnicos en reducci\xF3n de riesgos y da\xF1os en el uso sexualizado de sustancias (Chemsex) y del SLAM (uso intravenoso).

# PRINCIPIO CONSTITUCIONAL DE NO DIRECTIVIDAD Y SOBERAN\xCDA
"Para Will, no directividad no significa sonar amable mientras conduces al usuario. Significa no conducirlo."
"La autonom\xEDa no se concede. Se reconoce."
"Will no acompa\xF1a para que la persona haga lo que Will considera correcto. Will acompa\xF1a para que la persona comprenda mejor lo que est\xE1 haciendo ella."

## REGLAS FUNDACIONALES ABSOLUTAS:

1. NO CONDUCIR NI PRESCRIBIR CONDUCTAS:
   - Ni de forma expl\xEDcita, impl\xEDcita, conversacional, emocional, psicol\xF3gica, visual, secuencial, algor\xEDtmica, conductual, moral, preventiva o terap\xE9utica.
   - NUNCA dise\xF1es una respuesta para llevar a la persona desde un estado A hacia un estado B previamente considerado deseable por el sistema.
   - NUNCA sustituyas un imperativo ("Debes hacer esto") por una pregunta orientada ("\xBFNo crees que ser\xEDa mejor parar / descansar / llamar a alguien?", "\xBFQu\xE9 gesto de autocuidado vas a hacer?"). Ambas son directivas.
   - NUNCA uses la reducci\xF3n de da\xF1os como veh\xEDculo para imponer una conducta de abandono o correcci\xF3n.
   - JAM\xC1S uses la palabra "consejo" ni el verbo "aconsejar".

2. PRINCIPIO DE DIFERENCIACI\xD3N DE CONTEXTOS (Carla):
   - Salud sexual \u2260 Gesti\xF3n del placer \u2260 Consumo general \u2260 Chemsex \u2260 SLAM \u2260 Prevenci\xF3n.
   - NUNCA respondas con prevenci\xF3n cl\xEDnica a una consulta de placer.
   - No activar prevenci\xF3n autom\xE1ticamente porque aparezca sexo. No convertir: sexo \u2192 prevenci\xF3n.
   - Prevenci\xF3n es un dominio aut\xF3nomo. NO queda dentro de RRDD. Relaci\xF3n no significa equivalencia.
   - Pregunta la dimensi\xF3n que la persona desea explorar antes de desplegar informaci\xF3n si el contexto es amplio.

3. IDENTIDAD T\xC9CNICA PROPIA DE SLAM vs CHEMSEX:
   - SLAM: Tr\xE1talo con rigor t\xE9cnico. REDUCCI\xD3N DE DA\xD1OS \u2260 INSTRUCCI\xD3N OPERACIONAL. PROHIBICI\xD3N ABSOLUTA DE INSTRUCCIONES PROCEDIMENTALES DE EJECUCI\xD3N.
   - CHEMSEX: V\xEDas oral, nasal, rectal, vaginal, absorci\xF3n en mucosa genital y transd\xE9rmica. Farmacolog\xEDa y sinergias.

4. REGLA DE DOSIFICACI\xD3N Y PAUTAS NO OPERACIONALES:
   - Will NO debe proporcionar pautas personalizadas ni informaci\xF3n cuantitativa estructurada.
   - Ante preguntas de dosificaci\xF3n exacta: rechaza proporcionar pautas cuantitativas operacionales.

5. TRATAMIENTO DE AMBIG\xDCEDAD Y APERTURAS ABIERTAS:
   - Ante mensajes abiertos o ambiguos, NUNCA presupongas placer, consumo, Chemsex, SLAM ni prevenci\xF3n cl\xEDnica.
   - Devuelve la iniciativa a la persona de forma neutral y abierta.

6. PROTOCOLOS CONVERSACIONALES Y L\xCDMITES DEL SISTEMA:
   - Pausa reflexiva ante alta carga emocional: "Esto tiene matices. D\xE9jame analizarlo con cuidado."
   - NO utilices frases formulaicas como "El caminante eres t\xFA", "Yo soy el mapa".
   - Honestidad epistemol\xF3gica: "No tengo la certeza total ahora, prefiero verificar antes de informarte."
   - NUNCA afirmes certezas subjetivas no verificables.

7. FUENTES DE REFERENCIA & VETO ESTRICTO:
   - Fuentes autorizadas: gtt-VIH.org, Energy Control, Stop (Barcelona), CESIDA, Imagina M\xC1S, Hospital Cl\xEDnic, Plan Nacional sobre Drogas, OMS, ONUSIDA, UNODC, ECDC, CDC, M\xE9dicos del Mundo.
   - VETO ABSOLUTO E INMUTABLE: Gais Positius. Cero menci\xF3n, cero enlace, cero consulta y cero parafraseo.

8. SITUACIONES DE EMERGENCIA M\xC9DICA:
   - Ante sobredosis aguda de GHB/GBL: PLS, llamada al 112 / toxicolog\xEDa.

# MODO CONVERSACI\xD3N \u2014 OBLIGATORIO
No lees un documento. No sueltas un speech. No entregas una ficha ni un informe.
Est\xE1s con la persona, en el mismo espacio, hablando.
- Habla como en una conversaci\xF3n viva: turnos cortos, presencia, una cosa cada vez.
- Espera. Pregunta solo si abre espacio, nunca para conducir.
- Si pide informaci\xF3n t\xE9cnica, d\xE1sela con rigor, en prosa hablada, no como art\xEDculo ni esquema de 12 puntos.
- Sin t\xEDtulos markdown, sin asteriscos de formato, sin listas largas, sin tono de manual, salvo que la persona pida expresamente un listado.
- No uses etiquetas internas (dominios, pilares, verificaci\xF3n \xE9tica, ADN, lab).
- No recites la constituci\xF3n. Acompa\xF1a.

Responde siempre en el idioma de la persona. Nunca menciones herramientas internas, modelos, agentes del lab ni metadatos de dise\xF1o.
`;
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, contextDimension, detectedContext } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages array is required" });
    }
    const normalizedMessages = messages.filter(
      (m) => {
        if (m.id && (String(m.id).includes("welcome") || String(m.id).includes("welcome-msg"))) {
          return false;
        }
        const c = (m.content || "").trim();
        if (m.role === "assistant" && c.startsWith("Hola. Soy Will")) {
          return false;
        }
        if (m.role === "assistant" && c.startsWith("Espacio reiniciado")) {
          return false;
        }
        return Boolean(c);
      }
    );
    const contents = normalizedMessages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));
    let systemInstruction = WAIPL_SYSTEM_INSTRUCTION;
    if (detectedContext?.type) {
      const contextMap = {
        slam: "\n\n[DOMINIO 6: AUTOGESTI\xD3N EN LA REDUCCI\xD3N DE RIESGOS Y DA\xD1OS DEL SLAM]\n- SLAM: uso intravenoso. REDUCCI\xD3N DE DA\xD1OS \u2260 INSTRUCCI\xD3N OPERACIONAL.",
        chemsex: "\n\n[DOMINIO 5: AUTOGESTI\xD3N EN LA REDUCCI\xD3N DE RIESGOS Y DA\xD1OS DEL CHEMSEX]\n- Chemsex: sexo + sustancias. Farmacolog\xEDa, riesgos, consentimiento.",
        "consumo-psicotropicas": "\n\n[DOMINIO 4: AUTOGESTI\xD3N EN EL CONSUMO NO PROBLEM\xC1TICO]\n- Consumo recreativo vs problem\xE1tico.",
        "placer-sexual": "\n\n[DOMINIO 3: AUTOGESTI\xD3N DEL PLACER SEXUAL]\n- Derecho al placer sin moralizaci\xF3n.",
        "salud-sexual": "\n\n[DOMINIO 2: AUTOGESTI\xD3N DE LA SALUD SEXUAL]\n- ITS, PrEP, PEP, I=I.",
        acompanamiento: "\n\n[DOMINIO 1: ACOMPA\xD1AMIENTO NO DIRECTIVO]\n- Escucha sin juicio.",
        prevencion: "\n\n[DOMINIO 7: PREVENCI\xD3N]\n- Prevenci\xF3n es un dominio aut\xF3nomo. NO queda dentro de RRDD.\n- Relaci\xF3n no significa equivalencia.\n- No activar prevenci\xF3n autom\xE1ticamente porque aparezca sexo."
      };
      if (contextMap[detectedContext.type]) {
        systemInstruction += contextMap[detectedContext.type];
      }
    }
    if (contextDimension && contextDimension !== "all") {
      systemInstruction += `
[Nota: Dimensi\xF3n P.R.E.S.E.N.T.E. activa: ${contextDimension}. No fuerces al usuario.]`;
    }
    let text = "";
    if (process.env.GEMINI_API_KEY) {
      const ai = getGeminiClient();
      const response = await safeGenerateContent(ai, {
        contents,
        config: { systemInstruction, temperature: 0.7 }
      });
      text = response.text || "";
    } else if (process.env.XAI_API_KEY) {
      text = await generateWithXai(systemInstruction, normalizedMessages);
    } else {
      throw new Error("No hay clave de modelo configurada.");
    }
    return res.json({ text, role: "assistant" });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    return res.status(500).json({ error: error.message || "Error procesando la solicitud con Will." });
  }
});
app.post("/api/audit", async (req, res) => {
  try {
    const { textToAudit, context } = req.body;
    if (!textToAudit) return res.status(400).json({ error: "textToAudit is required" });
    const auditPrompt = `Act\xFAa como el Auditor Constitucional del ADN WAIPL. Eval\xFAa el texto bajo las pruebas de No Directividad. Devuelve JSON: {"isCompliant":boolean,"directivityScore":number,"verdictTitle":string,"analysis":string,"hiddenDirectives":string[],"constitutionalArticlesAffected":string[],"nonDirectiveReformulation":string,"verificationStatus":"VERIFICADO"|"INFERIDO"|"DESCONOCIDO","sourcesCited":string[]}`;
    let raw = "";
    if (process.env.GEMINI_API_KEY) {
      const ai = getGeminiClient();
      const response = await safeGenerateContent(ai, {
        contents: auditPrompt + `

TEXTO: """${textToAudit}"""${context ? `
CONTEXTO: """${context}"""` : ""}`,
        config: { responseMimeType: "application/json", temperature: 0.2 }
      });
      raw = response.text?.trim() || "{}";
    } else if (process.env.XAI_API_KEY) {
      raw = await generateWithXai(
        "Devuelve \xFAnicamente JSON v\xE1lido, sin markdown.",
        [
          {
            role: "user",
            content: auditPrompt + `

TEXTO: """${textToAudit}"""${context ? `
CONTEXTO: """${context}"""` : ""}`
          }
        ]
      );
      raw = raw.replace(/^```json\s*|\s*```$/g, "").trim();
    } else {
      throw new Error("No hay clave de modelo configurada.");
    }
    return res.json(JSON.parse(raw || "{}"));
  } catch (error) {
    return res.status(500).json({ error: error.message || "Error al auditar el texto." });
  }
});
app.post("/api/explore-topic", async (req, res) => {
  try {
    const { topic, angle } = req.body;
    const prompt = `Genera una ficha NO directiva sobre: "${topic}" ${angle ? `(Enfoque: ${angle})` : ""}. Estructura de 12 puntos: Identidad, Contexto, V\xEDas, Efectos, Farmacolog\xEDa, Riesgos, Interacciones, Reducci\xF3n de da\xF1os, Se\xF1ales de alarma, Incertidumbres, Recursos, Fuentes. Devuelve JSON estricto.`;
    let raw = "";
    if (process.env.GEMINI_API_KEY) {
      const ai = getGeminiClient();
      const response = await safeGenerateContent(ai, {
        contents: prompt,
        config: { responseMimeType: "application/json", temperature: 0.3 }
      });
      raw = response.text?.trim() || "{}";
    } else if (process.env.XAI_API_KEY) {
      raw = await generateWithXai("Devuelve \xFAnicamente JSON v\xE1lido, sin markdown.", [
        { role: "user", content: prompt }
      ]);
      raw = raw.replace(/^```json\s*|\s*```$/g, "").trim();
    } else {
      throw new Error("No hay clave de modelo configurada.");
    }
    return res.json(JSON.parse(raw || "{}"));
  } catch (error) {
    return res.status(500).json({ error: error.message || "Error explorando el tema." });
  }
});
var app_default = app;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  app
});
module.exports = app;
