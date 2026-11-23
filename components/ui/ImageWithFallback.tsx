'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackClassName?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  menuName?: string;
}

const LEAF_SVG = (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 opacity-60">
    <path d="M32 8C18 8 8 20 8 32c0 8 4 15 10 20 2-8 6-14 14-18-8 4-12 10-12 18 4 2 8 4 12 4 14 0 24-10 24-24S46 8 32 8z" fill="#F2B84B" opacity="0.7"/>
    <path d="M32 12c-2 10-8 18-16 22 4-2 8-2 12-2-4 4-6 8-6 12 4-4 8-8 10-14 2 6 2 12 0 18 6-6 8-14 6-22 4 4 6 10 6 16 4-8 4-18-2-26-2-2-6-4-10-4z" fill="#24583F" opacity="0.8"/>
  </svg>
);

export default function ImageWithFallback({
  src,
  alt,
  width,
  height,
  className,
  fallbackClassName,
  priority = false,
  fill = false,
  sizes,
  menuName,
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-2 rounded-2xl overflow-hidden',
          'bg-gradient-to-br from-[#EBF3EE] via-[#D7E8DC] to-[#FEF8EC]',
          fallbackClassName || className
        )}
      >
        {LEAF_SVG}
        {menuName && (
          <span className="text-[10px] font-semibold text-[#24583F] text-center px-2 leading-tight opacity-80">
            {menuName}
          </span>
        )}
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes || '(max-width: 448px) 100vw, 448px'}
        className={cn('object-cover', className)}
        priority={priority}
        onError={() => setError(true)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width || 400}
      height={height || 300}
      className={cn('object-cover', className)}
      priority={priority}
      onError={() => setError(true)}
    />
  );
}
