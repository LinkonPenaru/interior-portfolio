import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { ProjectImage } from '../../types/project';

interface LightboxProps {
  images: ProjectImage[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  images,
  currentIndex,
  onClose,
  onNavigate,
}) => {
  const isOpen = currentIndex !== null;
  const currentImage = isOpen ? images[currentIndex] : null;

  const handlePrev = useCallback(() => {
    if (currentIndex === null) return;
    const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    onNavigate(newIndex);
  }, [currentIndex, images.length, onNavigate]);

  const handleNext = useCallback(() => {
    if (currentIndex === null) return;
    const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    onNavigate(newIndex);
  }, [currentIndex, images.length, onNavigate]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || !currentImage) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Architectural Sheet Viewer"
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/90 backdrop-blur-md p-2 sm:p-6 animate-fadeIn"
      onClick={onClose}
    >
      {/* Top Controls */}
      <div
        className="absolute top-4 right-4 z-50 flex items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-xs uppercase tracking-widest text-stone-300 font-mono hidden sm:inline-block">
          Sheet {currentIndex + 1} of {images.length} (PDF Page {currentImage.sourcePage})
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="p-2 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-200 transition-colors focus:ring-2 focus:ring-stone-400"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Prev Button */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          aria-label="Previous sheet"
          className="absolute left-2 sm:left-6 z-50 p-2 sm:p-3 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-200 transition-colors focus:ring-2 focus:ring-stone-400"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Main Image Container */}
      <div
        className="relative max-w-6xl max-h-[85vh] flex flex-col items-center justify-center bg-stone-900 border border-stone-800 rounded-sm overflow-hidden p-2 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative overflow-auto max-h-[72vh] flex items-center justify-center bg-stone-950">
          <img
            src={currentImage.url}
            alt={currentImage.title}
            className="max-h-[70vh] w-auto max-w-full object-contain"
          />
        </div>

        {/* Caption & Metadata Bar */}
        <div className="w-full mt-3 px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between text-left gap-2 border-t border-stone-800 bg-stone-900/90">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-stone-800 text-stone-300 tracking-wider">
                {currentImage.sheetType}
              </span>
              <h4 className="text-sm sm:text-base font-serif text-cream-100 font-medium tracking-wide">
                {currentImage.title}
              </h4>
            </div>
            <p className="text-xs text-stone-400 mt-1 line-clamp-2 max-w-2xl font-light">
              {currentImage.caption}
            </p>
          </div>
          <a
            href={currentImage.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-stone-300 hover:text-white uppercase tracking-wider transition-colors self-start sm:self-center shrink-0"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Open Full File</span>
          </a>
        </div>
      </div>

      {/* Next Button */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          aria-label="Next sheet"
          className="absolute right-2 sm:right-6 z-50 p-2 sm:p-3 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-200 transition-colors focus:ring-2 focus:ring-stone-400"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};
