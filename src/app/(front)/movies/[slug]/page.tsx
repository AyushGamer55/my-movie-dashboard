import { type Metadata } from 'next';
import { handleMetadata } from '@/lib/utils';
import MoviePage from '../page';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  return handleMetadata(resolvedParams.slug, 'movies', 'movie');
}

export default async function Home() {
  return MoviePage();
}
