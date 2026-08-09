import type { Block } from 'payload';

/**
 * Source-owned page block.
 *
 * The block lives in the repository rather than in a runtime package, so the
 * fields below are yours to edit. `interfaceName` is what makes
 * `payload generate:types` emit a named `HeroBasicBlock` interface instead of
 * an inline anonymous type, which is what lets the renderer stay typed.
 */
export const HeroBasic: Block = {
  slug: 'heroBasic',
  interfaceName: 'HeroBasicBlock',
  labels: {
    plural: 'Hero blocks',
    singular: 'Hero block',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'subheading',
      type: 'textarea',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional. Uploads resolve through the configured R2 bucket.',
      },
    },
    {
      name: 'links',
      type: 'array',
      maxRows: 2,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
};
