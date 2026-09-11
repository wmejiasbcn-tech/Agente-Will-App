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

// api/willHealthSites.ts
var WILL_HEALTH_SITES = [
  {
    name: "BCN Checkpoint",
    kind: "Salud sexual comunitaria",
    category: "community",
    lat: 41.3789,
    lng: 2.1625,
    address: "Carrer de Comte Borrell, 164-166, Barcelona",
    website: "https://www.bcncheckpoint.com",
    city: "Barcelona",
    audience: "Atenci\xF3n espec\xEDfica a hombres que tienen sexo con hombres y mujeres trans."
  },
  {
    name: "Stop",
    kind: "Salud sexual y apoyo comunitario",
    category: "community",
    lat: 41.3816,
    lng: 2.1708,
    address: "Barcelona",
    website: "https://stop.org.es",
    city: "Barcelona",
    audience: "Atenci\xF3n espec\xEDfica a hombres gais, bisexuales y otros HSH."
  },
  {
    name: "CJAS \u2014 Centre Jove d\u2019Atenci\xF3 a les Sexualitats",
    kind: "Salud sexual",
    category: "health",
    lat: 41.3729,
    lng: 2.1658,
    address: "Carrer de Vit\xF2ria, 7, Barcelona",
    website: "https://www.cjas.org",
    city: "Barcelona",
    audience: "Atenci\xF3n espec\xEDfica a j\xF3venes."
  },
  {
    name: "Unitat d\u2019ITS Drassanes",
    kind: "Centro sanitario / ITS",
    category: "health",
    lat: 41.3757,
    lng: 2.1754,
    address: "Avinguda de les Drassanes, 17-21, Barcelona",
    city: "Barcelona",
    audience: "Atenci\xF3n a poblaci\xF3n general. Salud sexual e ITS."
  },
  {
    name: "Parc Sanitari Pere Virgili",
    kind: "Centro sociosanitario",
    category: "health",
    lat: 41.4186,
    lng: 2.1418,
    address: "Carrer d\u2019Esteve Terradas, 30, Barcelona",
    website: "https://www.perevirgili.cat",
    city: "Barcelona",
    audience: "Atenci\xF3n a poblaci\xF3n general. Centro sociosanitario."
  },
  {
    name: "Energy Control (ABD)",
    kind: "Reducci\xF3n de riesgos y da\xF1os",
    category: "community",
    lat: 41.4032,
    lng: 2.1618,
    address: "Barcelona",
    website: "https://energycontrol.org",
    city: "Barcelona",
    audience: "Atenci\xF3n a poblaci\xF3n general. An\xE1lisis de sustancias y reducci\xF3n de da\xF1os."
  },
  {
    name: "Hospital Cl\xEDnic de Barcelona",
    kind: "Urgencias / Hospital",
    category: "emergency",
    lat: 41.3888,
    lng: 2.1519,
    address: "Carrer de Villarroel, 170, Barcelona",
    city: "Barcelona",
    audience: "Atenci\xF3n a poblaci\xF3n general."
  },
  {
    name: "Centro Sanitario Sandoval",
    kind: "Centro sanitario / ITS",
    category: "health",
    lat: 40.4305,
    lng: -3.7034,
    address: "Calle de Sandoval, 7, Madrid",
    city: "Madrid",
    audience: "Atenci\xF3n a poblaci\xF3n general. Unidad de ITS."
  },
  {
    name: "Checkpoint Madrid",
    kind: "Salud sexual comunitaria",
    category: "community",
    lat: 40.4215,
    lng: -3.6998,
    address: "Madrid",
    website: "https://checkpointmadrid.org",
    city: "Madrid",
    audience: "Atenci\xF3n espec\xEDfica a hombres que tienen sexo con hombres y mujeres trans."
  },
  {
    name: "Acci\xF3n Solidaria",
    kind: "ONG / VIH y apoyo comunitario",
    category: "community",
    lat: 10.4965,
    lng: -66.8515,
    address: "Avenida Francisco de Miranda, Chacao, Caracas",
    website: "https://accionsolidaria.info",
    city: "Caracas",
    audience: "Atenci\xF3n a poblaci\xF3n general. VIH y apoyo comunitario."
  },
  {
    name: "ACCSI \u2014 Acci\xF3n Ciudadana Contra el SIDA",
    kind: "ONG / VIH",
    category: "community",
    lat: 10.4982,
    lng: -66.849,
    address: "Altamira, Caracas",
    city: "Caracas",
    audience: "Atenci\xF3n a poblaci\xF3n general. VIH."
  },
  {
    name: "StopVIH",
    kind: "ONG / VIH y salud sexual",
    category: "community",
    lat: 10.492,
    lng: -66.879,
    address: "Caracas",
    website: "https://stopvih.org",
    city: "Caracas",
    audience: "Atenci\xF3n a poblaci\xF3n general. VIH y salud sexual."
  },
  {
    name: "Red Venezolana de Gente Positiva",
    kind: "ONG / apoyo entre iguales",
    category: "community",
    lat: 10.5,
    lng: -66.87,
    address: "Caracas",
    city: "Caracas",
    audience: "Atenci\xF3n a poblaci\xF3n general. Apoyo entre iguales en VIH."
  },
  {
    name: "Venezuela Diversa",
    kind: "ONG / LGBTIQ+ y salud",
    category: "community",
    lat: 10.488,
    lng: -66.879,
    address: "Caracas",
    city: "Caracas",
    audience: "Atenci\xF3n espec\xEDfica a personas LGBTIQ+."
  },
  {
    name: "Hospital Vargas de Caracas",
    kind: "Hospital p\xFAblico",
    category: "emergency",
    lat: 10.5055,
    lng: -66.9172,
    address: "San Jos\xE9, Caracas",
    city: "Caracas",
    audience: "Atenci\xF3n a poblaci\xF3n general. Hospital p\xFAblico."
  }
];
var CIVIC = /cívic[oa]?|\bcivic\b|casal\b|ateneu|biblioteca|centro cultural|cultural centre|casa de cultura|maison de la culture|teatro|\btheatre\b|\bcine\b|polideportiv|sport centre|arts centre|centro de barrio/i;
var THEME = /checkpoint|cjas|drassanes|sandoval|stop sida|energy control|salud sexual|sexual health|saúde sexual|santé sexuelle|\bits\b|\bvih\b|\bhiv\b|\bsida\b|\baids\b|\bprep\b|chemsex|reducción de dañ|reduccion de dan|harm reduction|pere virgili|infectolog|drogodepend|\bcas\b|jeringuill|needle exchange|salud mental|mental health|addiction|lgbt|lgtbi|lgtb|diversidad sexual|acción solidaria|accsi|stopvih|gente positiva|venezuela diversa|reflejos de venezuela|aliansa|trabajadoras sexuales|sex worker|derechos sexuales|salud comunitaria|cruz roja|médicos del mundo|doctors of the world|onusida|unaids/i;
function isCivicOrCulturalName(name) {
  return CIVIC.test(name);
}
function isWillThemeName(name) {
  return THEME.test(name);
}
function isMaternityName(name) {
  return /maternidad|maternity|materno.?infantil|gineco.?obstetr|obstetric/i.test(name);
}
function isPrivateCare(tags, name) {
  const op = (tags?.["operator:type"] || tags?.operator || "").toLowerCase();
  if (tags?.fee === "yes") return true;
  if (op === "private" || /\bprivate\b/.test(op)) return true;
  return /clínica caracas|teknon|quirónsalud|quiron|centro médico de caracas|policínica metropolitana/i.test(name);
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
  const a = (tags?.amenity || tags?.healthcare || tags?.office || "").toLowerCase();
  const spec = (tags?.["healthcare:speciality"] || tags?.social_facility || "").toLowerCase();
  const name = tags?.name || "";
  if (a === "community_centre" || a === "arts_centre" || a === "library" || a === "theatre") {
    return { kind: "Fuera de \xE1mbito", category: "other" };
  }
  if (isWillThemeName(name) || /infect|hiv|sexual|addict|psychiatr/.test(spec)) {
    if (a === "hospital") return { kind: "Urgencias / Hospital", category: "emergency" };
    if (/drug|addict|chemsex|dañ|harm/.test(spec + name.toLowerCase())) {
      return { kind: "Reducci\xF3n de riesgos y da\xF1os", category: "community" };
    }
    return { kind: "Salud sexual / sociosanitario", category: "health" };
  }
  if (a === "hospital" || tags?.emergency === "yes" || tags?.healthcare === "hospital") {
    return { kind: "Urgencias / Hospital", category: "emergency" };
  }
  if (a === "clinic" || a === "doctors" || a === "doctor" || a === "health_centre" || tags?.healthcare === "clinic" || tags?.healthcare === "centre" || tags?.healthcare === "center") {
    return { kind: "Centro sanitario", category: "health" };
  }
  if (a === "pharmacy" || a === "dentist" || a === "veterinary") {
    return { kind: "Farmacia", category: "other" };
  }
  if (spec === "drug_addiction" || spec === "mental_health") {
    return { kind: "Centro sociosanitario", category: "community" };
  }
  if (a === "ngo" || a === "association" || a === "charity" || tags?.office === "ngo") {
    return { kind: "ONG / recurso comunitario", category: "community" };
  }
  return { kind: "Otro recurso", category: "other" };
}
function rejectSite(tags, name) {
  const a = (tags.amenity || tags.healthcare || tags.office || "").toLowerCase();
  if (["pharmacy", "dentist", "veterinary", "community_centre", "arts_centre", "library", "theatre", "townhall"].includes(a)) {
    return true;
  }
  if (isCivicOrCulturalName(name)) return true;
  if ((a === "ngo" || a === "association" || a === "charity" || tags.office === "ngo") && !isWillThemeName(name)) {
    const spec = `${tags.healthcare || ""} ${tags.social_facility || ""} ${tags["healthcare:speciality"] || ""}`.toLowerCase();
    if (!/infect|hiv|sexual|addict|psychiatr|health/.test(spec)) return true;
  }
  return false;
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
var PHOTON = "https://photon.komoot.io";
async function photonSearch(q) {
  const url = `${PHOTON}/api/?limit=1&q=${encodeURIComponent(q)}`;
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  if (!r.ok) return null;
  const data = await r.json();
  const hit = data?.features?.[0];
  if (!hit?.geometry?.coordinates) return null;
  const [lng, lat] = hit.geometry.coordinates;
  const props = hit.properties || {};
  return {
    lat: Number(lat),
    lng: Number(lng),
    label: [props.name, props.city, props.country].filter(Boolean).join(", ") || q,
    address: {
      country: props.country,
      country_code: props.countrycode,
      city: props.city || props.name
    }
  };
}
async function geocodeSearch(q, acceptLang) {
  return await nominatimSearch(q, acceptLang) || photonSearch(q);
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
  if (rejectSite(tags, name)) return null;
  const layers = extractLanguageLayers(tags);
  const { kind, category } = classify(tags);
  if (kind === "Fuera de \xE1mbito" || kind === "Farmacia") return null;
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
    },
    privateCare: isPrivateCare(tags, name),
    maternity: isMaternityName(name)
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
  sites.sort((a, b) => rankSite(a) - rankSite(b) || a.km - b.km);
  return { sites: mixSites(sites.filter((s) => s.kind !== "Farmacia")), checkedAt };
}
function rankSite(site) {
  if (isWillThemeName(site.name) || /ONG|salud sexual|sociosanitario|reducción de riesgos|apoyo comunitario/i.test(site.kind)) {
    return 0;
  }
  if (site.category === "community") return 1;
  if (site.maternity || site.privateCare) return 5;
  if (site.category === "health") return 2;
  if (site.category === "emergency") return 3;
  return 4;
}
function mixSites(sites) {
  const theme = sites.filter((s) => rankSite(s) <= 1);
  const health = sites.filter((s) => s.category === "health" && rankSite(s) > 1);
  const publicH = sites.filter((s) => s.category === "emergency" && !s.privateCare && !s.maternity);
  const rest = sites.filter((s) => !theme.includes(s) && !health.includes(s) && !publicH.includes(s));
  const out = [];
  const push = (list, n) => {
    for (const s of list) {
      if (out.length >= 24) break;
      if (out.includes(s)) continue;
      if (n-- <= 0) break;
      out.push(s);
    }
  };
  push(theme, 12);
  push(health, 6);
  push(publicH, 4);
  push(rest, 2);
  return out.slice(0, 24);
}
async function overpassNearby(lat, lng, preferred) {
  const query = `[out:json][timeout:22];
(
  nwr["office"="ngo"](around:15000,${lat},${lng});
  nwr["office"="association"](around:15000,${lat},${lng});
  nwr["office"="charity"](around:15000,${lat},${lng});
  nwr["amenity"="hospital"](around:12000,${lat},${lng});
  nwr["healthcare"="hospital"](around:12000,${lat},${lng});
  nwr["amenity"="clinic"](around:12000,${lat},${lng});
  nwr["healthcare"="clinic"](around:12000,${lat},${lng});
  nwr["amenity"="doctors"](around:12000,${lat},${lng});
  nwr["amenity"="health_centre"](around:12000,${lat},${lng});
  nwr["healthcare"="centre"](around:12000,${lat},${lng});
  nwr["social_facility"="drug_addiction"](around:15000,${lat},${lng});
  nwr["social_facility"="mental_health"](around:15000,${lat},${lng});
  nwr["healthcare:speciality"~"infect|hiv|sexual|addict|psychiatr|dermatol",i](around:15000,${lat},${lng});
  nwr["name"~"checkpoint|salud sexual|sexual health|ITS|VIH|HIV|SIDA|LGBT|LGTB|PrEP|chemsex|harm reduction|reducci\xF3n de da\xF1os|solidaria|positivo|diversa|CJAS|Drassanes|Sandoval",i](around:15000,${lat},${lng});
);
out center 100;`;
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
  const queries = ["ONG VIH", "HIV NGO", "sexual health", "LGBT health", "hospital", "clinic"];
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
  sites.sort((a, b) => rankSite(a) - rankSite(b) || a.km - b.km);
  return { sites: sites.filter((s) => s.kind !== "Farmacia").slice(0, 24) };
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
      const found = await geocodeSearch(q, acceptLang);
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
      const found = await geocodeSearch(q, acceptLang);
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
    const curated = WILL_HEALTH_SITES.filter((s) => {
      const km = distanceKm(coords, { lat: s.lat, lng: s.lng });
      return km <= 25;
    }).map((s) => ({
      name: s.name,
      kind: s.kind,
      category: s.category,
      km: Math.round(distanceKm(coords, { lat: s.lat, lng: s.lng }) * 10) / 10,
      address: s.address,
      website: s.website,
      mapsUrl: `https://www.openstreetmap.org/?mlat=${s.lat}&mlon=${s.lng}#map=16/${s.lat}/${s.lng}`,
      careLanguages: [],
      nameLanguages: [],
      lat: s.lat,
      lng: s.lng,
      source: { name: "Directorio Will", url: s.website || "https://www.openstreetmap.org/" },
      audience: s.audience
    }));
    const merged = [...curated];
    const seen = new Set(curated.map((s) => s.name.toLowerCase()));
    for (const s of fetched.sites) {
      if (seen.has(s.name.toLowerCase())) continue;
      seen.add(s.name.toLowerCase());
      merged.push(s);
    }
    merged.sort((a, b) => rankSite(a) - rankSite(b) || a.km - b.km);
    const mixed = mixSites(merged);
    const unfilteredCount = mixed.length;
    let sites = sortByCareLanguages(mixed, languages, languageMode);
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
async function handleGeocode(req, res) {
  try {
    const q = typeof req.body?.q === "string" ? req.body.q.trim().slice(0, 80) : "";
    const origin = req.body?.origin === "gps" ? "gps" : "search";
    const coords = validCoord(req.body?.lat, req.body?.lng);
    const sent = [];
    let found = null;
    if (q) {
      sent.push({ service: "nominatim.openstreetmap.org", fields: ["q"] });
      found = await geocodeSearch(q, "es,en");
      if (!found) sent.push({ service: "photon.komoot.io", fields: ["q"] });
    } else if (coords && origin === "gps") {
      sent.push({ service: "nominatim.openstreetmap.org", fields: ["lat", "lng"] });
      const rev = await nominatimReverse(coords.lat, coords.lng, "es,en");
      found = {
        lat: coords.lat,
        lng: coords.lng,
        label: rev?.label || `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`,
        address: rev?.address || {}
      };
    } else {
      return res.status(400).json({ error: "Indica un lugar o una ubicaci\xF3n." });
    }
    if (!found) {
      return res.status(404).json({
        error: "No hemos encontrado resultados para esta b\xFAsqueda.",
        absence: "place_not_found",
        privacy: { stored: false, origin, sent, keptAfterResponse: false }
      });
    }
    return res.json({
      lat: found.lat,
      lng: found.lng,
      label: placeLabel(found.address, found.label),
      countryCode: (found.address?.country_code || "").toUpperCase(),
      countryName: found.address?.country || "",
      origin,
      privacy: { stored: false, origin, sent, keptAfterResponse: false }
    });
  } catch {
    return res.status(502).json({
      error: "No se ha podido consultar el lugar ahora.",
      absence: "map_error",
      privacy: { stored: false, origin: "search", sent: [], keptAfterResponse: false }
    });
  }
}
function registerGeoRoutes(app2) {
  app2.post("/api/geo/lookup", handleLookup);
  app2.post("/api/geo/geocode", handleGeocode);
}

// api/voice.ts
function elevenLabsKey() {
  const raw = process.env.ELEVENLABS_API_KEY || process.env.ELEVEN_LABS_API_KEY || process.env.XI_API_KEY || "";
  const key = String(raw).replace(/^\uFEFF/, "").trim().replace(/^Bearer\s+/i, "").replace(/^['"]+|['"]+$/g, "").trim();
  if (!key || key.length < 20) return "";
  if (/^(MY_|YOUR_|CHANGE|TODO|PLACEHOLDER|xxx)/i.test(key)) return "";
  return key;
}
var WILL_VOICE_ID = "DrwFQsjvHFpLcKyvtbE3";
var WILL_MODEL = "eleven_multilingual_v2";
var WILL_TTS = "https://api.elevenlabs.io/v1/text-to-speech";
function elevenLabsIdentity() {
  return {
    provider: "ElevenLabs",
    voiceId: WILL_VOICE_ID,
    modelId: WILL_MODEL,
    language: "es",
    locale: "es-ES",
    storesAudio: false
  };
}
function classifyEleven(status, body) {
  let reason = "";
  try {
    const parsed = JSON.parse(body);
    const detail = parsed?.detail;
    if (typeof detail === "string") reason = detail;
    else if (detail && typeof detail === "object") {
      reason = String(detail.status || detail.message || "");
    } else if (parsed?.status) {
      reason = String(parsed.status);
    }
  } catch {
    reason = body.slice(0, 120);
  }
  const blob = `${status} ${reason}`.toLowerCase();
  if (status === 401 || /invalid_api_key|unauthorized/.test(blob)) return "auth";
  if (status === 404 || /voice_not_found/.test(blob)) return "voice";
  if (status === 402 || status === 429 || /quota|credits|limit|concurrency/.test(blob)) {
    return "quota";
  }
  if (status === 422) return "request";
  return "upstream";
}
function userErrorFor(kind) {
  if (kind === "auth") return "La voz de Will no est\xE1 disponible ahora.";
  if (kind === "quota") return "La voz de Will no est\xE1 disponible ahora por l\xEDmite de uso.";
  if (kind === "voice") return "La voz de Will no est\xE1 accesible ahora.";
  return "La voz de Will no se ha podido generar ahora.";
}
async function requestWillSpeech(apiKey, text) {
  const url = `${WILL_TTS}/${encodeURIComponent(WILL_VOICE_ID)}?output_format=mp3_44100_128`;
  const headers = {
    "xi-api-key": apiKey,
    "Content-Type": "application/json",
    Accept: "audio/mpeg"
  };
  const body = JSON.stringify({
    text,
    model_id: WILL_MODEL,
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.8
    }
  });
  const once = () => fetch(url, {
    method: "POST",
    headers,
    body,
    signal: AbortSignal.timeout(2e4)
  });
  let r = await once();
  if (r.status === 429 || r.status >= 500) {
    await new Promise((ok) => setTimeout(ok, 600));
    r = await once();
  }
  return r;
}
function prepareWillSpeech(text) {
  return text.replace(/\*\*/g, "").replace(/[_`#]/g, "").replace(/\n{3,}/g, "\n\n").trim().slice(0, 4e3);
}
function mimeToName(mime) {
  if (mime.includes("mp4") || mime.includes("m4a") || mime.includes("aac")) return "will.m4a";
  if (mime.includes("ogg")) return "will.ogg";
  if (mime.includes("mpeg") || mime.includes("mp3")) return "will.mp3";
  if (mime.includes("wav")) return "will.wav";
  return "will.webm";
}
function registerVoiceRoutes(app2) {
  app2.get("/api/voice/config", (_req, res) => {
    res.json({
      ...elevenLabsIdentity(),
      listen: Boolean(elevenLabsKey()),
      hasServerKey: Boolean(elevenLabsKey())
    });
  });
  app2.post("/api/voice/listen", async (req, res) => {
    try {
      const apiKey = elevenLabsKey();
      if (!apiKey) {
        return res.status(503).json({ error: "El reconocimiento de voz no est\xE1 disponible ahora." });
      }
      const rawAudio = typeof req.body?.audio === "string" ? req.body.audio : "";
      const b64 = rawAudio.replace(/^data:[^;]+;base64,/, "");
      const buf = b64 ? Buffer.from(b64, "base64") : Buffer.alloc(0);
      if (buf.length < 200) {
        return res.status(400).json({ error: "No ha llegado audio." });
      }
      const mime = typeof req.body?.mime === "string" && req.body.mime ? req.body.mime : "audio/webm";
      const form = new FormData();
      form.append("model_id", "scribe_v2");
      form.append("language_code", "es");
      form.append("tag_audio_events", "false");
      form.append("file", new Blob([new Uint8Array(buf)], { type: mime }), mimeToName(mime));
      let r = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
        method: "POST",
        headers: { "xi-api-key": apiKey },
        body: form
      });
      if (!r.ok) {
        const retry = new FormData();
        retry.append("model_id", "scribe_v1");
        retry.append("language_code", "es");
        retry.append("tag_audio_events", "false");
        retry.append("file", new Blob([new Uint8Array(buf)], { type: mime }), mimeToName(mime));
        r = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
          method: "POST",
          headers: { "xi-api-key": apiKey },
          body: retry
        });
      }
      if (!r.ok) {
        const detail = await r.text().catch(() => "");
        console.error("STT error", r.status, detail.slice(0, 300));
        return res.status(502).json({ error: "No he podido pasar a escrito lo que has dicho ahora." });
      }
      const data = await r.json();
      const text = String(data?.text || "").replace(/\s+/g, " ").trim();
      return res.json({ text, storesAudio: false });
    } catch (error) {
      console.error("Error in /api/voice/listen", error?.message || error);
      return res.status(502).json({ error: "No he podido pasar a escrito lo que has dicho ahora." });
    }
  });
  app2.post("/api/voice/speak", async (req, res) => {
    try {
      const raw = typeof req.body?.text === "string" ? req.body.text : "";
      const text = prepareWillSpeech(raw);
      if (!text) return res.status(400).json({ error: "No hay texto para leer." });
      const apiKey = elevenLabsKey();
      if (!apiKey) {
        console.error("TTS speak", { reason: "no_tts_key", voiceId: WILL_VOICE_ID });
        return res.status(503).json({
          error: "La voz de Will no est\xE1 disponible ahora.",
          code: "SERVER",
          reason: "no_tts_key",
          voiceId: WILL_VOICE_ID,
          provider: "ElevenLabs"
        });
      }
      const r = await requestWillSpeech(apiKey, text);
      if (!r.ok) {
        const detail = await r.text().catch(() => "");
        const kind = classifyEleven(r.status, detail);
        console.error("ElevenLabs TTS error", r.status, kind, detail.slice(0, 300));
        return res.status(502).json({
          error: userErrorFor(kind),
          voiceId: WILL_VOICE_ID,
          provider: "ElevenLabs",
          reason: kind,
          status: r.status
        });
      }
      const audio = Buffer.from(await r.arrayBuffer());
      if (audio.length < 200) {
        return res.status(502).json({
          error: "La voz de Will no se ha podido generar ahora.",
          voiceId: WILL_VOICE_ID,
          provider: "ElevenLabs",
          reason: "empty"
        });
      }
      res.status(200);
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Cache-Control", "no-store");
      res.setHeader("Content-Length", String(audio.length));
      res.setHeader("X-Will-Voice", WILL_VOICE_ID);
      res.setHeader("X-Will-Provider", "ElevenLabs");
      return res.end(audio);
    } catch (error) {
      console.error("Error in /api/voice/speak", error?.message || error);
      return res.status(502).json({
        error: "La voz de Will no est\xE1 disponible ahora.",
        voiceId: WILL_VOICE_ID,
        provider: "ElevenLabs",
        reason: "exception",
        detail: String(error?.message || error).slice(0, 300)
      });
    }
  });
}

// api/app.ts
import_dotenv.default.config();
var app = (0, import_express.default)();
app.use(import_express.default.json({ limit: "12mb" }));
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
