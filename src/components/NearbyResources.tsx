import React, { useState } from 'react';
import { MapPin, PhoneCall, ExternalLink } from 'lucide-react';
import {
  GeoStatus,
  GeoLookupResult,
  lookupPlace,
  requestUserCoords,
} from '../utils/geolocation';
import { assertNoGeoPersistence } from '../utils/geoPrivacy';
import {
  LanguageFilterMode,
  SPOKEN_LANGUAGES,
} from '../data/spokenLanguages';

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

  const toggleLang = (id: string) => {
    setLanguages((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id],
    );
  };

  const runLookup = async (body: { lat?: number; lng?: number; q?: string }) => {
    setGeoStatus('asking');
    setError(null);
    try {
      const result = await lookupPlace({
        ...body,
        languages,
        languageMode,
      });
      setPlace(result);
      setGeoStatus('ready');
    } catch (e: any) {
      setPlace(null);
      setGeoStatus('unavailable');
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
      setPrivacyLeaks(assertNoGeoPersistence());
      return;
    }
    const { lat, lng } = result;
    await runLookup({ lat, lng });
  };

  const searchPlace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    await runLookup({ q: query.trim() });
  };

  return (
    <div className="arch-glass p-4 sm:p-5 space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 flex items-center justify-center text-[#e8c37a] shrink-0 border border-[rgba(232,195,122,0.35)]">
          <MapPin className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-serif font-bold will-copy">Cerca de ti, en cualquier lugar</h2>
          <p className="text-xs will-copy-muted mt-0.5 leading-relaxed">
            El mapa es OpenStreetMap. Will no guarda tu ubicación. Filtra por idioma si necesitas
            que te atiendan en una lengua concreta.
          </p>
        </div>
      </div>

      <form onSubmit={searchPlace} className="flex flex-col sm:flex-row gap-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busca una ciudad o un lugar: Tokio, Ushuaia, Lagos…"
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
        <p className="text-[11px] uppercase tracking-wide text-[#e8c37a]">Idiomas</p>
        <div className="flex flex-wrap gap-1.5">
          {SPOKEN_LANGUAGES.map((lang) => {
            const on = languages.includes(lang.id);
            return (
              <button
                key={lang.id}
                type="button"
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

      <button
        type="button"
        onClick={askLocation}
        disabled={geoStatus === 'asking'}
        className="px-3 py-2 text-xs font-medium border border-[rgba(232,195,122,0.45)] text-[#e8c37a] hover:bg-[rgba(232,195,122,0.08)] disabled:opacity-60"
      >
        {geoStatus === 'asking' ? 'Buscando…' : 'Usar mi ubicación'}
      </button>

      {geoStatus === 'denied' && (
        <p className="text-xs will-copy-muted">
          No se ha concedido el permiso. Busca la ciudad a mano. Nada se ha guardado.
        </p>
      )}
      {geoStatus === 'unavailable' && !error && (
        <p className="text-xs will-copy-muted">
          Este dispositivo o esta ventana no permiten leer la ubicación. Busca la ciudad a mano.
        </p>
      )}
      {error && <p className="text-xs will-copy-muted">{error}</p>}

      {place && (
        <div className="space-y-3 pt-1">
          <div>
            <p className="text-sm font-serif will-copy">{place.label}</p>
            {place.emergency.numbers.length > 0 && (
              <p className="text-xs will-copy-muted mt-1 flex items-center gap-1.5">
                <PhoneCall className="w-3 h-3 text-[#e8c37a]" />
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

          {place.sites.length === 0 ? (
            <p className="text-xs will-copy-muted">
              {languageMode === 'only' && languages.length
                ? 'No hay centros con esos idiomas en el mapa abierto. Prueba Priorizar o quita el filtro.'
                : 'No han aparecido centros en el mapa abierto de este punto. El número de emergencias sigue siendo el camino más directo.'}
            </p>
          ) : (
            <ul className="space-y-2">
              {place.sites.map((site) => (
                <li
                  key={`${site.name}-${site.km}`}
                  className="flex items-start justify-between gap-3 border-t border-stone-800/80 pt-2"
                >
                  <div className="min-w-0">
                    <p className="text-xs will-copy">{site.name}</p>
                    <p className="text-[11px] will-copy-muted">
                      {site.kind} · {site.km} km
                      {site.languages.length > 0 &&
                        ` · ${site.languages
                          .map((id) => SPOKEN_LANGUAGES.find((l) => l.id === id)?.label || id)
                          .join(', ')}`}
                    </p>
                  </div>
                  <a
                    href={site.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 text-[11px] text-[#e8c37a] inline-flex items-center gap-1"
                  >
                    Mapa
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            onClick={() =>
              onAskWill(
                `Estoy en ${place.label}. Necesito un centro sanitario o un recurso de apoyo${
                  languages.length
                    ? ` donde puedan atenderme en ${languages
                        .map((id) => SPOKEN_LANGUAGES.find((l) => l.id === id)?.label || id)
                        .join(', ')}`
                    : ''
                }.`,
              )
            }
            className="w-full py-2 text-[11px] font-medium border border-stone-800 text-stone-300 hover:text-[#e8c37a]"
          >
            Preguntar a Will sobre este lugar
          </button>
        </div>
      )}

      {privacyLeaks.length > 0 && (
        <p className="text-xs text-[#e8c37a]">
          Aviso de privacidad: se ha detectado un rastro de ubicación en el navegador.
        </p>
      )}
    </div>
  );
};
