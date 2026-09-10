import React, { useEffect, useState } from 'react';
import { MapPin, PhoneCall, Search } from 'lucide-react';
import { WORLD_NODES, WorldNode } from '../data/worldNodes';
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

interface OtherResourcesViewProps {
  onAskWill: (prompt: string) => void;
}

export const OtherResourcesView: React.FC<OtherResourcesViewProps> = ({
  onAskWill,
}) => {
  const [query, setQuery] = useState('');
  const [geoStatus, setGeoStatus] = useState<GeoStatus>('idle');
  const [place, setPlace] = useState<GeoLookupResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastOrigin, setLastOrigin] = useState<GeoOrigin | null>(null);
  const [languages, setLanguages] = useState<string[]>([]);
  const [languageMode, setLanguageMode] = useState<LanguageFilterMode>('prioritize');
  const [focus, setFocus] = useState<WorldNode | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

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
      setGeoStatus(
        absence === 'place_not_found' || absence === 'map_error'
          ? absence
          : 'unavailable',
      );
      setError(e?.message || 'No se ha podido consultar el lugar.');
    } finally {
      assertNoGeoPersistence();
    }
  };

  const searchPlace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setFocus(null);
    await runLookup({ q: query.trim() }, 'search');
  };

  const askLocation = async () => {
    setFocus(null);
    setGeoStatus('asking');
    setError(null);
    const result = await requestUserCoords();
    if (result.ok === false) {
      setGeoStatus(result.status);
      setPlace(null);
      setLastOrigin(null);
      assertNoGeoPersistence();
      return;
    }
    await runLookup({ lat: result.lat, lng: result.lng }, 'gps');
  };

  const selectNode = async (node: WorldNode) => {
    setFocus(node);
    setQuery(node.query);
    await runLookup({ q: node.query }, 'search');
  };

  const clearLookup = () => {
    setPlace(null);
    setLastOrigin(null);
    setFocus(null);
    setGeoStatus('idle');
    setError(null);
    assertNoGeoPersistence();
  };

  const originNote =
    lastOrigin === 'gps'
      ? 'Consulta desde tu ubicación de este momento. No queda como «tu sitio».'
      : lastOrigin === 'search'
        ? 'Esto es una búsqueda. No es tu ubicación.'
        : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-5 text-[#ead6b4]">
      <header className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold will-copy">
          Otros recursos
        </h1>
      </header>

      <div className="world-stage arch-glass overflow-hidden">
        <div
          className="world-stage-inner"
          style={
            focus && !reduceMotion
              ? ({
                  ['--ox' as string]: `${focus.x}%`,
                  ['--oy' as string]: `${focus.y}%`,
                  ['--sc' as string]: '2.05',
                } as React.CSSProperties)
              : undefined
          }
        >
          <div className="world-stage-frame">
            <img
              src="/visual-system/world-map-screen.jpg"
              alt=""
              className="world-stage-photo"
              draggable={false}
            />
            <div className="world-nodes" role="list" aria-label="Ciudades del mapamundi">
              {WORLD_NODES.map((node) => {
                const on = focus?.id === node.id;
                return (
                  <button
                    key={node.id}
                    type="button"
                    role="listitem"
                    className={`world-node${on ? ' world-node-on' : ''}`}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    onClick={() => void selectNode(node)}
                    aria-label={`Buscar recursos en ${node.label}`}
                    aria-pressed={on}
                    title={node.label}
                  >
                    <span className="sr-only">{node.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="arch-glass p-4 sm:p-5 space-y-3">
        <form onSubmit={searchPlace} className="flex flex-col sm:flex-row gap-2">
          <label className="sr-only" htmlFor="other-resources-search">
            Buscar ciudad, región, país o un lugar concreto
          </label>
          <input
            id="other-resources-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ciudad, región, país o lugar"
            className="flex-1 min-w-0 bg-stone-950/50 border border-stone-800 px-3 py-2.5 text-sm text-[#ead6b4] placeholder:text-[#ead6b4]/45 focus:outline-none focus:border-[rgba(232,195,122,0.45)]"
          />
          <button
            type="submit"
            disabled={geoStatus === 'asking'}
            className="min-h-11 px-4 py-2 text-xs font-medium border border-[rgba(232,195,122,0.45)] text-[#e8c37a] hover:bg-[rgba(232,195,122,0.08)] disabled:opacity-60 inline-flex items-center justify-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" aria-hidden="true" />
            Buscar
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void askLocation()}
            disabled={geoStatus === 'asking'}
            className="min-h-11 px-3 py-2 text-xs font-medium border border-[rgba(232,195,122,0.45)] text-[#e8c37a] hover:bg-[rgba(232,195,122,0.08)] disabled:opacity-60 inline-flex items-center gap-1.5"
          >
            <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
            {geoStatus === 'asking' ? 'Buscando…' : 'Usar mi ubicación'}
          </button>
          {(place || lastOrigin || focus) && (
            <button
              type="button"
              onClick={clearLookup}
              className="min-h-11 px-3 py-2 text-xs font-medium border border-stone-800 text-stone-300 hover:text-[#ead6b4]"
            >
              Volver al mundo
            </button>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-wide text-[#e8c37a]" id="other-lang-label">
            Idioma de atención que pides
          </p>
          <div className="flex flex-wrap gap-1.5" role="group" aria-labelledby="other-lang-label">
            {SPOKEN_LANGUAGES.map((lang) => {
              const on = languages.includes(lang.id);
              return (
                <button
                  key={lang.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleLang(lang.id)}
                  className={`min-h-11 px-2 py-1 text-[11px] border ${
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
              className={`min-h-11 px-2 py-1 text-[11px] border ${
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
              className={`min-h-11 px-2 py-1 text-[11px] border ${
                languageMode === 'only'
                  ? 'border-[#e8c37a] text-[#e8c37a]'
                  : 'border-stone-800 text-stone-400'
              }`}
            >
              Solo estos idiomas
            </button>
          </div>
        </div>
      </div>

      {geoStatus === 'denied' && (
        <p className="text-sm will-copy-muted" role="status">
          Has rechazado el permiso. Busca la ciudad a mano. Nada se ha guardado.
        </p>
      )}
      {geoStatus === 'unavailable' && !error && (
        <p className="text-sm will-copy-muted" role="status">
          Este dispositivo o esta ventana no permiten leer la ubicación. Busca la ciudad a mano.
        </p>
      )}
      {geoStatus === 'place_not_found' && (
        <p className="text-sm will-copy-muted" role="status">
          No hemos encontrado resultados para esta búsqueda.
        </p>
      )}
      {geoStatus === 'map_error' && (
        <p className="text-sm will-copy-muted" role="status">
          No se ha podido consultar el lugar ahora. El fallo es técnico, no una prueba de que no
          haya recursos.
        </p>
      )}
      {error && geoStatus !== 'place_not_found' && geoStatus !== 'map_error' && (
        <p className="text-sm will-copy-muted" role="status">
          {error}
        </p>
      )}

      {place && (
        <div className="space-y-3" aria-live="polite">
          <div>
            <p className="text-lg font-serif will-copy">{place.label}</p>
            {originNote && (
              <p className="text-[11px] will-copy-muted mt-0.5">{originNote}</p>
            )}
            {place.emergency.numbers.length > 0 && (
              <p className="text-xs will-copy-muted mt-1 flex items-center gap-1.5">
                <PhoneCall className="w-3 h-3 text-[#e8c37a]" aria-hidden="true" />
                Emergencias: {place.emergency.numbers.join(' · ')}. {place.emergency.note}
              </p>
            )}
          </div>

          {place.absence === 'no_map_hits' && (
            <p className="text-sm will-copy-muted" role="status">
              No hemos encontrado resultados para esta búsqueda.
            </p>
          )}
          {place.absence === 'filter_empty' && (
            <p className="text-sm will-copy-muted" role="status">
              Hay {place.unfilteredCount} lugares en el mapa, pero ninguno con indicio de atención
              en {languages.map(labelForLang).join(', ')}. La ausencia de coincidencia no es
              inexistencia del recurso.
            </p>
          )}

          {place.sites.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {place.sites.map((site) => (
                <ResourceSiteCard
                  key={`${site.name}-${site.lat}`}
                  site={site}
                  requested={languages}
                  onAskWill={onAskWill}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
