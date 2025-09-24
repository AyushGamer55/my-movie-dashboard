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

  static async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const headers = new Headers(options.headers);
    if (url.includes('themoviedb')) {
      headers.set('Authorization', `Bearer ${env.NEXT_PUBLIC_TMDB_TOKEN}`);
    }
    headers.set('Content-Type', 'application/json');

    const config: RequestInit = {
      ...options,
      headers,
      signal: options.signal || AbortSignal.timeout(15000),
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      console.error(`error in request: ${response.status} ${response.statusText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  }

  static isRejected = (
    input: PromiseSettledResult<unknown>,
  ): input is PromiseRejectedResult => input.status === 'rejected';

  static isFulfilled = <T>(
    input: PromiseSettledResult<T>,
  ): input is PromiseFulfilledResult<T> => input.status === 'fulfilled';
}

export default BaseService;
