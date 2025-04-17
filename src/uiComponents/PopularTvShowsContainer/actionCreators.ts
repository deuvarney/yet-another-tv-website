import {selectCurrentShowType, selectIsPopularShowsLoading, selectIsTrendingShowsLoading, selectPopularShows, selectPopularShowsLoadedPages, selectPopularTotalPages, selectTrendingShows, selectTrendingShowsLoadedPages, selectTrendingTotalPages} from './selectors';
import {SHOW_FILTER_TYPE} from '@/types/themoviedbTypes';
import {fetchPopularShows, fetchPopularShowsSuccess, fetchTrendingShows, fetchTrendingShowsSuccess, setCurrentShow, setGenresFilter, setOriginalLanguagesFilter, setOriginCountriesFilter, setShowType} from './reducer';
import type {DispatchThunk} from '@/hooks/redux';
import { getCustomTMDB } from '@/services/theMovieDbApi';
import { selectAPIKey } from '../AppContainer/selectors';
import { RootState } from '@/store/configureStore';

// TODO: Centralize this to a new file
function getTMDBInstance(getState: () => RootState) {
    const tmdbAPIKey = selectAPIKey(getState());
    if(!tmdbAPIKey) {
        return;
    }
    return getCustomTMDB(tmdbAPIKey);
}

export const updateSelectedShowType: DispatchThunk<{selectedShowType:SHOW_FILTER_TYPE}> = ({selectedShowType,}) => (
    (dispatch, getState) => {

        const tmdbInstance = getTMDBInstance(getState);
        if(!tmdbInstance) {
            return;
        }

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
        dispatch(dispatchee());
    }
);

export const getPopularShows: DispatchThunk = () => (
    (dispatch, getState) => {

        const tmdbInstance = getTMDBInstance(getState);
        if(!tmdbInstance) {
            return;
        }

        const loadedPagesCount = selectPopularShowsLoadedPages(getState());

        if (selectIsPopularShowsLoading(getState())) {
            return;
        }

        const totalPopularPages = selectPopularTotalPages(getState());
        console.log('###totalPopularPages', totalPopularPages, "loadedPagesCount", loadedPagesCount)
        if ( totalPopularPages && (loadedPagesCount >= totalPopularPages)) { return; }


        dispatch(fetchPopularShows());

        tmdbInstance.tvPopular({page: loadedPagesCount+1, language: 'en-US'}).then((result) => {
            const loadedPopularShows = selectPopularShows(getState());
            const newShows = result.results?.filter((newTrendingShow)=> {
                const showAlreadyLoaded = loadedPopularShows.find((loadedShow) => {
                    return loadedShow.id === newTrendingShow.id
                })
                return !showAlreadyLoaded
            }).filter(n=>n);
            dispatch(fetchPopularShowsSuccess({...result, results: newShows}));
        });
    }
);

export const getTrendingShows: DispatchThunk = () => (
    (dispatch, getState) => {

        const tmdbInstance = getTMDBInstance(getState);
        if(!tmdbInstance) {
            return;
        }

        const loadedPagesCount = selectTrendingShowsLoadedPages(getState());
        if (selectIsTrendingShowsLoading(getState())) {
            return;
        }

        const totalTrendingPages = selectTrendingTotalPages(getState());

        console.log('###totalTrendingPages', totalTrendingPages, "loadedPagesCount", loadedPagesCount)

        if ( totalTrendingPages && loadedPagesCount >= totalTrendingPages ) { return; }
        
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
            dispatch(fetchTrendingShowsSuccess({...result, results: newShows}));
        });
    }
);

export const getShowTypeShows: DispatchThunk = () => (
    (dispatch, getState) => {
        
        if (selectCurrentShowType(getState()) === SHOW_FILTER_TYPE.SHOW_TYPE_POPULAR) {
            return dispatch(getPopularShows());
        }
        dispatch(getTrendingShows());
    }
);


export const getCurrentShowInfo: DispatchThunk<{showId:number}> = ({showId}) => (
    (dispatch, getState) => {

        const tmdbInstance = getTMDBInstance(getState);
        if(!tmdbInstance) {
            return;
        }

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