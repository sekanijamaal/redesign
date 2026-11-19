import { useEffect } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { ResilientImage } from './ResilientImage';
import type { Dispatch, Service } from '../data/metalBridgesData';

function useDialog(onClose: () => void, open: boolean) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose, open]);
}

interface ServiceSpecModalProps {
  service: Service | null;
  onClose: () => void;
  onRequestQuote: (service: Service) => void;
}

export function ServiceSpecModal({
  service,
  onClose,
  onRequestQuote,
}: ServiceSpecModalProps) {
  useDialog(onClose, Boolean(service));

  if (!service) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 px-4 py-8 md:py-14"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-modal-title"
        className="relative w-full max-w-[900px] rounded-[9px] border border-[#4b4b4b] bg-[#141414]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-[6px] border border-[#4b4b4b] bg-[#141414] text-[#eeeeee] transition-colors hover:border-[#fff313]"
          aria-label="Close specifications"
        >
          <X size={17} strokeWidth={1.5} />
        </button>

        <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
          <ResilientImage
            src={service.image}
            alt={service.imageAlt}
            className="aspect-[4/3] w-full rounded-t-[9px] md:aspect-auto md:h-full md:rounded-l-[9px] md:rounded-tr-none"
            label={service.name}
            eager
          />

          <div className="p-6 md:p-8">
            <p className="type-mono text-[#fff313]">
              {service.categoryLabel} · {service.tagline}
            </p>
            <h2 id="service-modal-title" className="type-heading-lg mt-3 text-[#eeeeee]">
              {service.name}
            </h2>
            <p className="type-body-sm mt-3 text-[#afafaf]">{service.summary}</p>

            <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-0">
              {service.specs.map((row) => (
                <div key={row.label} className="border-t border-[#333333] py-3">
                  <dt className="type-mono text-[#afafaf]">{row.label}</dt>
                  <dd className="type-body-sm mt-1 text-[#eeeeee]">{row.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 border-t border-[#333333] pt-4">
              <p className="type-mono text-[#afafaf]">Standards referenced</p>
              <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                {service.standards.map((standard) => (
                  <li key={standard} className="type-mono text-[#eeeeee]">
                    {standard}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onRequestQuote(service)}
                className="type-body-sm inline-flex min-h-11 items-center gap-2 rounded-[6px] bg-[#eeeeee] px-5 text-black transition-colors hover:bg-[#fff313]"
              >
                Request this service
                <ArrowUpRight size={15} strokeWidth={1.5} aria-hidden="true" />
              </button>
              <p className="type-mono text-[#afafaf]">Lead time {service.leadLabel}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ArticleReaderModalProps {
  article: Dispatch | null;
  onClose: () => void;
}

export function ArticleReaderModal({ article, onClose }: ArticleReaderModalProps) {
  useDialog(onClose, Boolean(article));

  if (!article) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 px-4 py-8 md:py-14"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="article-modal-title"
        className="relative w-full max-w-[820px] rounded-[9px] bg-[#eeeeee] text-black"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-[6px] border border-black/20 bg-[#eeeeee] text-black transition-colors hover:border-black"
          aria-label="Close article"
        >
          <X size={17} strokeWidth={1.5} />
        </button>

        <div className="p-6 md:p-10">
          <p className="type-mono text-black/50">
            {article.date} · {article.category} · {article.readTime}
          </p>
          <h2 id="article-modal-title" className="type-heading-lg mt-3 max-w-[24ch]">
            {article.title}
          </h2>

          <ResilientImage
            src={article.image}
            alt={article.imageAlt}
            className="mt-6 aspect-[16/9] w-full rounded-[16px]"
            label={article.title}
            eager
          />

          <div className="mt-6 space-y-4">
            {article.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className="type-body max-w-[68ch] text-black/75">
                {paragraph}
              </p>
            ))}
          </div>

          {article.video && (
            <div className="mt-8">
              <p className="type-mono text-black/50">Process film</p>
              <video
                key={article.video}
                controls
                playsInline
                preload="metadata"
                poster={article.image}
                className="mt-3 w-full rounded-[9px] border border-black/10 bg-black"
              >
                <source src={article.video} />
                Your browser cannot play this video.{' '}
                <a href={article.video} className="underline">
                  Open it directly
                </a>
                .
              </video>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
