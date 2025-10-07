import { getNameFromShow, getSlug } from '@/lib/utils';
import type {
  CategorizedShows,
  ISeason,
  KeyWordResponse,
  MediaType,
  Show,
  ShowWithGenreAndVideo,
} from '@/types';
import BaseService from '../BaseService/BaseService';
import {
  RequestType,
  type ShowRequest,
  type TmdbPagingResponse,
  type TmdbRequest,
} from '@/enums/request-type';
import { Genre } from '@/enums/genre';
import { cache } from 'react';

const requestTypesNeedUpdateMediaType = [
  RequestType.TOP_RATED,
  RequestType.NETFLIX,
  RequestType.POPULAR,
  RequestType.GENRE,
  RequestType.KOREAN,
];
const baseUrl = 'https://api.themoviedb.org/3';

class MovieService extends BaseService {
  static async findCurrentMovie(id: number, pathname: string): Promise<Show> {
    const data = await Promise.allSettled([
      this.findMovie(id),
      this.findTvSeries(id),
    ]);
    const response = data
      .filter(this.isFulfilled)
      .map((item: PromiseFulfilledResult<Show>) => item.value)
      .filter((item: Show) => {
        return pathname.includes(getSlug(item.id, getNameFromShow(item)));
      });
    if (!response?.length) {
      return Promise.reject(new Error('not found'));
    }
    return Promise.resolve<Show>(response[0]);
  }

  static readonly findMovie = cache(async (id: number): Promise<Show> => {
    const url = `${baseUrl}/movie/${id}?append_to_response=keywords`;
    const response = await this.fetchWithAuth(url);
    return response.json();
  });

  static readonly findTvSeries = cache(async (id: number): Promise<Show> => {
    const url = `${baseUrl}/tv/${id}?append_to_response=keywords`;
    const response = await this.fetchWithAuth(url);
    return response.json();
  });

  static async getKeywords(
    id: number,
    type: 'tv' | 'movie',
  ): Promise<KeyWordResponse> {
    const url = `${baseUrl}/${type}/${id}/keywords`;
    const response = await this.fetchWithAuth(url);
    return response.json();
  }

  static async getSeasons(id: number, season: number): Promise<ISeason> {
    const url = `${baseUrl}/tv/${id}/season/${season}`;
    const response = await this.fetchWithAuth(url);
    return response.json();
  }

  static readonly findMovieByIdAndType = cache(
    async (id: number, type: string): Promise<ShowWithGenreAndVideo> => {
      const params = new URLSearchParams({
        language: 'en-US',
        append_to_response: 'videos,keywords',
      });
      const url = `${baseUrl}/${type}/${id}?${params.toString()}`;
      const response = await this.fetchWithAuth(url);
      return response.json();
    },
  );

  static urlBuilder(req: TmdbRequest) {
    switch (req.requestType) {
      case RequestType.ANIME_LATEST:
        return `/discover/${req.mediaType}?with_keywords=210024%2C&language=en-US&sort_by=primary_release_date.desc&release_date.lte=2024-11-10&with_runtime.gte=1`;
      case RequestType.ANIME_TRENDING:
        return `/discover/${req.mediaType}?with_keywords=210024%2C&language=en-US&sort_by=popularity.desc&release_date.lte=2024-11-10&with_runtime.gte=1`;
      case RequestType.ANIME_TOP_RATED:
        return `/discover/${req.mediaType}?with_keywords=210024%2C&language=en-US&sort_by=vote_count.desc&air_date.lte=2024-11-10`;
      case RequestType.ANIME_NETFLIX:
        return `/discover/${req.mediaType}?with_keywords=210024%2C&with_networks=213&language=en-US`;
      case RequestType.TRENDING:
        return `/trending/${
          req.mediaType
        }/day?language=en-US&with_original_language=en&page=${req.page ?? 1}`;
      case RequestType.TOP_RATED:
        return `/${req.mediaType}/top_rated?page=${
          req.page ?? 1
        }&with_original_language=en&language=en-US`;
      case RequestType.NETFLIX:
        return `/discover/${
          req.mediaType
        }?with_networks=213&with_original_language=en&language=en-US&page=${
          req.page ?? 1
        }`;
      case RequestType.POPULAR:
        return `/${
          req.mediaType
        }/popular?language=en-US&with_original_language=en&page=${
          req.page ?? 1
        }&without_genres=${Genre.TALK},${Genre.NEWS}`;
      case RequestType.GENRE:
        return `/discover/${req.mediaType}?with_genres=${
          req.genre
        }&language=en-US&with_original_language=en&page=${
          req.page ?? 1
        }&without_genres=${Genre.TALK},${Genre.NEWS}`;
      case RequestType.ANIME_GENRE:
        return `/discover/${req.mediaType}?with_genres=${
          req.genre
        }&with_keywords=210024%2C&language=en-US&with_original_language=en&page=${
          req.page ?? 1
        }&without_genres=${Genre.TALK},${Genre.NEWS}`;
      case RequestType.KOREAN:
        return `/discover/${req.mediaType}?with_genres=${
          req.genre
        }&with_original_language=ko&language=en-US&page=${req.page ?? 1}`;
      default:
        throw new Error(
          `request type ${req.requestType} is not implemented yet`,
        );
    }
  }

  static readonly executeRequest = cache(
    async (req: {
      requestType: RequestType;
      mediaType: MediaType;
      page?: number;
    }): Promise<TmdbPagingResponse> => {
      const url = `${baseUrl}${this.urlBuilder(req)}`;
      const response = await this.fetchWithAuth(url);
      return response.json();
    },
  );

  static readonly getShows = cache(
    async (requests: ShowRequest[]): Promise<CategorizedShows[]> => {
      const shows: CategorizedShows[] = [];
      const promises = requests.map((m) => this.executeRequest(m.req));
      const responses = await Promise.allSettled(promises);
      for (let i = 0; i < requests.length; i++) {
        const res = responses[i];
        if (this.isRejected(res)) {
          shows.push({
            title: requests[i].title,
            shows: [],
            visible: requests[i].visible,
          });
        } else if (this.isFulfilled(res)) {
          if (
            requestTypesNeedUpdateMediaType.indexOf(
              requests[i].req.requestType,
            ) > -1
          ) {
            res.value.results.forEach(
              (f: Show) => (f.media_type = requests[i].req.mediaType),
            );
          }
          shows.push({
            title: requests[i].title,
            shows: res.value.results,
            visible: requests[i].visible,
          });
        } else {
          throw new Error('unexpected response');
        }
      }
      return shows;
    },
  );

  static readonly searchMovies = cache(
    async (query: string, page?: number): Promise<TmdbPagingResponse> => {
      const params = new URLSearchParams({
        query: query,
        language: 'en-US',
        page: (page ?? 1).toString(),
      });
      const url = `${baseUrl}/search/multi?${params.toString()}`;
      const response = await this.fetchWithAuth(url);
      const data = await response.json();

      data.results.sort((a: Show, b: Show) => {
        return b.popularity - a.popularity;
      });
      return data;
    },
  );
}

export default MovieService;
