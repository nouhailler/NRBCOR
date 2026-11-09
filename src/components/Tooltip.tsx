import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  title?: string;
  content: string;
  children?: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  title,
  content,
  children,
  position = 'top',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom':
        return 'top-full mt-2 left-1/2 -translate-x-1/2';
      case 'left':
        return 'right-full mr-2 top-1/2 -translate-y-1/2';
      case 'right':
        return 'left-full ml-2 top-1/2 -translate-y-1/2';
      case 'top':
      default:
        return 'bottom-full mb-2 left-1/2 -translate-x-1/2';
    }
  };

  return (
    <div ref={containerRef} className={`relative inline-flex items-center ${className}`}>
      {children ? (
        <div onClick={toggle} className="cursor-pointer">
          {children}
        </div>
      ) : (
        <button
          type="button"
          onClick={toggle}
          aria-label="Aide contextuelle"
          title="Cliquez pour afficher l'aide contextuelle"
          className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-tint text-brand-ink hover:bg-tint-strong transition-colors text-[13px] font-bold focus:outline-none"
        >
          <span className="material-symbols-outlined text-[14px]">info</span>
        </button>
      )}

      {isOpen && (
        <div
          role="tooltip"
          className={`absolute z-50 w-64 max-w-xs p-3 bg-navy text-white rounded-xl shadow-xl text-[12px] leading-relaxed border border-ink-muted animate-in fade-in zoom-in-95 duration-150 ${getPositionClasses()}`}
        >
          <div className="flex items-start justify-between gap-1 pb-1">
            {title && (
              <span className="font-label text-[11px] font-bold uppercase tracking-wider text-ok-bright">
                {title}
              </span>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="text-brand-bright hover:text-white ml-auto"
              aria-label="Fermer"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          </div>
          <p className="text-on-navy-soft text-[11px] leading-snug">{content}</p>
          <div className="mt-1 pt-1 border-t border-white/10 flex items-center gap-1 text-[9px] text-ok-bright uppercase tracking-wider font-semibold">
            <span>💡 Infobulle d'aide</span>
          </div>
        </div>
      )}
    </div>
  );
};
