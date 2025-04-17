import { GenresResponse, MovieDb } from '@/modules/moviedb-promise-main/src';
import {movieDbApiKey} from '../config/apiKeys';
// import { TMDBInstance } from './tmdbInstanceImpl';
import { TMDBInstanceInterface } from './interface/tmdbInstance';
import { TMDBInstanceLocalImpl } from './tmdbInstanceLocalImpl';

// TODO: Update logic to dynamically switch between the movieDB api and the local api endpoint

const moviedb = new TMDBInstanceLocalImpl(movieDbApiKey);

const cachedMovieDBInstances: Record<string,TMDBInstanceInterface> = {
    [movieDbApiKey]: moviedb,
}

export function getCustomTMDB(apiKey: string, saveToCache = true) {
    if (cachedMovieDBInstances[apiKey]) {
        return cachedMovieDBInstances[apiKey];
    }
    // const newInstance = new TMDBInstance(apiKey);
    const newInstance = new TMDBInstanceLocalImpl(apiKey);
    if (saveToCache) {
        cachedMovieDBInstances[apiKey] = newInstance;
    }
    return newInstance;
}

export const movieDBImageURLPrefix = 'https://image.tmdb.org/t/p/original';

// TV genre mapping Promise
let tvGenreMappingPromise: Promise<GenresResponse>;

export const getTVGenreMapping = (movieDBInstance: TMDBInstanceInterface = moviedb) => {
    if (tvGenreMappingPromise) {
        return tvGenreMappingPromise;
    }

    tvGenreMappingPromise = movieDBInstance.genreTvList();
    return tvGenreMappingPromise;
};

export {MovieDb};
