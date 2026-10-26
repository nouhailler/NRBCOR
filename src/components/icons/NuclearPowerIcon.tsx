import React from 'react';

interface NuclearPowerIconProps {
  className?: string;
  size?: number;
}

/**
 * Icône vectorielle autonome représentant une centrale nucléaire (CNPE).
 * Remplace tout recours à des ligatures instables de polices de caractères
 * pour éviter l'affichage de glyphes parasites ("NU x _").
 */
export const NuclearPowerIcon: React.FC<NuclearPowerIconProps> = ({
  className = 'w-4 h-4',
  size
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    width={size}
    height={size}
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    {/* Tour aéroréfrigérante de centrale nucléaire CNPE */}
    <path d="M5.5 21h13l-1.9-12.5c-.2-1.3-.7-2.3-1.4-3.1l-.7-.9h-5l-.7.9c-.7.8-1.2 1.8-1.4 3.1L5.5 21zm4.6-10.7c.2-.8.5-1.5.8-2l.3-.3h1.6l.3.3c.3.5.6 1.2.8 2l1.3 8.7H8.8l1.3-8.7z" />
    {/* Symbole énergétique central */}
    <circle cx="12" cy="15.2" r="1.6" />
    {/* Volutes de vapeur d'eau au sommet de la tour */}
    <path d="M9.8 4.5c0-1.5 1-2.4 1-3.1 0-.5-.3-.9-.7-1 .7.2 1.5.8 1.5 1.7 0 1.3-1 2-1 2.6l-.8-.2zm3.4 0c0-1.7 1.2-2.6 1.2-3.4 0-.5-.3-.8-.7-.9.7.2 1.4.8 1.4 1.7 0 1.5-1.1 2.2-1.1 2.8l-.8-.2z" />
  </svg>
);
