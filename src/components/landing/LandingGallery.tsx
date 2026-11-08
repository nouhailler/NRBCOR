import React, { useState } from 'react';
import { LandingTranslations } from '../../i18n/landingTranslations';

interface LandingGalleryProps {
  t: LandingTranslations;
}

export const LandingGallery: React.FC<LandingGalleryProps> = ({ t }) => {
  const [activeModalItem, setActiveModalItem] = useState<{
    title: string;
    device: string;
    src: string;
    description: string;
  } | null>(null);

  return (
    <section id="gallery" className="py-20 lg:py-28 bg-[#f8f9ff] text-[#001126] border-b border-[#e4efff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs font-['Space_Grotesk'] font-bold tracking-wider text-[#0036ce] uppercase mb-2 block">
            {t.gallery.kicker}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-['Space_Grotesk'] font-bold text-[#001126] tracking-tight mb-4 text-balance">
            {t.gallery.title}
          </h2>
          <p className="text-base text-[#44474d] leading-relaxed mb-3">
            {t.gallery.subtitle}
          </p>
          <span className="text-xs text-[#74777e] font-['Space_Grotesk'] font-medium">
            {t.gallery.openPrompt}
          </span>
        </div>

        {/* Grille responsive des 6 captures d'écran authentiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {t.gallery.items.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveModalItem(item)}
              className="group cursor-pointer rounded-2xl bg-white border border-[#c4c6ce]/70 overflow-hidden shadow-xs hover:shadow-xl transition-all hover:border-[#0036ce]/60 flex flex-col"
            >
              <div className="relative aspect-video sm:aspect-16/10 bg-[#001126] overflow-hidden flex items-center justify-center">
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-contain sm:object-cover group-hover:scale-102 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-4 py-2 rounded-xl bg-white/90 backdrop-blur-md text-[#001126] font-['Space_Grotesk'] font-bold text-xs tracking-wide shadow-md flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                    <span>Agrandir</span>
                  </span>
                </div>
              </div>

              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-base font-bold font-['Space_Grotesk'] text-[#001126] group-hover:text-[#0036ce] transition-colors">
                      {item.title}
                    </h3>
                    <span className="text-[11px] font-['Space_Grotesk'] font-semibold text-[#3f9d73]">
                      {item.device}
                    </span>
                  </div>
                  <p className="text-xs text-[#44474d] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Lightbox Agrandie */}
      {activeModalItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#001126]/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveModalItem(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-white/20 animate-in zoom-in-95 duration-150 text-[#001126]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="bg-[#001126] text-white p-4 px-6 flex items-center justify-between">
              <div>
                <h3 className="font-['Space_Grotesk'] font-bold text-base text-white">
                  {activeModalItem.title}
                </h3>
                <span className="text-xs text-[#98f6c5] font-['Space_Grotesk']">
                  {activeModalItem.device} • Capture réelle NRBCOR
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label={t.gallery.closeLabel}
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Image Plein Format */}
            <div className="p-3 bg-[#050b14] flex items-center justify-center max-h-[70vh] overflow-auto">
              <img
                src={activeModalItem.src}
                alt={activeModalItem.title}
                className="max-h-[65vh] w-auto object-contain rounded-lg shadow-lg"
              />
            </div>

            {/* Footer Modal */}
            <div className="p-4 px-6 bg-[#f8f9ff] border-t border-[#c4c6ce]/60 flex items-center justify-between">
              <p className="text-xs text-[#44474d] max-w-2xl leading-relaxed">
                {activeModalItem.description}
              </p>
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="px-4 py-2 rounded-lg bg-[#001126] hover:bg-[#12263f] text-white text-xs font-['Space_Grotesk'] font-bold cursor-pointer"
              >
                {t.gallery.closeLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
