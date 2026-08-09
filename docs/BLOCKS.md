# Page blocks

The template ships one example block so page composition has a working
reference. Everything lives in the repository as source — there is no runtime
package and no hidden abstraction.

## Layout

```
src/blocks/
  HeroBasic/
    config.ts        # Payload block config (fields)
    Component.tsx    # React renderer
  RenderBlocks.tsx   # blockType -> component map
src/collections/
  Pages.ts           # pages collection, layout blocks field
src/app/(frontend)/
  [slug]/page.tsx    # resolves a slug, renders its layout
```

## How the wiring holds together

A block is only usable when four things agree:

1. **The block config** declares the fields (`src/blocks/HeroBasic/config.ts`).
2. **The collection** registers the block in its `layout` field
   (`src/collections/Pages.ts`).
3. **The renderer** maps the stored `blockType` to a component
   (`src/blocks/RenderBlocks.tsx`).
4. **Generated types** describe the result (`src/payload-types.ts`).

`interfaceName: 'HeroBasicBlock'` in the block config is what makes
`payload generate:types` emit a named interface rather than an inline
anonymous type. The renderer takes that interface as its props, so adding a
field to the config and forgetting the renderer is a type error rather than a
silent blank spot on the page.

`RenderBlocks` is typed against the generated union, so registering a block in
the collection without adding it to the map also fails `tsc`.

## Adding a block

```bash
mkdir -p src/blocks/MyBlock
# write config.ts and Component.tsx
```

Then:

1. Add the block to the `blocks` array in `src/collections/Pages.ts`.
2. Add the `blockType` entry to `blockComponents` in `src/blocks/RenderBlocks.tsx`.
3. Regenerate:

```bash
pnpm generate:types
pnpm generate:importmap
```

`generate:importmap` only matters if the block ships custom admin components.
The example block does not, but the command is safe to run either way.

## Trying it

1. `pnpm dev`
2. In the admin panel, create a **Page** with a title, a slug, and a Hero block.
3. Visit `/<slug>`.

Pages are readable without authentication (`access.read` returns `true`), which
is what a public marketing page needs. Tighten it if your pages are not public.

## Removing the example

The block is additive and self-contained:

```bash
rm -rf src/blocks src/app/\(frontend\)/\[slug\] src/collections/Pages.ts tests/int/blocks.int.spec.ts
```

Then drop `Pages` from the `collections` array and its import in
`src/payload.config.ts`, delete the `Blocks` section at the end of
`src/app/(frontend)/styles.css`, and run `pnpm generate:types`.

Nothing else in the template references these files — authentication, storage,
Docker, and CI are untouched.
