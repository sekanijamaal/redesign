import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { ResilientImage } from './ResilientImage';
import {
  ADVANTAGES,
  SERVICES,
  SERVICE_FILTERS,
  type ServiceCategory,
} from '../data/metalBridgesData';
import type { QuotePrefill } from '../types';

gsap.registerPlugin(ScrollTrigger);

interface SystemsSectionProps {
  onOpenService: (serviceId: string) => void;
  onApplyQuote: (prefill: QuotePrefill) => void;
}

type Duty = 'light' | 'standard' | 'heavy';

const DUTY: { id: Duty; label: string; kgPerM: number; daysPerM: number }[] = [
  { id: 'light', label: 'Light duty', kgPerM: 22, daysPerM: 0.35 },
  { id: 'standard', label: 'Standard duty', kgPerM: 38, daysPerM: 0.55 },
  { id: 'heavy', label: 'Heavy duty', kgPerM: 62, daysPerM: 0.8 },
];

export function SystemsSection({ onOpenService, onApplyQuote }: SystemsSectionProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<ServiceCategory | 'all'>('all');
  const [runMetres, setRunMetres] = useState(20);
  const [duty, setDuty] = useState<Duty>('standard');

  const filtered =
    filter === 'all' ? SERVICES : SERVICES.filter((service) => service.category === filter);
  const dutySpec = DUTY.find((item) => item.id === duty) ?? DUTY[1];

  const steelKg = Math.round((runMetres * dutySpec.kgPerM) / 10) * 10;
  const days = Math.ceil(5 + runMetres * dutySpec.daysPerM);
  const crew = Math.min(8, Math.max(2, 2 + Math.round(runMetres / 18)));
  const bays = Math.ceil(runMetres / 14);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const panel = panelRef.current;
    if (reduceMotion || !panel) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        panel,
        { scale: 0.96, y: 36 },
        {
          scale: 1,
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: panel,
            start: 'top 90%',
            end: 'top 45%',
            scrub: true,
          },
        },
      );
    }, panel);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const grid = gridRef.current;
    if (reduceMotion || !grid) return;
    const cards = grid.querySelectorAll('[data-service-card]');
    const tween = gsap.from(cards, {
      y: 26,
      opacity: 0,
      duration: 0.45,
      stagger: 0.035,
      ease: 'power2.out',
    });
    return () => {
      tween.kill();
    };
  }, [filter]);

  const applyToQuote = () => {
    onApplyQuote({
      config: `${runMetres} m run · ${dutySpec.label} · ~${steelKg.toLocaleString('en-GB')} kg steel`,
      serviceValue: 'metal-fabrication',
    });
    const target = document.getElementById('quote');
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="systems" className="w-full bg-[#eeeeee] px-6 py-[120px] text-black md:px-10">
      <div className="mx-auto w-full max-w-[1360px]">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-black/15 pb-6">
          <div>
            <span className="type-mono text-black/60">Services catalogue</span>
            <h2 className="type-heading-lg mt-3 max-w-[18ch]">
              Seventeen trades, one workshop.
            </h2>
          </div>
          <p className="type-body-sm max-w-[360px] text-black/60">
            Every service below is fabricated in Tantra Hill and installed by our own crew.
            Open any specification to see materials, method, and warranty.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-1 rounded-[9px] bg-[#e0e0e0] p-1">
          {SERVICE_FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              aria-pressed={filter === item.id}
              className={`type-body-sm min-h-10 rounded-[6px] px-4 transition-colors duration-200 ${
                filter === item.id
                  ? 'bg-black text-[#eeeeee]'
                  : 'text-black/70 hover:bg-black/5'
              }`}
            >
              {item.label}
            </button>
          ))}
          <span className="type-mono ml-auto hidden items-center pr-3 text-black/50 sm:flex">
            {filtered.length} services
          </span>
        </div>

        <div
          ref={gridRef}
          className="mt-6 grid gap-x-4 gap-y-4 md:grid-cols-2"
          aria-live="polite"
        >
          {filtered.map((service) => (
            <article
              key={service.id}
              data-service-card
              className="flex flex-col rounded-[9px] border border-black/10 bg-[#e4e4e4] p-6"
            >
              <ResilientImage
                src={service.image}
                alt={service.imageAlt}
                className="aspect-[4/3] w-full rounded-[16px]"
                label={service.name}
              />

              <div className="mt-5 flex items-start justify-between gap-4">
                <p className="type-mono text-black/60">
                  {service.categoryLabel} · {service.tagline}
                </p>
                <p className="type-mono whitespace-nowrap text-black/60">{service.leadLabel}</p>
              </div>

              <h3 className="type-heading mt-3">{service.name}</h3>
              <p className="type-body-sm mt-2 max-w-[52ch] text-black/65">{service.summary}</p>

              <div className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-black/10 pt-5">
                <div className="space-y-1">
                  <p className="type-mono text-black/50">{service.scaleLabel}</p>
                  <p className="type-mono text-black/50">{service.finishLabel}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenService(service.id)}
                  className="type-body-sm inline-flex min-h-10 items-center gap-2 rounded-[6px] border border-black/20 bg-[#eeeeee] px-4 py-2 transition-colors duration-200 hover:border-black"
                >
                  Specifications
                  <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-20">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-black/15 pb-5">
            <h3 className="type-heading-lg">Why clients choose us.</h3>
            <p className="type-mono text-black/50">Eight commitments</p>
          </div>
          <div className="grid gap-x-10 gap-y-0 sm:grid-cols-2 lg:grid-cols-4">
            {ADVANTAGES.map((item, index) => (
              <div key={item.title} className="border-b border-black/10 py-6">
                <span className="type-mono text-black/40">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h4 className="type-body mt-3">{item.title}</h4>
                <p className="type-body-sm mt-2 text-black/60">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div
          ref={panelRef}
          className="mt-20 rounded-[9px] border border-[#4b4b4b] bg-black p-6 text-[#eeeeee] will-change-transform md:p-10"
        >
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
            <div>
              <span className="type-mono text-[#fff313]">Preliminary scope</span>
              <h3 className="type-heading-lg mt-3 max-w-[16ch] text-[#eeeeee]">
                Size a steel run before the survey.
              </h3>
              <p className="type-body-sm mt-3 max-w-[420px] text-[#afafaf]">
                Indicative only. Final tonnage, programme, and price are confirmed after a
                site measure.
              </p>

              <div className="mt-8">
                <div className="flex items-baseline justify-between">
                  <label htmlFor="run-metres" className="type-mono text-[#afafaf]">
                    Structural run
                  </label>
                  <span className="type-heading tabular-nums text-[#eeeeee]">
                    {runMetres} m
                  </span>
                </div>
                <input
                  id="run-metres"
                  type="range"
                  min={2}
                  max={100}
                  step={2}
                  value={runMetres}
                  onChange={(event) => setRunMetres(Number(event.target.value))}
                  className="on-range mt-4"
                />
                <div className="type-micro mt-2 flex justify-between text-[#afafaf]">
                  <span>2 m</span>
                  <span>100 m</span>
                </div>
              </div>

              <div className="mt-8">
                <p className="type-mono text-[#afafaf]">Duty</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {DUTY.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setDuty(item.id)}
                      aria-pressed={duty === item.id}
                      className={`type-body-sm min-h-10 rounded-[6px] border px-4 transition-colors duration-200 ${
                        duty === item.id
                          ? 'border-[#eeeeee] bg-[#eeeeee] text-black'
                          : 'border-[#4b4b4b] bg-[#1a1a1a] text-[#afafaf] hover:border-[#afafaf]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 self-end">
              {[
                { label: 'Estimated steel', value: `${steelKg.toLocaleString('en-GB')} kg` },
                { label: 'Fabrication days', value: `${days}` },
                { label: 'Crew on site', value: `${crew}` },
                { label: 'Workshop bays', value: `${bays}` },
              ].map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-[6px] border border-[#333333] bg-[#111111] p-4"
                >
                  <p className="type-mono text-[#afafaf]">{metric.label}</p>
                  <p className="type-heading-lg mt-3 tabular-nums text-[#fff313]">
                    {metric.value}
                  </p>
                </div>
              ))}

              <div className="col-span-2 mt-3">
                <button
                  type="button"
                  onClick={applyToQuote}
                  className="type-body-sm inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[6px] bg-[#eeeeee] px-5 py-3 text-black transition-colors duration-200 hover:bg-[#fff313]"
                >
                  Apply to quote request
                  <ArrowUpRight size={15} strokeWidth={1.5} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
