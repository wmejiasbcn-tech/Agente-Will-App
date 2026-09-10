import React from 'react';
import { ExternalLink, PhoneCall } from 'lucide-react';
import { NearbySite } from '../utils/geolocation';
import { labelForLang } from '../data/spokenLanguages';

interface ResourceSiteCardProps {
  site: NearbySite;
  requested: string[];
  onAskWill: (prompt: string) => void;
}

export const ResourceSiteCard: React.FC<ResourceSiteCardProps> = ({
  site,
  requested,
  onAskWill,
}) => {
  const careHit = requested.filter((l) => site.careLanguages.includes(l));
  return (
    <article className="arch-glass p-4 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wide text-[#e8c37a]">{site.kind}</p>
          <h3 className="text-sm font-serif will-copy mt-0.5">{site.name}</h3>
        </div>
        <span className="text-[11px] will-copy-muted shrink-0">{site.km} km</span>
      </div>

      {site.address && <p className="text-[11px] will-copy-muted">{site.address}</p>}

      {site.phone && (
        <a
          href={`tel:${site.phone.replace(/\s/g, '')}`}
          className="text-xs text-[#e8c37a] inline-flex items-center gap-1.5"
        >
          <PhoneCall className="w-3 h-3" />
          {site.phone}
        </a>
      )}

      <div className="text-[11px] will-copy-muted space-y-0.5">
        {site.careLanguages.length > 0 ? (
          <p>
            Atención (indicio del mapa, no verificado por Will):{' '}
            {site.careLanguages.map(labelForLang).join(', ')}
            {careHit.length > 0 ? ` · coincide con lo que pediste` : ''}
          </p>
        ) : (
          <p>No hay indicios de idioma de atención en el mapa.</p>
        )}
        {site.nameLanguages.length > 0 && (
          <p>Nombre también en: {site.nameLanguages.map(labelForLang).join(', ')}</p>
        )}
      </div>

      <p className="text-[10px] will-copy-muted">
        Fuente: {site.source.name}
        {site.source.checkedAt ? ` · mapa a fecha ${site.source.checkedAt.slice(0, 10)}` : ''}
      </p>

      <div className="flex flex-wrap gap-2 pt-1">
        <a
          href={site.mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="text-[11px] text-[#e8c37a] inline-flex items-center gap-1"
        >
          Mapa
          <ExternalLink className="w-3 h-3" />
        </a>
        {site.website && (
          <a
            href={site.website}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] text-[#e8c37a] inline-flex items-center gap-1"
          >
            Web
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
        <button
          type="button"
          onClick={() =>
            onAskWill(
              `Necesito orientación para acceder a ${site.name}${
                site.address ? `, en ${site.address}` : ''
              }. Es un ${site.kind.toLowerCase()}. ¿Cómo funciona el acceso y qué debo tener en cuenta?`,
            )
          }
          className="text-[11px] text-stone-300 hover:text-[#e8c37a]"
        >
          Preguntar a Will
        </button>
      </div>
    </article>
  );
};
