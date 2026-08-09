import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import React from 'react';

import { RenderBlocks } from '@/blocks/RenderBlocks';
import config from '@/payload.config';

const findPage = async (slug: string) => {
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });

  const { docs } = await payload.find({
    collection: 'pages',
    depth: 1,
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  return docs[0] ?? null;
};

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const page = await findPage(slug);

  return { title: page?.title ?? 'Not found' };
}

export default async function PageRoute(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const page = await findPage(slug);

  if (!page) notFound();

  return <RenderBlocks blocks={page.layout} />;
}
