import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { ResilientImage } from './ResilientImage';
import {
  DEPLOYMENT_CASES,
  PROJECTS,
  PROJECT_FILTERS,
  TESTIMONIALS,
  type ProjectCategory,
} from '../data/metalBridgesData';

gsap.registerPlugin(ScrollTrigger);

interface DeploymentsSectionProps {
  onOpenService: (serviceId: string) => void;
}

const CASE_SERVICE: Record<string, string> = {
  'east-legon': 'gates',
  tema: 'roofing-structures',
  osu: 'balustrades-handrails',
  cantonments: 'security-doors',
};

export function DeploymentsSection({ onOpenService }: DeploymentsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const portfolioRef = useRef<HTMLDivElement>(null);
  const [activeCase, setActiveCase] = useState(0);
  const [projectFilter, setProjectFilter] = useState<ProjectCategory | 'all'>('all');

  const site = DEPLOYMENT_CASES[activeCase];
  const filteredProjects =
    projectFilter === 'all'
      ? PROJECTS
      : PROJECTS.filter((project) => project.category === projectFilter);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const section = sectionRef.current;
    if (reduceMotion || !section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        frameRef.current,
        { scale: 0.91, borderRadius: '24px' },
        {
          scale: 1,
          borderRadius: '16px',
          ease: 'none',
          scrollTrigger: {
            trigger: frameRef.current,
            start: 'top 85%',
            end: 'top 35%',
            scrub: true,
          },
        },
      );

      gsap.fromTo(
        photoRef.current,
        { yPercent: -6, scale: 1.08 },
        {
          yPercent: 6,
          scale: 1.02,
          ease: 'none',
          scrollTrigger: {
            trigger: frameRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const grid = portfolioRef.current;
    if (reduceMotion || !grid) return;
    const cards = grid.querySelectorAll('[data-project-card]');
    const tween = gsap.from(cards, {
      y: 24,
      opacity: 0,
      duration: 0.4,
      stagger: 0.03,
      ease: 'power2.out',
    });
    return () => {
      tween.kill();
    };
  }, [projectFilter]);

  return (
    <section id="deployments" ref={sectionRef} className="w-full bg-black px-6 py-[120px] md:px-10">
      <div className="mx-auto w-full max-w-[1360px]">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[#4b4b4b]/60 pb-6">
          <div>
            <span className="type-mono text-[#fff313]">Field work</span>
            <h2 className="type-heading-lg mt-3 max-w-[18ch] text-[#eeeeee]">
              Delivered across Greater Accra.
            </h2>
          </div>
          <p className="type-body-sm max-w-[360px] text-[#afafaf]">
            Residential, commercial, and industrial sites — measured, fabricated, and
            installed by the same crew.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-1">
          {DEPLOYMENT_CASES.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveCase(index)}
              aria-pressed={activeCase === index}
              className={`type-body-sm min-h-10 rounded-[6px] border px-4 transition-colors duration-200 ${
                activeCase === index
                  ? 'border-[#eeeeee] bg-[#eeeeee] text-black'
                  : 'border-[#4b4b4b] bg-[#1a1a1a] text-[#afafaf] hover:border-[#afafaf] hover:text-[#eeeeee]'
              }`}
            >
              {item.site}
            </button>
          ))}
        </div>

        <div
          ref={frameRef}
          className="mt-6 overflow-hidden rounded-[16px] border border-[#4b4b4b] will-change-transform"
        >
          <div ref={photoRef} className="will-change-transform">
            <div key={site.id} className="mb-fade">
              <ResilientImage
                src={site.image}
                alt={site.imageAlt}
                className="aspect-[16/9] max-h-[560px] w-full"
                label={site.title}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <p className="type-mono text-[#fff313]">
              {site.location} · {site.commissioned}
            </p>
            <h3 className="type-heading-lg mt-3 text-[#eeeeee]">{site.title}</h3>
            <p className="type-body-sm mt-3 max-w-[520px] text-[#afafaf]">{site.summary}</p>
            <button
              type="button"
              onClick={() => onOpenService(CASE_SERVICE[site.id] ?? 'metal-fabrication')}
              className="type-body-sm mt-5 inline-flex min-h-10 items-center gap-2 border-b border-[#4b4b4b] pb-1 text-[#eeeeee] transition-colors hover:border-[#fff313] hover:text-[#fff313]"
            >
              Service specification
              <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
            </button>
            <p className="type-mono mt-6 text-[#afafaf]">{site.scope}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {site.metrics.map((metric, index) => (
              <div
                key={metric.label}
                className="rounded-[9px] border border-[#4b4b4b] bg-[#333333] p-5"
              >
                <p className="type-mono text-[#afafaf]">{metric.label}</p>
                <p
                  className={`type-heading-lg mt-3 tabular-nums ${
                    index === 1 ? 'text-[#fff313]' : 'text-[#eeeeee]'
                  }`}
                >
                  {metric.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#4b4b4b]/60 pb-5">
            <h3 className="type-heading-lg text-[#eeeeee]">Complete portfolio.</h3>
            <p className="type-mono text-[#afafaf]">{PROJECTS.length} projects</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-1">
            {PROJECT_FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setProjectFilter(item.id)}
                aria-pressed={projectFilter === item.id}
                className={`type-body-sm min-h-10 rounded-[6px] border px-4 transition-colors duration-200 ${
                  projectFilter === item.id
                    ? 'border-[#eeeeee] bg-[#eeeeee] text-black'
                    : 'border-[#4b4b4b] bg-[#1a1a1a] text-[#afafaf] hover:border-[#afafaf] hover:text-[#eeeeee]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div
            ref={portfolioRef}
            className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            aria-live="polite"
          >
            {filteredProjects.map((project) => (
              <figure
                key={project.id}
                data-project-card
                className="group relative overflow-hidden rounded-[9px] border border-[#333333] bg-[#111111]"
              >
                <ResilientImage
                  src={project.image}
                  alt={project.imageAlt}
                  className="aspect-[4/3] w-full"
                  imageClassName="transition-transform duration-500 group-hover:scale-[1.04]"
                  label={project.title}
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-black/85 p-4">
                  <span className="type-mono text-[#fff313]">{project.categoryLabel}</span>
                  <p className="type-body mt-1 text-[#eeeeee]">{project.title}</p>
                  <p className="type-body-sm mt-1 text-[#afafaf]">{project.description}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="mt-24">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#4b4b4b]/60 pb-5">
            <h3 className="type-heading-lg text-[#eeeeee]">Client words.</h3>
            <p className="type-mono text-[#afafaf]">Verified handovers</p>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {TESTIMONIALS.map((testimonial) => (
              <blockquote
                key={testimonial.id}
                className="rounded-[9px] border border-[#333333] bg-[#111111] p-6"
              >
                <p className="type-body text-[#eeeeee]">“{testimonial.quote}”</p>
                <footer className="mt-5 border-t border-[#333333] pt-4">
                  <p className="type-body-sm text-[#eeeeee]">{testimonial.name}</p>
                  <p className="type-mono mt-1 text-[#afafaf]">{testimonial.title}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
