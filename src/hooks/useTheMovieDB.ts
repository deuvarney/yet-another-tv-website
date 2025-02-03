import { useEffect, useState } from 'react';
import { useAppSelector } from './redux';
import { getCustomTMDB, MovieDb } from '@/services/theMovieDbApi';
import { getTVGenreMapping } from '@/services/theMovieDbApi';
import { GenresResponse } from '@/modules/moviedb-promise-main/src';
import { selectAPIKey } from '@/uiComponents/AppContainer/selectors';

interface UtilFns {
    getTVGenreMapping: () => Promise<GenresResponse> | Promise<object>;
}

// TODO: Set this to queue incomming calls while waiting for api key to be resolved. Waiting for it to resolve in the code base is a bad idea especially spread across many files

// TODO: Research if this is bad practice, however it is currently fine for the current use-case
const cachedMovieDBInstances: Record<string,MovieDb> = {}

const useTheMovieDB = (): [MovieDb | null, UtilFns] => {
    const apiKey = useAppSelector(selectAPIKey);
    const [client, setClient] = useState<MovieDb | null>(null);

    useEffect(() => {
        if(cachedMovieDBInstances[apiKey]) {
            setClient(cachedMovieDBInstances[apiKey]);
        } else if (apiKey) {
            const client = getCustomTMDB(apiKey);
            cachedMovieDBInstances[apiKey] = client;
            setClient(client);
        }
    }, [apiKey]);


    const utilFns: UtilFns = {
        getTVGenreMapping: () => {
            if (client) { return getTVGenreMapping(client) }
            return Promise.resolve({});
        }
    }

    return [client, { ...utilFns }];
};

export default useTheMovieDB;