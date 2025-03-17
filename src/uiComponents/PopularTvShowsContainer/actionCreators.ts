import {selectCurrentShowType, selectIsTrendingShowsLoading, selectPopularShows, selectPopularShowsLoadedPages, selectTrendingShows, selectTrendingShowsLoadedPages} from './selectors';
import {SHOW_FILTER_TYPE} from '@/types/themoviedbTypes';
import {fetchPopularShows, fetchPopularShowsSuccess, fetchTrendingShows, fetchTrendingShowsSuccess, setCurrentShow, setGenresFilter, setOriginalLanguagesFilter, setOriginCountriesFilter, setShowType} from './reducer';
import type {DispatchThunk} from '@/hooks/redux';
import { MovieDb } from '@/services/theMovieDbApi';

export const updateSelectedShowType: DispatchThunk<{selectedShowType:SHOW_FILTER_TYPE, tmdbInstance: MovieDb}> = ({selectedShowType, tmdbInstance}) => (
    (dispatch, getState) => {
        const currentShowType = selectCurrentShowType(getState());
        if (currentShowType === selectedShowType) {
            return;
        }

        dispatch(setShowType(selectedShowType));

        let dispatchee;
        switch (selectedShowType) {
        case SHOW_FILTER_TYPE.SHOW_TYPE_TRENDING:
            dispatchee = getTrendingShows;
            break;
        default:
            dispatchee = getPopularShows;
        }
        dispatch(dispatchee(tmdbInstance));
    }
);

export const getPopularShows: DispatchThunk<MovieDb> = (tmdbInstance: MovieDb) => (
    (dispatch, getState) => {
        const loadedPagesCount = selectPopularShowsLoadedPages(getState());

        if (selectIsTrendingShowsLoading(getState())) {
            return;
        }
        dispatch(fetchPopularShows());

        tmdbInstance.tvPopular({page: loadedPagesCount+1, language: 'en-US'}).then((result) => {
            const loadedPopularShows = selectPopularShows(getState());
            const newShows = result.results?.filter((newTrendingShow)=> {
                const showAlreadyLoaded = loadedPopularShows.find((loadedShow) => {
                    return loadedShow.id === newTrendingShow.id
                })
                return !showAlreadyLoaded
            }).filter(n=>n);
            dispatch(fetchPopularShowsSuccess(newShows));
        });
    }
);

export const getTrendingShows: DispatchThunk<MovieDb> = (tmdbInstance: MovieDb) => (
    (dispatch, getState) => {
        const loadedPagesCount = selectTrendingShowsLoadedPages(getState());
        if (selectIsTrendingShowsLoading(getState())) {
            return;
        }
        dispatch(fetchTrendingShows());

        tmdbInstance.trending({
            // @ts-expect-error This is not a valid type
            page: loadedPagesCount+1, // Provided types does not take this field into account
            media_type: 'tv',
            time_window: 'day',
            languagxe: 'en-US',
        }).then((result) => {
            const loadedTrendingPages = selectTrendingShows(getState());
            const newShows = result.results?.filter((newTrendingShow)=> {
                const showAlreadyLoaded = loadedTrendingPages.find((loadedShow) => {
                    return loadedShow.id === newTrendingShow.id
                })
                return !showAlreadyLoaded
            }).filter(n=>n);
            dispatch(fetchTrendingShowsSuccess(newShows));
        });
    }
);

export const getShowTypeShows: DispatchThunk<MovieDb> = (tmdbInstance: MovieDb) => (
    (dispatch, getState) => {
        if (selectCurrentShowType(getState()) === SHOW_FILTER_TYPE.SHOW_TYPE_POPULAR) {
            return dispatch(getPopularShows(tmdbInstance));
        }
        dispatch(getTrendingShows(tmdbInstance));
    }
);


export const getCurrentShowInfo: DispatchThunk<{showId:number, tmdbInstance: MovieDb}> = ({showId, tmdbInstance}) => (
    (dispatch/*, getState*/) => {
        tmdbInstance.tvInfo({id: showId}).then((tvShow) => {
        // this.setState({tvShow});
            dispatch(setCurrentShow(tvShow));
        });
    }
);


export const updateOriginCountriesFilter: DispatchThunk<Set<string>> = (originCountries: Set<string>) => (
    (dispatch/*, getState*/) => {
        return dispatch(setOriginCountriesFilter(Array.from(originCountries)));
    }
);


export const updateOriginalLanguagesFilter: DispatchThunk<Set<string>> = (originalLanguages: Set<string>) => {
    return (dispatch/*, getState*/) => {
        return dispatch(setOriginalLanguagesFilter(Array.from(originalLanguages)));
    };
}

export const updateGenresFilter: DispatchThunk<Set<string>> = (genres: Set<string>) => {
    return (dispatch/*, getState*/) => {
        return dispatch(setGenresFilter(Array.from(genres).map((id) => parseInt(id, 10))));
    };
}