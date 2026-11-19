import { useState } from 'react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  label?: string;
  eager?: boolean;
}

/**
 * Renders a remote image with `referrerPolicy="no-referrer"` and a flat,
 * branded schematic fallback if the asset fails to load.
 */
export function ResilientImage({
  src,
  alt,
  className = '',
  imageClassName = '',
  label,
  eager = false,
}: ResilientImageProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-[#1a1a1a] ${className}`}
      data-image-state={failed ? 'fallback' : 'loaded'}
    >
      {failed ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 border border-[#4b4b4b] bg-[#1a1a1a] p-4 text-center">
          <svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff313"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="4" width="18" height="16" rx="1" />
            <path d="M3 9h18M3 15h18M8 4v16M16 4v16" />
            <path d="M11 11.5v3M13 11.5v3" />
          </svg>
          <span className="type-mono text-[#afafaf]">{label ?? 'Image unavailable'}</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover ${imageClassName}`}
        />
      )}
    </div>
  );
}
