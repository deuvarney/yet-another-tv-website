import {createSelector} from 'reselect';
import {RootState} from '@/store/configureStore';

const selectSearchTvShows = (state: RootState) => state.searchTvShows;



export const selectSearchQuery = createSelector(
    selectSearchTvShows,
    (searchTvShows) => {
        return searchTvShows.searchQuery;
    },
);

export const selectAvailablePages = createSelector(
    selectSearchTvShows,
    (selectTvShows) => {
        return selectTvShows.availablePages;
    },
);

export const selectSearchedTvShows = createSelector(
    selectSearchTvShows,
    (searchTvShows) => {
        return searchTvShows.searchedTvShows;
    },
);

export const selectLoadedPagesCount = createSelector(
    selectSearchTvShows,
    (searchTvShows) => {
        return searchTvShows.loadedPagesCount
    }
)

export const selectSearchedTVShowsListPageResults = createSelector(
    selectSearchTvShows,
    (searchTvShows) => {
        return searchTvShows.searchedTvShowsListPage;
    }
)

export const selectSearchListRequestIsLoading = createSelector(
    selectSearchTvShows,
    (searchTvShows) => {
        return searchTvShows.isSearchListPageLoading;
    }
)
export const selectSearchListRequestIsLoaded = createSelector(
    selectSearchTvShows,
    (searchTvShows) => {
        return searchTvShows.isSearchListPageLoaded;
    }
)

export const selectSearchedTVShowsListPageLoadedCount = createSelector(
    selectSearchTvShows,
    (searchTvShows) => {
        return searchTvShows.tvShowsListLoadedPagesCount;
    }
)

export const selectSearchedTVShowsListPageAvailablePages = createSelector(
    selectSearchTvShows,
    (searchTvShows) => {
        return searchTvShows.searchedTvShowsListPageAvailablePages;
    }
)

export const selectSearchedTVShowsListPageCanLoadMorePages = createSelector(
    selectSearchedTVShowsListPageLoadedCount,
    selectSearchedTVShowsListPageAvailablePages,
    (tvShowsListLoadedPagesCount, searchedTvShowsListPageAvailablePages) => {
        return !searchedTvShowsListPageAvailablePages || searchedTvShowsListPageAvailablePages > tvShowsListLoadedPagesCount;
    }
)

export const selectSearchTvShowListSearchQuery = createSelector(
    selectSearchTvShows,
    (searchTvShowsState) => {
        return searchTvShowsState.searchListSearchQuery;
    }
)