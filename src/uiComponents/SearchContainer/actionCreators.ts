import type { DispatchThunk } from '@/hooks/redux';
import { getCustomTMDB } from '@/services/theMovieDbApi';
import { selectAvailablePages, selectLoadedPagesCount, selectSearchedTvShows, selectSearchedTVShowsListPageCanLoadMorePages, selectSearchedTVShowsListPageLoadedCount, selectSearchListRequestIsLoading, selectSearchQuery, selectSearchTvShowListSearchQuery } from './selectors';
import { clearSearchedShows, fetchSearchShowsFailure, fetchSearchShowsListFailure, fetchSearchShowsListRequest, fetchSearchShowsListSuccess, fetchSearchShowsRequest, fetchSearchShowsSuccess, setSearchedTvShowsListResults, setSearchQuery } from './reducer';
import { RootState } from '@/store/configureStore';
import { selectAPIKey } from '../AppContainer/selectors';

// TODO: Centralize this to a new file
function getTMDBInstance(getState: () => RootState) {
    const tmdbAPIKey = selectAPIKey(getState());
    if(!tmdbAPIKey) {
        return;
    }
    return getCustomTMDB(tmdbAPIKey);
}

export const updateSearchQuery: DispatchThunk<{ searchQuery: string }> = ({ searchQuery }) => (
    (dispatch, getState) => {

        const tmdbInstance = getTMDBInstance(getState);
        if(!tmdbInstance) {
            return;
        }

        const currentSearchQuery = selectSearchQuery(getState());
        if (searchQuery !== currentSearchQuery) {

            dispatch(setSearchQuery(searchQuery));

            const updatedSearchQuery = searchQuery.trim();
            if (!updatedSearchQuery) { return; }

            dispatch(fetchSearchShowsRequest({searchQuery: updatedSearchQuery}));
            tmdbInstance?.searchTv({ query: updatedSearchQuery })
                .then((res) => {
                    if (res?.results) {
                        dispatch(fetchSearchShowsSuccess({
                            results: res.results,
                            totalPages: res.total_pages || 1
                        }));
                    }
                }).catch(err => {
                    console.error(err);
                    dispatch(fetchSearchShowsFailure())
                });
        }
    }
);

export const queryMoreSearchListResults: DispatchThunk<{ searchQuery: string }> = ({ searchQuery }) => (
    (dispatch, getState) => {

        const tmdbInstance = getTMDBInstance(getState);
        if(!tmdbInstance) {
            return;
        }

        const loadedSearchResultsPagesCount = selectSearchedTVShowsListPageLoadedCount(getState());
        // TODO: Update this logic to check if available page count against the current loaded count
        if (
            selectSearchListRequestIsLoading(getState()) ||
            !selectSearchedTVShowsListPageCanLoadMorePages(getState())
        ) {
            return;
        }

        dispatch(fetchSearchShowsListRequest());
        tmdbInstance.searchTv({
            query: searchQuery,
            page: loadedSearchResultsPagesCount + 1
        })
        .then((res) => {
            dispatch(fetchSearchShowsListSuccess({
                results: res?.results || [],
                totalPages: res.total_pages || 1
            }));
        }).catch(err => {
            console.error(err);
            dispatch(fetchSearchShowsListFailure())
        });

    }
)

export const clearSearchResults: DispatchThunk = () => (
    (dispatch) => {
        dispatch(clearSearchedShows());
    }
);

export const copySearchResultsToSearchListPageResults: DispatchThunk = () => (
    (dispatch, getState) => {
        const searchQuery = selectSearchQuery(getState());
        const searchTvShowListSearchQuery = selectSearchTvShowListSearchQuery(getState());
        if (searchQuery && searchQuery !== searchTvShowListSearchQuery) {
            const searchResults = selectSearchedTvShows(getState());
            const availablePages = selectAvailablePages(getState());
            const loadedPagesCount = selectLoadedPagesCount(getState());
            dispatch(setSearchedTvShowsListResults({ results: searchResults, totalPages: availablePages, loadedPagesCount, searchQuery }));
        }
    }
)