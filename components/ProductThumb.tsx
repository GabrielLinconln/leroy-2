"use client";

import { useState } from "react";
import { CategoryIcon } from "./CategoryIcon";

/**
 * Miniatura compacta (4:3 ou quadrada) para listas, mapa, chat e etiquetas ESL.
 * Preenche o enquadramento com object-cover (sem sobras brancas desproporcionais).
 */
export function ProductThumb({
  src,
  alt,
  category,
  size = 64,
  className = "",
}: {
  src?: string;
  alt: string;
  category: string;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <CategoryIcon category={category} size={size} />;
  }

  return (
    <div
      className={`relative flex-shrink-0 overflow-hidden rounded-lg border border-rule bg-[#F4F5F7] ${className}`}
      style={{ width: size, height: Math.round(size * 0.78) }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setFailed(true)}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

/**
 * Mídia full-bleed 4:3 para cards de catálogo e vitrine (proporção equilibrada de e-commerce).
 */
export function ProductCardMedia({
  src,
  alt,
  category,
  className = "",
}: {
  src?: string;
  alt: string;
  category: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex aspect-[4/3] w-full items-center justify-center bg-[#F4F5F7] ${className}`}
      >
        <CategoryIcon category={category} size={56} />
      </div>
    );
  }

  return (
    <div
      className={`relative aspect-[4/3] w-full overflow-hidden bg-[#F4F5F7] ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setFailed(true)}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
      />
    </div>
  );
}
