import { GenresResponse } from '@/modules/moviedb-promise-main/src';
import {movieDbApiKey} from '../config/apiKeys';
import {MovieDb} from '../modules/moviedb-promise-main/src/moviedb';

const moviedb = new MovieDb(movieDbApiKey);

export function getCustomTMDB(apiKey: string) {
    return new MovieDb(apiKey);
}

export const movieDBImageURLPrefix = 'https://image.tmdb.org/t/p/original';

// TV genre mapping Promise
let tvGenreMappingPromise: Promise<GenresResponse>;

export const getTVGenreMapping = (movieDBInstance: MovieDb = moviedb) => {
    if (tvGenreMappingPromise) {
        return tvGenreMappingPromise;
    }

    tvGenreMappingPromise = movieDBInstance.genreTvList();
    return tvGenreMappingPromise;
};

export {MovieDb};
