import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { ResilientImage } from './ResilientImage';
import { DISPATCHES, type Dispatch } from '../data/metalBridgesData';

gsap.registerPlugin(ScrollTrigger);

interface NewsSectionProps {
  onOpenArticle: (article: Dispatch) => void;
}

export function NewsSection({ onOpenArticle }: NewsSectionProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const grid = gridRef.current;
    if (reduceMotion || !grid) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      const cards = grid.querySelectorAll<HTMLElement>('[data-news-right]');
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { y: 42 },
          {
            y: -18,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="news" className="w-full bg-[#eeeeee] px-6 py-[120px] text-black md:px-10">
      <div className="mx-auto w-full max-w-[1360px]">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-black/15 pb-6">
          <div>
            <span className="type-mono text-black/60">Workshop dispatches</span>
            <h2 className="type-heading-lg mt-3 max-w-[18ch]">
              Notes from the workshop floor.
            </h2>
          </div>
          <p className="type-body-sm max-w-[360px] text-black/60">
            Process films and project notes from Tantra Hill — how the work is measured,
            jigged, welded, finished, and handed over.
          </p>
        </div>

        <div ref={gridRef} className="mt-10 grid gap-x-4 gap-y-14 md:grid-cols-2">
          {DISPATCHES.map((article, index) => (
            <article
              key={article.id}
              data-news-right={index % 2 === 1 ? '' : undefined}
              className={index % 2 === 1 ? 'md:pt-16' : undefined}
            >
              <button
                type="button"
                onClick={() => onOpenArticle(article)}
                className="group block w-full text-left"
                aria-label={`Read ${article.title}`}
              >
                <ResilientImage
                  src={article.image}
                  alt={article.imageAlt}
                  className="aspect-[4/3] w-full rounded-[16px]"
                  imageClassName="transition-transform duration-500 group-hover:scale-[1.03]"
                  label={article.title}
                />
                <div className="mt-6 flex items-start justify-between gap-4">
                  <h3 className="type-heading max-w-[22ch] transition-colors group-hover:text-black/70">
                    {article.title}
                  </h3>
                  <ArrowUpRight
                    size={18}
                    strokeWidth={1.5}
                    className="mt-1 shrink-0 text-black/40 transition-colors group-hover:text-black"
                    aria-hidden="true"
                  />
                </div>
                <p className="type-mono mt-3 text-black/50">
                  {article.date} · {article.category} · {article.readTime}
                </p>
                <p className="type-body-sm mt-3 max-w-[52ch] text-black/60">
                  {article.excerpt}
                </p>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
