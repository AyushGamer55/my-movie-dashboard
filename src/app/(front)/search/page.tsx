import SearchContainer from '@/components/search-container';
import MovieService from '@/services/MovieService';
import { redirect } from 'next/navigation';

interface SearchProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export const revalidate = 3600;

export default async function SearchPage({ searchParams }: SearchProps) {
  const resolvedSearchParams = await searchParams;
  if (!resolvedSearchParams?.q?.trim()?.length) {
    redirect('/home');
  }

  const shows = await MovieService.searchMovies(resolvedSearchParams.q);
  return <SearchContainer query={resolvedSearchParams.q} shows={shows.results} />;
}
