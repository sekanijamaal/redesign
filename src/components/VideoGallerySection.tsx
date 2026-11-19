import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react';
import { VIDEO_GALLERY } from '../data/videoGalleryData';

export function VideoGallerySection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showAllVideos, setShowAllVideos] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastActiveIndexRef = useRef<number | null>(null);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const closePlayer = () => {
    setActiveIndex(null);
  };

  const selectVideo = (index: number) => {
    setIsLoading(true);
    setHasError(false);
    setActiveIndex(index);
  };

  useEffect(() => {
    if (activeIndex === null) {
      if (lastActiveIndexRef.current !== null) {
        cardRefs.current[lastActiveIndexRef.current]?.focus();
        lastActiveIndexRef.current = null;
      }
      return;
    }

    lastActiveIndexRef.current = activeIndex;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePlayer();
      } else if (event.key === 'ArrowLeft') {
        selectVideo((activeIndex + VIDEO_GALLERY.length - 1) % VIDEO_GALLERY.length);
      } else if (event.key === 'ArrowRight') {
        selectVideo((activeIndex + 1) % VIDEO_GALLERY.length);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex]);

  const activeVideo = activeIndex === null ? null : VIDEO_GALLERY[activeIndex];

  return (
    <section id="videos" className="w-full bg-[#111111] px-6 py-[120px] md:px-10">
      <div className="mx-auto w-full max-w-[1360px]">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[#4b4b4b]/60 pb-6">
          <div>
            <span className="type-mono text-[#fff313]">Watch our work</span>
            <h2 className="type-heading-lg mt-3 max-w-[18ch] text-[#eeeeee]">
              Video gallery.
            </h2>
          </div>
          <p className="type-body-sm max-w-[420px] text-[#afafaf]">
            See the fabrication process and completed projects in motion — the precision
            and craftsmanship behind every piece.
          </p>
        </div>

        <div id="video-gallery-grid" className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {VIDEO_GALLERY.map((video, index) => {
            if (!showAllVideos && index >= 3) return null;

            return (
              <button
                key={video.id}
                ref={(element) => {
                  cardRefs.current[index] = element;
                }}
                type="button"
                onClick={() => selectVideo(index)}
                aria-label={`Play ${video.title}`}
                className="group overflow-hidden rounded-[9px] border border-[#333333] bg-black text-left transition-colors duration-200 hover:border-[#fff313]/60"
              >
                <span className="relative block aspect-video overflow-hidden bg-[#1a1a1a]">
                  <img
                    src={video.thumbnail}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <span className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/35" />
                  <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#fff313] text-black transition-transform duration-200 group-hover:scale-110">
                    <Play
                      size={22}
                      fill="currentColor"
                      strokeWidth={1.5}
                      className="ml-1"
                      aria-hidden="true"
                    />
                  </span>
                </span>
                <span className="block p-5">
                  <span className="type-body block text-[#eeeeee] transition-colors group-hover:text-[#fff313]">
                    {video.title}
                  </span>
                  <span className="type-body-sm mt-2 block text-[#afafaf]">
                    {video.description}
                  </span>
                  <span className="type-mono mt-4 inline-flex border border-[#4b4b4b] px-2 py-1 text-[#afafaf]">
                    {video.format}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {VIDEO_GALLERY.length > 3 && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setShowAllVideos((value) => !value)}
              aria-expanded={showAllVideos}
              aria-controls="video-gallery-grid"
              className="type-body-sm min-h-11 border border-[#fff313] px-5 text-[#fff313] transition-colors hover:bg-[#fff313] hover:text-black"
            >
              {showAllVideos ? 'Show fewer videos' : 'See more videos'}
            </button>
          </div>
        )}

        {showAllVideos && (
          <div className="mt-14 border border-[#4b4b4b] bg-black px-6 py-10 text-center md:px-10">
            <p className="type-mono text-[#fff313]">More videos coming soon</p>
            <p className="type-body-sm mx-auto mt-3 max-w-[520px] text-[#afafaf]">
              New project videos will be added soon, including fabrication footage,
              completed projects, and client testimonials.
            </p>
          </div>
        )}
      </div>

      {activeVideo && activeIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-8"
          onClick={(event) => {
            if (event.target === event.currentTarget) closePlayer();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="gallery-player-title"
            className="relative w-full max-w-[1040px]"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="type-mono text-[#fff313]">
                  {String(activeIndex + 1).padStart(2, '0')} / {String(VIDEO_GALLERY.length).padStart(2, '0')}
                </p>
                <h3 id="gallery-player-title" className="type-heading mt-2 text-[#eeeeee]">
                  {activeVideo.title}
                </h3>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closePlayer}
                aria-label="Close video player"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-[#4b4b4b] text-[#eeeeee] transition-colors hover:border-[#fff313] hover:text-[#fff313]"
              >
                <X size={20} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>

            <div className="relative aspect-video overflow-hidden bg-black">
              <video
                key={activeVideo.id}
                src={activeVideo.url}
                poster={activeVideo.thumbnail}
                controls
                autoPlay
                playsInline
                preload="metadata"
                aria-label={activeVideo.title}
                onLoadStart={() => {
                  setIsLoading(true);
                  setHasError(false);
                }}
                onCanPlay={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setHasError(true);
                }}
                className="h-full w-full"
              />
              {isLoading && !hasError && (
                <p
                  role="status"
                  className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/70 type-mono text-[#eeeeee]"
                >
                  Loading video…
                </p>
              )}
              {hasError && (
                <p role="alert" className="absolute inset-0 flex items-center justify-center bg-black px-6 text-center type-body-sm text-[#eeeeee]">
                  This video couldn’t be loaded. Please try again later.
                </p>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="type-body-sm text-[#afafaf]">{activeVideo.description}</p>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    selectVideo((activeIndex + VIDEO_GALLERY.length - 1) % VIDEO_GALLERY.length)
                  }
                  aria-label="Previous video"
                  className="inline-flex h-10 w-10 items-center justify-center border border-[#4b4b4b] text-[#eeeeee] transition-colors hover:border-[#fff313] hover:text-[#fff313]"
                >
                  <ChevronLeft size={20} strokeWidth={1.5} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => selectVideo((activeIndex + 1) % VIDEO_GALLERY.length)}
                  aria-label="Next video"
                  className="inline-flex h-10 w-10 items-center justify-center border border-[#4b4b4b] text-[#eeeeee] transition-colors hover:border-[#fff313] hover:text-[#fff313]"
                >
                  <ChevronRight size={20} strokeWidth={1.5} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
