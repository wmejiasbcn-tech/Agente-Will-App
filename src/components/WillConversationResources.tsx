import React from 'react';
import { ExternalLink } from 'lucide-react';
import type { ContextCategory } from '../types';
import {
  offersConversationResources,
  primaryResourceFor,
} from '../data/conversationResources';

interface WillConversationResourcesProps {
  contextType?: ContextCategory;
  onOpenResources?: () => void;
  onOpenOtherResources?: () => void;
}

export const WillConversationResources: React.FC<WillConversationResourcesProps> = ({
  contextType,
  onOpenResources,
  onOpenOtherResources,
}) => {
  if (!offersConversationResources(contextType)) return null;
  const resource = primaryResourceFor(contextType);
  if (!resource) return null;

  return (
    <div className="max-w-[94%] space-y-2 pt-1">
      <a
        href={resource.url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 text-[13px] text-[#e8c37a] underline underline-offset-4 min-h-11"
      >
        {resource.name}
        <span className="no-underline will-copy-muted font-normal">· {resource.kind}</span>
        <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
      </a>
      <p className="text-[12px] will-copy-muted leading-relaxed">
        También cuentas con las secciones Recursos de apoyo y Otros recursos. Puedes volver a
        esta conversación.
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onOpenResources?.()}
          className="min-h-11 px-3 text-[12px] text-[#e8c37a] arch-glass"
        >
          Recursos de apoyo relacionados
        </button>
        <button
          type="button"
          onClick={() => onOpenOtherResources?.()}
          className="min-h-11 px-3 text-[12px] text-[#ead6b4] arch-glass"
        >
          Otros recursos
        </button>
      </div>
    </div>
  );
};
