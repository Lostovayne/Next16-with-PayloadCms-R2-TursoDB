import React from 'react';

import type { Page } from '@/payload-types';

import { HeroBasicComponent } from './HeroBasic/Component';

type LayoutBlock = NonNullable<Page['layout']>[number];

/**
 * Maps a stored `blockType` to the component that renders it.
 *
 * Adding a block means one entry here plus one entry in the `blocks` array of
 * the Pages collection. Payload's generated union keeps the two in step: a
 * block registered in the collection but missing here is a type error.
 */
const blockComponents: {
  [K in LayoutBlock['blockType']]: React.FC<Extract<LayoutBlock, { blockType: K }>>;
} = {
  heroBasic: HeroBasicComponent,
};

export const RenderBlocks: React.FC<{ blocks: Page['layout'] }> = ({ blocks }) => {
  if (!blocks || blocks.length === 0) return null;

  return (
    <>
      {blocks.map((block, index) => {
        const Component = blockComponents[block.blockType] as React.FC<LayoutBlock>;

        return <Component key={block.id ?? index} {...block} />;
      })}
    </>
  );
};
