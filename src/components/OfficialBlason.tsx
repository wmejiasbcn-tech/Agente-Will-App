import React from 'react';

/**
 * Único punto de inserción del blasón oficial.
 * Archivo: /public/blason-oficial-waipl.png
 * Reglas: copy-paste del PNG oficial. Sin fondo, sombra, círculo extra,
 * recorte, etiqueta ni recreación. El recuadro del <img> es transparente.
 */
interface OfficialBlasonProps {
  size?: number;
  className?: string;
}

export const OfficialBlason: React.FC<OfficialBlasonProps> = ({
  size = 40,
  className = '',
}) => {
  return (
    <img
      src="/blason-oficial-waipl.png"
      alt="Blasón oficial WAIPL"
      width={size}
      height={size}
      className={`object-contain select-none bg-transparent ${className}`.trim()}
      draggable={false}
    />
  );
};
