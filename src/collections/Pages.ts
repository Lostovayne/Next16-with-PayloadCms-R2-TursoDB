import type { CollectionConfig } from 'payload';

import { HeroBasic } from '../blocks/HeroBasic/config';

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Served at /<slug>.',
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [HeroBasic],
      admin: {
        description: 'Compose the page from the blocks registered in src/blocks.',
      },
    },
  ],
};
