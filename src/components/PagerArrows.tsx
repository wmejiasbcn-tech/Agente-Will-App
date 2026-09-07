import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PagerArrowsProps {
  onBack: () => void;
  onNext: () => void;
  backDisabled?: boolean;
  nextDisabled?: boolean;
  hereLabel?: string;
}

export const PagerArrows: React.FC<PagerArrowsProps> = ({
  onBack,
  onNext,
  backDisabled,
  nextDisabled,
  hereLabel,
}) => {
  return (
    <nav className="will-pager" aria-label="Atrás y siguiente">
      <button
        type="button"
        onClick={onBack}
        disabled={backDisabled}
        className="will-pager-btn"
        aria-label="Atrás"
      >
        <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
        <span>Atrás</span>
      </button>
      {hereLabel ? (
        <span className="will-pager-here">{hereLabel}</span>
      ) : (
        <span className="will-pager-here" aria-hidden="true" />
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className="will-pager-btn will-pager-btn-next"
        aria-label="Siguiente"
      >
        <span>Siguiente</span>
        <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
      </button>
    </nav>
  );
};
