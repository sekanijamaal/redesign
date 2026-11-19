import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { BUSINESS, MISSION_PILLARS } from '../data/metalBridgesData';
import type { SectionId } from './Navbar';

gsap.registerPlugin(ScrollTrigger);

interface YellowStatementSectionProps {
  onNavigate: (id: SectionId) => void;
}

export function YellowStatementSection({ onNavigate }: YellowStatementSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const statementRef = useRef<HTMLDivElement>(null);
  const metricRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [reduceMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (reduceMotion) return;

      gsap.fromTo(
        surfaceRef.current,
        { scale: 0.94, borderRadius: '24px' },
        {
          scale: 1,
          borderRadius: '0px',
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 90%',
            end: 'top 15%',
            scrub: true,
          },
        },
      );

      const mm = gsap.matchMedia();

      mm.add('(min-width: 768px)', () => {
        gsap.fromTo(
          statementRef.current,
          { y: 36 },
          {
            y: -24,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.4,
            },
          },
        );

        gsap.fromTo(
          metricRef.current,
          { y: 26 },
          {
            y: -26,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.6,
            },
          },
        );
      });

      return () => mm.revert();
    }, section);

    if (reduceMotion) {
      return () => {
        ctx.revert();
      };
    }

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        if (window.innerWidth < 768) return;
        const next = self.progress >= 0.68 ? 2 : self.progress >= 0.34 ? 1 : 0;
        setActive((current) => (current === next ? current : next));
      },
    });

    return () => {
      trigger.kill();
      ctx.revert();
    };
  }, []);

  const jumpTo = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const travel = section.offsetHeight - window.innerHeight;
    const targetProgress = [0.1, 0.45, 0.8][index];
    window.scrollTo({
      top: top + travel * targetProgress,
      behavior: 'smooth',
    });
  };

  const pillar = MISSION_PILLARS[active];

  return (
    <section
      id="mission"
      ref={sectionRef}
      className={
        reduceMotion ? 'relative w-full bg-black' : 'relative w-full bg-black md:h-[230vh]'
      }
    >
      <div
        className={
          reduceMotion
            ? 'relative h-auto w-full'
            : 'relative h-auto w-full md:sticky md:top-0 md:h-screen md:overflow-hidden'
        }
      >
        <div
          ref={surfaceRef}
          className={`flex min-h-[100svh] w-full origin-center flex-col overflow-hidden bg-[#fff313] text-black ${
            reduceMotion ? '' : 'md:h-full md:min-h-0'
          }`}
        >
          <div className="mission-inner mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-between px-6 md:px-10">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-black/20 pb-5">
              <span className="type-mono text-black/70">
                The practice · {BUSINESS.workshop.split(',')[0]}
              </span>
              <span className="type-mono text-black/70">
                {BUSINESS.founder} · {BUSINESS.founderTitle}
              </span>
            </div>

            <div ref={statementRef} className="mission-statement max-w-[1040px] will-change-transform">
              <p className="type-mono text-black/60">OUR THESIS</p>
              <h2 className="type-display mt-4 max-w-[19ch]">
                Strong structures are decided long before the first weld.
              </h2>
              <p className="mission-about type-body mt-5 max-w-[560px] text-[#4a4600]">
                {BUSINESS.about}
              </p>
            </div>

            {/* Desktop: one pillar at a time, scrubbed by scroll. */}
            <div
              ref={metricRef}
              className={reduceMotion ? 'hidden' : 'hidden will-change-transform md:block'}
            >
              <div className="flex items-baseline gap-5">
                <span className="type-mono text-black/60">{pillar.index}</span>
                <span className="type-heading-lg tabular-nums">{pillar.metric}</span>
              </div>
              <h3 className="type-heading-lg mt-3 max-w-[16ch]">{pillar.title}</h3>
              <p className="type-body-sm mt-3 max-w-[420px] text-[#4a4600]">{pillar.note}</p>
            </div>

            {/* Mobile, and reduced motion on any screen: the full thesis, stacked. */}
            <div className={reduceMotion ? 'grid gap-6' : 'grid gap-6 md:hidden'}>
              {MISSION_PILLARS.map((item) => (
                <div key={item.index} className="border-t border-black/20 pt-4">
                  <div className="flex items-baseline gap-4">
                    <span className="type-mono text-black/60">{item.index}</span>
                    <span className="type-heading-lg tabular-nums">{item.metric}</span>
                  </div>
                  <p className="type-body mt-2">{item.title}</p>
                  <p className="type-body-sm mt-1 text-[#4a4600]">{item.note}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-6">
              <div
                className={reduceMotion ? 'hidden' : 'hidden items-center gap-2 md:flex'}
                role="tablist"
                aria-label="Practice pillars"
              >
                {MISSION_PILLARS.map((item, index) => (
                  <button
                    key={item.index}
                    type="button"
                    role="tab"
                    aria-selected={active === index}
                    onClick={() => jumpTo(index)}
                    className={`type-mono min-h-10 min-w-11 rounded-[6px] border px-3 transition-colors duration-200 ${
                      active === index
                        ? 'border-black bg-black text-[#fff313]'
                        : 'border-black/30 text-black/70 hover:border-black'
                    }`}
                  >
                    {item.index}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => onNavigate('systems')}
                className="type-body-sm inline-flex min-h-11 items-center gap-2 border-b border-black pb-1 transition-opacity hover:opacity-70"
              >
                Inspect our services
                <ArrowUpRight size={15} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/20 pt-5">
              <p className="type-micro max-w-[520px] text-black/60">
                {BUSINESS.aboutSecondary}
              </p>
              <p className="type-mono text-black/70">
                {BUSINESS.hours[0].label} {BUSINESS.hours[0].value} · {BUSINESS.phoneDisplay}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
