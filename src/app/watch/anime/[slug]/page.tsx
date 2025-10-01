import React from 'react';
import { notFound } from 'next/navigation';
import EmbedPlayer from '@/components/watch/embed-player';
import { MediaType } from '@/types';

export const revalidate = 3600;

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams.slug?.split('-').pop();
  if (!id || !id.startsWith('t') || isNaN(Number(id.replace('t-', '')))) {
    notFound();
  }
  const movieId = id;
  return (
    <EmbedPlayer
      movieId={movieId}
      mediaType={MediaType.ANIME}
      url={`https://vidsrc.cc/v2/embed/anime/tmdb${id}/1/sub?autoPlay=false`}
    />
  );
}
