import { Facebook, Instagram, Twitter } from 'lucide-react';
import { BUSINESS } from '../data/metalBridgesData';
import type { SectionId } from './Navbar';

interface FooterProps {
  onNavigate: (id: SectionId) => void;
}

const LINKS: { id: SectionId; label: string }[] = [
  { id: 'systems', label: 'Services' },
  { id: 'structure', label: 'Craft' },
  { id: 'deployments', label: 'Projects' },
  { id: 'news', label: 'Dispatches' },
  { id: 'videos', label: 'Video Gallery' },
  { id: 'quote', label: 'Request Quote' },
];

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="w-full border-t border-[#4b4b4b]/60 bg-black px-6 py-8 md:px-10">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-none bg-[#fff313] text-[10px] font-[400] leading-none tracking-[-0.02em] text-black">
            {BUSINESS.mark}
          </span>
          <div className="flex flex-col">
            <span className="type-body-sm leading-none text-[#eeeeee]">{BUSINESS.name}</span>
            <span className="type-micro mt-1 text-[#afafaf]">{BUSINESS.tagline}</span>
          </div>
        </div>

        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer">
          {LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => onNavigate(link.id)}
              className="type-body-sm min-h-9 text-[#afafaf] transition-colors hover:text-[#eeeeee]"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          {[
            { label: 'Facebook', Icon: Facebook },
            { label: 'Instagram', Icon: Instagram },
            { label: 'Twitter', Icon: Twitter },
          ].map(({ label, Icon }) => (
            <a
              key={label}
              href="#"
              aria-label={label}
              className="inline-flex h-10 w-10 items-center justify-center rounded-[6px] border border-[#4b4b4b] text-[#afafaf] transition-colors hover:border-[#fff313] hover:text-[#eeeeee]"
            >
              <Icon size={15} strokeWidth={1.5} aria-hidden="true" />
            </a>
          ))}
        </div>

        <div className="flex flex-col gap-1 md:items-end">
          <a
            href={BUSINESS.phoneHref}
            className="type-mono text-[#eeeeee] transition-colors hover:text-[#fff313]"
          >
            {BUSINESS.phoneDisplay}
          </a>
          <p className="type-mono text-[#afafaf]">
            © 2026 {BUSINESS.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
