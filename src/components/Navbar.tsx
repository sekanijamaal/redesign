import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { BUSINESS } from '../data/metalBridgesData';

export type SectionId =
  | 'hero'
  | 'structure'
  | 'mission'
  | 'systems'
  | 'deployments'
  | 'news'
  | 'videos'
  | 'quote';

interface NavbarProps {
  activeSection: SectionId;
  onNavigate: (id: SectionId) => void;
}

const LINKS: { id: SectionId; label: string }[] = [
  { id: 'systems', label: 'Services' },
  { id: 'structure', label: 'Craft' },
  { id: 'deployments', label: 'Projects' },
  { id: 'news', label: 'Dispatches' },
  { id: 'videos', label: 'Video Gallery' },
];

function isActive(link: SectionId, active: SectionId) {
  if (link === 'structure') return active === 'structure' || active === 'mission';
  return link === active;
}

export function Navbar({ activeSection, onNavigate }: NavbarProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (id: SectionId) => {
    setOpen(false);
    onNavigate(id);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[#4b4b4b]/50 bg-black/90 px-6 py-3 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-8">
        <button
          type="button"
          onClick={() => go('hero')}
          className="flex shrink-0 items-center gap-3 text-left"
          aria-label="METAL BRIDGES home"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-none bg-[#fff313] text-[11px] font-[400] leading-none tracking-[-0.02em] text-black">
            {BUSINESS.mark}
          </span>
          <span className="flex flex-col">
            <span className="text-[16px] leading-none tracking-[-0.02em] text-[#eeeeee]">
              {BUSINESS.name}
            </span>
            <span className="type-micro mt-1 hidden text-[#afafaf] sm:block">
              {BUSINESS.tagline}
            </span>
          </span>
        </button>

        <nav className="hidden items-center gap-2 md:flex" aria-label="Primary">
          {LINKS.map((link) => {
            const active = isActive(link.id, activeSection);
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => go(link.id)}
                aria-current={active ? 'true' : undefined}
                className={`rounded-[6px] border px-[14px] py-[5px] text-[14px] leading-none transition-colors duration-200 ${
                  active
                    ? 'border-[#fff313]/60 bg-[#333333] text-[#fff313]'
                    : 'border-transparent bg-[#333333] text-[#afafaf] hover:border-[#4b4b4b] hover:text-[#eeeeee]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => go('quote')}
            className="hidden rounded-[6px] bg-[#eeeeee] px-4 py-[7px] text-[14px] leading-none text-black transition-colors duration-200 hover:bg-[#fff313] sm:inline-flex"
          >
            Request Quote
          </button>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-[6px] border border-[#4b4b4b] text-[#eeeeee] md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="absolute inset-x-0 top-full border-b border-[#4b4b4b] bg-black px-6 py-4 md:hidden"
          aria-label="Mobile"
        >
          <div className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => go(link.id)}
                className={`flex min-h-11 items-center rounded-[6px] border px-4 text-left text-[14px] ${
                  isActive(link.id, activeSection)
                    ? 'border-[#fff313]/60 bg-[#333333] text-[#fff313]'
                    : 'border-[#4b4b4b] bg-[#333333] text-[#afafaf]'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => go('quote')}
              className="mt-2 flex min-h-11 items-center justify-center rounded-[6px] bg-[#eeeeee] px-4 text-[14px] text-black"
            >
              Request Quote
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
