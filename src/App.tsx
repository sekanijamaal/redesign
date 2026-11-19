import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Navbar, type SectionId } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { YellowStatementSection } from './components/YellowStatementSection';
import { SystemsSection } from './components/SystemsSection';
import { DeploymentsSection } from './components/DeploymentsSection';
import { NewsSection } from './components/NewsSection';
import { VideoGallerySection } from './components/VideoGallerySection';
import { QuoteSection } from './components/QuoteSection';
import type { QuotePrefill } from './types';
import { Footer } from './components/Footer';
import { ArticleReaderModal, ServiceSpecModal } from './components/Modals';
import { SERVICES, type Dispatch, type Service } from './data/metalBridgesData';

const Gate3DShowcase = lazy(() =>
  import('./components/three/Gate3DShowcase').then((module) => ({
    default: module.Gate3DShowcase,
  })),
);

const SECTION_IDS: SectionId[] = [
  'hero',
  'structure',
  'mission',
  'systems',
  'deployments',
  'news',
  'videos',
  'quote',
];

function Rack3DFallback() {
  return (
    <section
      id="structure"
      className="relative flex min-h-[640px] w-full items-center justify-center bg-black px-6 py-24"
    >
      <div className="max-w-[560px] text-center">
        <span className="type-mono text-[#fff313]">3D CUTAWAY</span>
        <p className="type-heading-lg mt-4 text-[#eeeeee]">
          The interactive gate inspection needs WebGL.
        </p>
        <p className="type-body mt-4 text-[#afafaf]">
          Enable hardware acceleration to explore the frame, infill array, and hardware
          layer by layer.
        </p>
      </div>
    </section>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('hero');
  const [serviceModal, setServiceModal] = useState<Service | null>(null);
  const [articleModal, setArticleModal] = useState<Dispatch | null>(null);
  const [quotePrefill, setQuotePrefill] = useState<QuotePrefill | null>(null);

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (element): element is HTMLElement => Boolean(element),
    );

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as SectionId);
          }
        });
      },
      { rootMargin: '-35% 0px -55% 0px' },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const navigate = useCallback((id: SectionId) => {
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const openService = useCallback((serviceId: string) => {
    const service = SERVICES.find((item) => item.id === serviceId);
    if (service) setServiceModal(service);
  }, []);

  const applyQuote = useCallback((prefill: QuotePrefill) => {
    setQuotePrefill(prefill);
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-black text-[#eeeeee]">
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-[6px] focus:bg-[#fff313] focus:px-4 focus:py-2 focus:text-black"
      >
        Skip to content
      </a>

      <Navbar activeSection={activeSection} onNavigate={navigate} />

      <main>
        <HeroSection
          onNavigate={navigate}
          onOpenService={openService}
          onOpenArticle={setArticleModal}
        />

        <div className="w-full">
          <Suspense fallback={<Rack3DFallback />}>
            <Gate3DShowcase />
          </Suspense>
        </div>

        <YellowStatementSection onNavigate={navigate} />
        <SystemsSection onOpenService={openService} onApplyQuote={applyQuote} />
        <DeploymentsSection onOpenService={openService} />
        <NewsSection onOpenArticle={setArticleModal} />
        <VideoGallerySection />
        <QuoteSection prefill={quotePrefill} />
      </main>

      <Footer onNavigate={navigate} />

      <ServiceSpecModal
        service={serviceModal}
        onClose={() => setServiceModal(null)}
        onRequestQuote={(service) => {
          setServiceModal(null);
          setQuotePrefill({
            config: `${service.name} — ${service.scaleLabel}`,
            serviceValue: service.id,
          });
          navigate('quote');
        }}
      />

      <ArticleReaderModal article={articleModal} onClose={() => setArticleModal(null)} />
    </div>
  );
}
