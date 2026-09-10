import React, { useState } from 'react';
import { MapPin, PhoneCall } from 'lucide-react';
import {
  GeoOrigin,
  GeoStatus,
  GeoLookupResult,
  lookupPlace,
  requestUserCoords,
} from '../utils/geolocation';
import { assertNoGeoPersistence } from '../utils/geoPrivacy';
import {
  LanguageFilterMode,
  SPOKEN_LANGUAGES,
  labelForLang,
} from '../data/spokenLanguages';
import { ResourceSiteCard } from './ResourceSiteCard';

interface NearbyResourcesProps {
  onAskWill: (prompt: string) => void;
}

export const NearbyResources: React.FC<NearbyResourcesProps> = ({ onAskWill }) => {
  const [geoStatus, setGeoStatus] = useState<GeoStatus>('idle');
  const [query, setQuery] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);
  const [languageMode, setLanguageMode] = useState<LanguageFilterMode>('prioritize');
  const [place, setPlace] = useState<GeoLookupResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [privacyLeaks, setPrivacyLeaks] = useState<string[]>([]);
  const [lastOrigin, setLastOrigin] = useState<GeoOrigin | null>(null);

  const toggleLang = (id: string) => {
    setLanguages((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id],
    );
  };

  const runLookup = async (
    body: { lat?: number; lng?: number; q?: string },
    origin: GeoOrigin,
  ) => {
    setGeoStatus('asking');
    setError(null);
    setLastOrigin(origin);
    try {
      const result = await lookupPlace({
        ...body,
        languages,
        languageMode,
        origin,
      });
      setPlace(result);
      setGeoStatus('ready');
    } catch (e: any) {
      setPlace(null);
      const absence = e?.absence as GeoStatus | undefined;
      setGeoStatus(absence === 'place_not_found' || absence === 'map_error' ? absence : 'unavailable');
      setError(e?.message || 'No se ha podido consultar el lugar.');
    } finally {
      setPrivacyLeaks(assertNoGeoPersistence());
    }
  };

  const askLocation = async () => {
    setGeoStatus('asking');
    setError(null);
    const result = await requestUserCoords();
    if (result.ok === false) {
      setGeoStatus(result.status);
      setPlace(null);
      setLastOrigin(null);
      setPrivacyLeaks(assertNoGeoPersistence());
      return;
    }
    const { lat, lng } = result;
    await runLookup({ lat, lng }, 'gps');
  };

  const searchPlace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    await runLookup({ q: query.trim() }, 'search');
  };

  const clearLookup = () => {
    setPlace(null);
    setLastOrigin(null);
    setGeoStatus('idle');
    setError(null);
    setPrivacyLeaks(assertNoGeoPersistence());
  };

  return (
    <div className="arch-glass p-4 sm:p-5 space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 flex items-center justify-center text-[#e8c37a] shrink-0 border border-[rgba(232,195,122,0.35)]">
          <MapPin className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-serif font-bold will-copy">Cerca de ti, en cualquier lugar</h2>
          <p className="text-xs will-copy-muted mt-0.5 leading-relaxed">
            Will permanece en español. El filtro de abajo es el idioma de atención que pides, no
            el idioma de la aplicación. Un nombre en inglés no prueba que atiendan en inglés.
            La ubicación no se guarda.
          </p>
        </div>
      </div>

      <form onSubmit={searchPlace} className="flex flex-col sm:flex-row gap-2">
        <label className="sr-only" htmlFor="geo-search">
          Buscar ciudad, región, país o un lugar concreto
        </label>
        <input
          id="geo-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ciudad, región, país o lugar: Tokio, Laponia, Ushuaia…"
          className="flex-1 min-w-0 bg-stone-950/50 border border-stone-800 px-3 py-2 text-xs text-[#ead6b4] placeholder:text-stone-500 focus:outline-none focus:border-[rgba(232,195,122,0.45)]"
        />
        <button
          type="submit"
          disabled={geoStatus === 'asking'}
          className="px-3 py-2 text-xs font-medium border border-[rgba(232,195,122,0.45)] text-[#e8c37a] hover:bg-[rgba(232,195,122,0.08)] disabled:opacity-60"
        >
          Buscar
        </button>
      </form>

      <div className="space-y-2">
        <p className="text-[11px] uppercase tracking-wide text-[#e8c37a]" id="lang-filter-label">
          Idioma de atención que pides
        </p>
        <div className="flex flex-wrap gap-1.5" role="group" aria-labelledby="lang-filter-label">
          {SPOKEN_LANGUAGES.map((lang) => {
            const on = languages.includes(lang.id);
            return (
              <button
                key={lang.id}
                type="button"
                aria-pressed={on}
                onClick={() => toggleLang(lang.id)}
                className={`px-2 py-1 text-[11px] border ${
                  on
                    ? 'border-[#e8c37a] text-[#e8c37a] bg-[rgba(232,195,122,0.08)]'
                    : 'border-stone-800 text-stone-400 hover:text-[#ead6b4]'
                }`}
              >
                {lang.label}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={languageMode === 'prioritize'}
            onClick={() => setLanguageMode('prioritize')}
            className={`px-2 py-1 text-[11px] border ${
              languageMode === 'prioritize'
                ? 'border-[#e8c37a] text-[#e8c37a]'
                : 'border-stone-800 text-stone-400'
            }`}
          >
            Priorizar
          </button>
          <button
            type="button"
            aria-pressed={languageMode === 'only'}
            onClick={() => setLanguageMode('only')}
            className={`px-2 py-1 text-[11px] border ${
              languageMode === 'only'
                ? 'border-[#e8c37a] text-[#e8c37a]'
                : 'border-stone-800 text-stone-400'
            }`}
          >
            Solo estos idiomas
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={askLocation}
          disabled={geoStatus === 'asking'}
          className="px-3 py-2 text-xs font-medium border border-[rgba(232,195,122,0.45)] text-[#e8c37a] hover:bg-[rgba(232,195,122,0.08)] disabled:opacity-60"
        >
          {geoStatus === 'asking' ? 'Buscando…' : 'Usar mi ubicación'}
        </button>
        {(place || lastOrigin) && (
          <button
            type="button"
            onClick={clearLookup}
            className="px-3 py-2 text-xs font-medium border border-stone-800 text-stone-300 hover:text-[#ead6b4]"
          >
            Olvidar esta consulta
          </button>
        )}
      </div>

      {geoStatus === 'denied' && (
        <p className="text-xs will-copy-muted" role="status">
          Has rechazado el permiso. Busca la ciudad a mano. Nada se ha guardado. Eso no significa
          que no existan recursos.
        </p>
      )}
      {geoStatus === 'unavailable' && !error && (
        <p className="text-xs will-copy-muted" role="status">
          Este dispositivo o esta ventana no permiten leer la ubicación. Busca la ciudad a mano.
        </p>
      )}
      {geoStatus === 'place_not_found' && (
        <p className="text-xs will-copy-muted" role="status">
          El mapa abierto no reconoce ese texto como lugar. Prueba con otra grafía. No haberlo
          encontrado aquí no significa que el lugar no exista.
        </p>
      )}
      {geoStatus === 'map_error' && (
        <p className="text-xs will-copy-muted" role="status">
          No se ha podido consultar el mapa ahora. El fallo es técnico, no una prueba de que no
          haya recursos.
        </p>
      )}
      {error && geoStatus !== 'place_not_found' && geoStatus !== 'map_error' && (
        <p className="text-xs will-copy-muted" role="status">
          {error}
        </p>
      )}

      {place && (
        <div className="space-y-3 pt-1">
          <div>
            <p className="text-sm font-serif will-copy">{place.label}</p>
            <p className="text-[11px] will-copy-muted mt-0.5">
              {place.origin === 'gps'
                ? 'Consulta desde tu ubicación de este momento. No queda como «tu sitio».'
                : `Búsqueda: ${place.label}. Esto no es tu ubicación.`}
            </p>
            {place.emergency.numbers.length > 0 && (
              <p className="text-xs will-copy-muted mt-1 flex items-center gap-1.5">
                <PhoneCall className="w-3 h-3 text-[#e8c37a]" aria-hidden="true" />
                Emergencias: {place.emergency.numbers.join(' · ')}. {place.emergency.note}
              </p>
            )}
          </div>

          {place.mapEmbedUrl && (
            <div className="overflow-hidden border border-[rgba(232,195,122,0.18)] h-52 sm:h-64">
              <iframe
                title={`Mapa de ${place.label}`}
                src={place.mapEmbedUrl}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          {place.absence === 'no_map_hits' && (
            <p className="text-xs will-copy-muted" role="status">
              El mapa abierto no ha devuelto centros en este punto. Eso no significa que no existan
              recursos. El teléfono de emergencias sigue siendo el camino más directo.
            </p>
          )}
          {place.absence === 'filter_empty' && (
            <p className="text-xs will-copy-muted" role="status">
              Hay {place.unfilteredCount} lugares en el mapa, pero ninguno con indicio de atención
              en {languages.map(labelForLang).join(', ')}. La ausencia de coincidencia no es
              ausencia de recurso. Prueba Priorizar o quita el filtro.
            </p>
          )}

          {place.sites.length > 0 && (
            <ul className="grid sm:grid-cols-2 gap-3">
              {place.sites.map((site) => (
                <li key={`${site.name}-${site.km}-${site.lat}`}>
                  <ResourceSiteCard
                    site={site}
                    requested={languages}
                    onAskWill={onAskWill}
                  />
                </li>
              ))}
            </ul>
          )}

          <p className="text-[10px] will-copy-muted">
            Esta consulta no se ha guardado.
            {place.privacy.sent.length
              ? ` Se ha enviado a ${place.privacy.sent.map((s) => s.service).join(', ')}: ${place.privacy.sent
                  .flatMap((s) => s.fields)
                  .join(', ')}.`
              : ''}
          </p>
        </div>
      )}

      {privacyLeaks.length > 0 && (
        <p className="text-xs text-[#e8c37a]" role="alert">
          Aviso de privacidad: se ha detectado un rastro de ubicación en el navegador.
        </p>
      )}
    </div>
  );
};
