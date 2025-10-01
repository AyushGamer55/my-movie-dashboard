import { env } from '@/env.mjs';

/**
 * @class BaseService
 */
class BaseService {
  constructor() {
    if (this.constructor === BaseService) {
      throw new Error("Classes can't be instantiated.");
    }
  }

  static async fetchWithAuth(
    url: string,
    options: RequestInit = {},
  ): Promise<Response> {
    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');

    const config: RequestInit = {
      ...options,
      headers,
      signal: options.signal || AbortSignal.timeout(15000),
    };

    let finalUrl = url;
    if (url.includes('themoviedb')) {
      // Try with Bearer token first
      headers.set('Authorization', `Bearer ${env.NEXT_PUBLIC_TMDB_TOKEN}`);
    }

    let response = await fetch(finalUrl, config);

    if (response.status === 401 && url.includes('themoviedb')) {
      // If 401, retry with API key in URL
      headers.delete('Authorization');
      const separator = url.includes('?') ? '&' : '?';
      finalUrl = `${url}${separator}api_key=${env.NEXT_PUBLIC_TMDB_API_KEY}`;
      response = await fetch(finalUrl, config);
    }

    if (!response.ok) {
      // Removed console.error to comply with ESLint no-console rule
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  }

  static readonly isRejected = (
    input: PromiseSettledResult<unknown>,
  ): input is PromiseRejectedResult => input.status === 'rejected';

  static readonly isFulfilled = <T>(
    input: PromiseSettledResult<T>,
  ): input is PromiseFulfilledResult<T> => input.status === 'fulfilled';
}

export default BaseService;
