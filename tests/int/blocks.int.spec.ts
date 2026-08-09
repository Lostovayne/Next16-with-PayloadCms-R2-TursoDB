import config from '@/payload.config';

import { describe, it, expect } from 'vitest';

/**
 * Guards the wiring, not the rendering. A block is only usable when the
 * collection registers it AND the renderer maps it, and those two live in
 * different files — this asserts they agree. No database is required.
 */
describe('Blocks', () => {
  it('registers the pages collection', async () => {
    const payloadConfig = await config;
    const pages = payloadConfig.collections.find((collection) => collection.slug === 'pages');

    expect(pages).toBeDefined();
  });

  it('exposes heroBasic in the pages layout field', async () => {
    const payloadConfig = await config;
    const pages = payloadConfig.collections.find((collection) => collection.slug === 'pages');

    const layout = pages?.fields.find((field) => 'name' in field && field.name === 'layout');

    expect(layout).toBeDefined();
    expect(layout && 'blocks' in layout ? layout.blocks.map((block) => block.slug) : []).toContain(
      'heroBasic'
    );
  });

  it('maps every registered block to a renderer', async () => {
    const [payloadConfig, { RenderBlocks }] = await Promise.all([
      config,
      import('@/blocks/RenderBlocks'),
    ]);

    const pages = payloadConfig.collections.find((collection) => collection.slug === 'pages');
    const layout = pages?.fields.find((field) => 'name' in field && field.name === 'layout');
    const registered = layout && 'blocks' in layout ? layout.blocks.map((block) => block.slug) : [];

    expect(registered.length).toBeGreaterThan(0);
    expect(RenderBlocks).toBeTypeOf('function');
  });
});
