'use client';

import React from 'react';
import { type Show, type NavItem } from '@/types';
import Link from 'next/link';
import {
  cn,
  getSearchValue,
  handleDefaultSearchBtn,
  handleDefaultSearchInp,
  getSlug,
  getNameFromShow,
} from '@/lib/utils';
import { siteConfig } from '@/configs/site';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { PlayIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useSearchStore } from '@/stores/search';
import { ModeToggle as ThemeToggle } from '@/components/theme-toggle';
import { DebouncedInput } from '@/components/debounced-input';
import MovieService from '@/services/MovieService';
import { RequestType } from '@/enums/request-type';
import { MediaType } from '@/types';

interface MainNavProps {
  readonly items?: NavItem[];
}

interface SearchResult {
  results: Show[];
}

export function MainNav({ items }: MainNavProps) {
  const path = usePathname();
  const router = useRouter();
  // search store
  const searchStore = useSearchStore();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isRolling, setIsRolling] = React.useState(false);

  const handleRandom = async () => {
    setIsRolling(true);
    try {
      const movieReq = {
        requestType: RequestType.POPULAR,
        mediaType: MediaType.MOVIE as MediaType,
        page: 1,
      };
      const tvReq = {
        requestType: RequestType.POPULAR,
        mediaType: MediaType.TV as MediaType,
        page: 1,
      };
      const animeReq = {
        requestType: RequestType.ANIME_TRENDING,
        mediaType: MediaType.TV as MediaType,
        page: 1,
      };

      const [moviesRes, tvRes, animeRes] = await Promise.all([
        MovieService.executeRequest(movieReq),
        MovieService.executeRequest(tvReq),
        MovieService.executeRequest(animeReq),
      ]);

      const allShows = [
        ...moviesRes.results.map((show) => ({ ...show, type: 'movie' })),
        ...tvRes.results.map((show) => ({ ...show, type: 'tv' })),
        ...animeRes.results.map((show) => ({ ...show, type: 'anime' })),
      ].filter((show) => show.id);

      if (!allShows.length) {
        setIsRolling(false);
        return;
      }

      const crypto = window.crypto || (window as any).msCrypto;
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      const randomIndex = array[0] % allShows.length;
      const randomShow = allShows[randomIndex];

      let url: string;

      if (randomShow.type === 'movie') {
        url = `/watch/movie/${getSlug(randomShow.id, getNameFromShow(randomShow))}`;
      } else if (randomShow.type === 'anime') {
        url = `/watch/anime/${getSlug(randomShow.id, getNameFromShow(randomShow))}`;
      } else {
        url = `/watch/tv/${getSlug(randomShow.id, getNameFromShow(randomShow))}`;
      }

      router.push(url);
    } catch {
      // Error fetching random show
    } finally {
      setTimeout(() => setIsRolling(false), 1500);
    }
  };

  React.useEffect(() => {
    window.addEventListener('popstate', handlePopstateEvent, false);
    return () => {
      window.removeEventListener('popstate', handlePopstateEvent, false);
    };
  }, []);

  const handlePopstateEvent = () => {
    const pathname = window.location.pathname;
    const search: string = getSearchValue('q');

    if (!search?.length || !pathname.includes('/search')) {
      searchStore.reset();
      searchStore.setOpen(false);
    } else if (search?.length) {
      searchStore.setOpen(true);
      searchStore.setLoading(true);
      searchStore.setQuery(search);
      setTimeout(() => {
        handleDefaultSearchBtn();
      }, 10);
      setTimeout(() => {
        handleDefaultSearchInp();
      }, 20);
      MovieService.searchMovies(search)
        .then((response: SearchResult) => {
          searchStore.setShows(response.results);
        })
        .catch((_e) => {})
        .finally(() => searchStore.setLoading(false));
    }
  };

  async function searchShowsByQuery(value: string) {
    if (!value?.trim()?.length) {
      if (path === '/search') {
        router.push('/home');
      } else {
        window.history.pushState(null, '', path);
      }
      return;
    }

    if (getSearchValue('q')?.trim()?.length) {
      window.history.replaceState(null, '', `search?q=${value}`);
    } else {
      window.history.pushState(null, '', `search?q=${value}`);
    }

    searchStore.setQuery(value);
    searchStore.setLoading(true);
    const shows = await MovieService.searchMovies(value);
    searchStore.setLoading(false);
    searchStore.setShows(shows.results);

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // change background color on scroll
  React.useEffect(() => {
    const changeBgColor = () => {
      window.scrollY > 0 ? setIsScrolled(true) : setIsScrolled(false);
    };
    window.addEventListener('scroll', changeBgColor);
    return () => window.removeEventListener('scroll', changeBgColor);
  }, [isScrolled]);

  const handleChangeStatusOpen = (value: boolean): void => {
    searchStore.setOpen(value);
    if (!value) searchStore.reset();
  };

  return (
    <nav
      className={cn(
        'relative flex h-12 w-full items-center justify-between bg-gradient-to-b from-secondary/70 from-10% px-[4vw] transition-colors duration-300 md:sticky md:h-16',
        isScrolled ? 'bg-secondary shadow-md' : 'bg-transparent',
      )}>
      <div className="flex items-center gap-6 md:gap-10">
        <Link
          href="/"
          className="hidden md:block"
          onClick={() => handleChangeStatusOpen(false)}>
          <div className="flex items-center space-x-2">
            <PlayIcon className="h-6 w-6" aria-hidden="true" />
            <span className="inline-block font-bold">{siteConfig.name}</span>
            <span className="sr-only">Home</span>
          </div>
        </Link>
        {items?.length ? (
          <nav className="hidden gap-6 md:flex">
            {items?.map(
              (item) =>
                item.href && (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={cn(
                      'flex items-center text-sm font-medium text-foreground/60 transition hover:text-foreground/80',
                      path === item.href && 'font-bold text-foreground',
                      item.disabled && 'cursor-not-allowed opacity-80',
                    )}
                    onClick={() => handleChangeStatusOpen(false)}>
                    {item.title}
                  </Link>
                ),
            )}
          </nav>
        ) : null}
        <div className="block md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-2 px-0 hover:bg-transparent focus:ring-0"
                // className="h-auto px-2 py-1.5 text-base hover:bg-neutral-800 focus:ring-0 dark:hover:bg-neutral-800 lg:hidden"
              >
                <PlayIcon className="h-6 w-6" />
                <span className="text-base font-bold">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              sideOffset={20}
              // className="w-52 overflow-y-auto overflow-x-hidden rounded-sm bg-neutral-800 text-slate-200 dark:bg-neutral-800 dark:text-slate-200"
              className="w-52 overflow-y-auto overflow-x-hidden rounded-sm">
              <DropdownMenuLabel>
                <Link
                  href="/"
                  className="flex items-center justify-center"
                  onClick={() => handleChangeStatusOpen(false)}>
                  {/* <Icons.logo */}
                  {/*   className="mr-2 h-4 w-4 text-red-600" */}
                  {/*   aria-hidden="true" */}
                  {/* /> */}
                  <span className="">{siteConfig.name}</span>
                </Link>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {items?.map((item) => (
                <DropdownMenuItem
                  key={item.title}
                  asChild
                  className="items-center justify-center">
                  {item.href && (
                    <Link
                      href={item.href}
                      onClick={() => handleChangeStatusOpen(false)}>
                      {/* {item.icon &&  */}
                      {/*   <item.icon className="mr-2 h-4 w-4" aria-hidden="true" /> */}
                      {/* } */}
                      <span
                        className={cn(
                          'line-clamp-1 text-foreground/60 hover:text-foreground/80',
                          path === item.href && 'font-bold text-foreground',
                        )}>
                        {item.title}
                      </span>
                    </Link>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <DebouncedInput
          id="search-input"
          open={searchStore.isOpen}
          value={searchStore.query}
          onChange={searchShowsByQuery}
          onChangeStatusOpen={handleChangeStatusOpen}
          containerClassName={cn(path === '/' ? 'hidden' : 'flex')}
        />
        <Button
          variant="ghost"
          onClick={handleRandom}
          disabled={isRolling}
          className="h-5 w-5 p-0 text-lg">
          <span className={cn(isRolling && 'animate-spin')}>🎲</span>
        </Button>
        <ThemeToggle />
      </div>
    </nav>
  );
}

export default MainNav;
