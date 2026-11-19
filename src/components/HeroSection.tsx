import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ResilientImage } from './ResilientImage';
import { DISPATCHES, HERO_STATS, IMAGES } from '../data/metalBridgesData';
import type { SectionId } from './Navbar';
import type { Dispatch } from '../data/metalBridgesData';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  onNavigate: (id: SectionId) => void;
  onOpenService: (serviceId: string) => void;
  onOpenArticle: (article: Dispatch) => void;
}

export function HeroSection({
  onNavigate,
  onOpenService,
  onOpenArticle,
}: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(backgroundRef.current, {
        scale: 1.14,
        yPercent: 10,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to(headlineRef.current, {
        y: -56,
        opacity: 0.35,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to(cardRef.current, {
        y: -28,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex min-h-[94vh] w-full flex-col overflow-hidden bg-black px-6 pb-10 pt-28 md:px-10"
    >
      <div ref={backgroundRef} className="absolute inset-0 h-full w-full will-change-transform">
        <ResilientImage
          src={IMAGES.hero}
          alt="Metal fabrication workshop with structural steel"
          className="h-full w-full opacity-75"
          imageClassName="object-cover"
          label="Workshop imagery unavailable"
          eager
        />
      </div>
      <div className="absolute inset-0 bg-black/45" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-between">
        <div ref={headlineRef} className="max-w-[920px] pt-10 will-change-transform md:pt-16">
          <span className="type-mono text-[#fff313]">
            Accra · Ghana · Fabrication since 2014
          </span>
          <h1 className="type-display mt-6 max-w-[18ch] text-[#eeeeee]">
            Building strength in steel, crafting excellence.
          </h1>
          <p className="type-body mt-6 max-w-[460px] text-[#afafaf]">
            Precision metal fabrication and modern welding solutions. From concept to
            completion, we deliver durable, innovative, and high-quality metal structures.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <button
              type="button"
              onClick={() => onNavigate('systems')}
              className="inline-flex min-h-11 items-center gap-2 rounded-[6px] border border-[#4b4b4b] bg-[#333333] px-5 py-3 text-[14px] text-[#eeeeee] transition-colors duration-200 hover:border-[#fff313]"
            >
              Explore Services
              <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onOpenArticle(DISPATCHES[0])}
              className="type-body-sm inline-flex min-h-11 items-center gap-2 text-[#afafaf] transition-colors duration-200 hover:text-[#fff313]"
            >
              Watch the build
              <ArrowUpRight size={15} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>

          <p className="type-mono mt-8 text-[#afafaf]">
            BS EN 1090 · ISO 3834 · 150+ projects delivered
          </p>
        </div>

        <div className="mt-16 flex flex-col gap-8 pb-2 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1">
            <p className="type-mono text-[#afafaf]">Tantra Hill · Accra</p>
            <p className="type-mono text-[#afafaf]">Residential to industrial fabrication</p>
            <p className="type-mono text-[#afafaf]">12+ years · 25+ skilled professionals</p>
          </div>

          <div
            ref={cardRef}
            className="w-full max-w-[400px] will-change-transform sm:w-[400px]"
          >
            <button
              type="button"
              onClick={() => onOpenService('gates')}
              className="w-full rounded-[9px] border border-[#4b4b4b] bg-[#333333] p-6 text-left transition-colors duration-200 hover:border-[#fff313]/70"
              aria-label="Open specifications for gates"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="type-mono text-[#fff313]">Featured build · Gates</span>
                <ArrowUpRight
                  size={16}
                  strokeWidth={1.5}
                  className="mt-0.5 shrink-0 text-[#eeeeee]"
                  aria-hidden="true"
                />
              </div>
              <div className="mt-5 flex items-end justify-between gap-5">
                <div>
                  <p className="type-heading text-[#eeeeee]">Modern Sliding Gate</p>
                  <p className="type-mono mt-2 text-[#afafaf]">
                    4.8 m span · Matte black finish
                  </p>
                </div>
                <ResilientImage
                  src={IMAGES.gates}
                  alt="Modern steel sliding gate"
                  className="h-[78px] w-[104px] shrink-0 rounded-[6px]"
                  label="Gate"
                />
              </div>
            </button>
          </div>
        </div>

        <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-[#4b4b4b]/60 pt-6 sm:grid-cols-4">
          {HERO_STATS.map((stat) => (
            <div key={stat.label}>
              <dt className="type-mono text-[#afafaf]">{stat.label}</dt>
              <dd className="mt-2 flex items-baseline gap-1 text-[#eeeeee]">
                <span className="type-heading-lg tabular-nums">{stat.value}</span>
                <span className="type-mono text-[#fff313]">{stat.suffix}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
