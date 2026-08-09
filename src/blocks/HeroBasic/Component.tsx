import React from 'react';

import type { HeroBasicBlock } from '@/payload-types';

/**
 * Renderer for the `heroBasic` block.
 *
 * Props are the generated block interface, so a field added in `config.ts`
 * becomes a type error here until it is handled — that coupling is the point
 * of the example.
 */
export const HeroBasicComponent: React.FC<HeroBasicBlock> = ({
  heading,
  image,
  links,
  subheading,
}) => {
  // Depth-0 queries return an ID; a populated query returns the Media document.
  const media = typeof image === 'object' ? image : null;

  return (
    <section className="hero-basic">
      <h1>{heading}</h1>

      {subheading && <p className="hero-basic__subheading">{subheading}</p>}

      {/* Not next/image: R2 serves media from a bucket host that the template
          does not register in images.remotePatterns. */}
      {media?.url && <img alt={media.alt} className="hero-basic__image" src={media.url} />}

      {links && links.length > 0 && (
        <div className="hero-basic__links">
          {links.map((link) => (
            <a href={link.url} key={link.id ?? link.url}>
              {link.label}
            </a>
          ))}
        </div>
      )}
    </section>
  );
};
