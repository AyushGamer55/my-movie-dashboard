import BaseService from '@/services/BaseService';

const tmdbClient = {
  get: <T>(url: string): Promise<{ data: T }> =>
    BaseService.fetchWithAuth(`https://api.themoviedb.org/3${url}`).then(
      (res) => res.json().then((data) => ({ data })),
    ),
};

export default tmdbClient;
