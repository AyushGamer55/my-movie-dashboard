import React from 'react';
import { notFound } from 'next/navigation';
import EmbedPlayer from '@/components/watch/embed-player';

export const revalidate = 3600;

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams.slug?.split('-').pop();
  if (!id || isNaN(Number(id))) {
    notFound();
  }
  return <EmbedPlayer url={`https://vidsrc.cc/v2/embed/movie/${id}`} />;
}
