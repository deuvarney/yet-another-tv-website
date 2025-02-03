import { TvResult } from '@/modules/moviedb-promise-main/src/request-types';
import {createSlice} from '@reduxjs/toolkit';

export type SearchTvShowsType = {
    searchQuery: string;
    loadedPagesCount: number;

    isLoading: boolean;
    isError: boolean;
    isLoaded: boolean;
    searchedTvShows: TvResult[];
    availablePages: number;
    searchedTvShowsListPage: TvResult[];

    tvShowsListLoadedPagesCount: number
    searchedTvShowsListPageAvailablePages: number;
    isSearchListPageLoading: boolean,
    isSearchListPageLoaded: boolean,
    isSearchListPageError: boolean,
    searchListSearchQuery: string,
}

const initialState : SearchTvShowsType = {
    searchQuery: '',
    loadedPagesCount: 0,
    isLoading: false,
    isError: false,
    isLoaded: false,
    searchedTvShows: [],
    availablePages: 0,

    tvShowsListLoadedPagesCount: 0,
    searchedTvShowsListPage: [],
    isSearchListPageLoading: false,
    isSearchListPageLoaded: false,
    isSearchListPageError: false,
    searchListSearchQuery: '',
    searchedTvShowsListPageAvailablePages: 0,
    
}

const searchTvShowsSlice = createSlice({
    name: 'searchTvShows',
    initialState,
    reducers: {
        setSearchQuery: (state, action: {type: string, payload: string}) => {
            state.searchQuery = action.payload;
        },
        fetchSearchShowsRequest: (state, action: {type: string, payload: {searchQuery: string}}) => {
            state.isLoading = true;
            state.isError = false;
            state.searchQuery = action.payload.searchQuery;
        },
        fetchSearchShowsSuccess: (state, action: {type: string, payload: {results: TvResult[], totalPages: number}}) => {
            state.isLoading = false;
            state.isError = false;
            state.isLoaded = true;
            state.searchedTvShows = action.payload.results;
            state.loadedPagesCount = 1;
            if(state.availablePages !== action.payload.totalPages) {
                state.availablePages = action.payload.totalPages;
            }
        },
        fetchSearchShowsFailure: (state/*, action*/) => {
            state.isLoading = false;
            state.isError = true;
        },
        clearSearchedShows: (state) => {
            state.searchedTvShows = [];
            state.loadedPagesCount = 0;
            state.availablePages = 0;
        },
        setSearchedTvShowsListResults: (state, action: {type: string, payload: {results: TvResult[], totalPages: number, loadedPagesCount: number, searchQuery: string}}) => {
            state.searchedTvShowsListPage = action.payload.results;
            state.searchedTvShowsListPageAvailablePages = action.payload.totalPages;
            state.tvShowsListLoadedPagesCount = action.payload.loadedPagesCount;
            state.searchListSearchQuery = action.payload.searchQuery;
        },

        fetchSearchShowsListRequest: (state,) => {
            state.isSearchListPageLoading = true;
            state.isSearchListPageError = false;
        },

        fetchSearchShowsListSuccess: (state, action: {type: string, payload: {results: TvResult[], totalPages: number}}) => {
            state.isSearchListPageLoading = false;
            state.isSearchListPageError = false;
            state.isSearchListPageLoaded = true;
            state.searchedTvShowsListPage = state.searchedTvShowsListPage.concat(action.payload.results);
            state.searchedTvShowsListPageAvailablePages = action.payload.totalPages;
            state.tvShowsListLoadedPagesCount += 1
        },
        fetchSearchShowsListFailure: (state/*, action*/) => {
            state.isSearchListPageLoading = false;
            state.isSearchListPageError = true;
        }
    },
})
export const {
    setSearchQuery,
    fetchSearchShowsRequest, 
    fetchSearchShowsSuccess,
    fetchSearchShowsFailure, 
    clearSearchedShows, 
    setSearchedTvShowsListResults,
    fetchSearchShowsListRequest,
    fetchSearchShowsListSuccess,
    fetchSearchShowsListFailure,
} = searchTvShowsSlice.actions;
export default searchTvShowsSlice.reducer;
