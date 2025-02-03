import {SHOW_FILTER_TYPE, Show} from '../../types/themoviedbTypes';
// import * as AC from './actionConstants';


import {createSlice} from '@reduxjs/toolkit';



export type PopularTvShowsType = {
    popularShows: Show[],
    isPopularShowsLoading: boolean,
    isPopularShowsLoaded: boolean,
    loadedPopularPages: number,

    apiKey: string,

    showType: SHOW_FILTER_TYPE,

    // TODO: Abstract this logic with TypeScript
    isTrendingShowsLoading: boolean,
    isTrendingShowsLoaded: boolean,
    trendingShows: Show[],
    // error: null, // no case for this yet
    loadedTrendingPages: number,


    currentShow: Show | null;

    showsFilter: {
        setOriginCountries: string[],
        setOriginalLanguages: string[],
        setGenres: number[],
    },
}

const initialState: PopularTvShowsType = {
    popularShows: [],
    isPopularShowsLoading: false,
    isPopularShowsLoaded: false,
    loadedPopularPages: 0,

    apiKey: '',


    showType: SHOW_FILTER_TYPE.SHOW_TYPE_TRENDING,

    // TODO: Abstract this logic with TypeScript
    isTrendingShowsLoading: false,
    isTrendingShowsLoaded: false,
    trendingShows: [],
    // error: null, // no case for this yet

    loadedTrendingPages: 0,

    currentShow: null,
    showsFilter: {
        setOriginCountries: [],
        setOriginalLanguages: [],
        setGenres: [],
    },
};


const popularTvShowsSlice = createSlice({
    name: 'popularTvShows',
    initialState: initialState,
    reducers: {
        fetchPopularShows(state, /*action*/) {
            state.showType = SHOW_FILTER_TYPE.SHOW_TYPE_POPULAR;
            state.isPopularShowsLoading = true;
        },
        fetchTrendingShows(state, /*action*/) {
            state.showType= SHOW_FILTER_TYPE.SHOW_TYPE_TRENDING;
            state.isTrendingShowsLoading= true;
        },
        fetchPopularShowsSuccess(state, action) {
            state.isPopularShowsLoaded = true;
            state.isPopularShowsLoading = false;
            state.popularShows = state.popularShows.concat(action.payload);
            state.loadedPopularPages = state.loadedPopularPages + 1;
        },
        fetchTrendingShowsSuccess(state, action) {
            state.isTrendingShowsLoaded = true;
            state.isTrendingShowsLoading = false;
            state.trendingShows = state.trendingShows.concat(action.payload);
            state.loadedTrendingPages = state.loadedTrendingPages + 1;
        },
        setShowType(state, action) {
            state.showType = action.payload;
        },

        setCurrentShow(state, action) {
            state.currentShow = action.payload;
        },

        setOriginCountriesFilter(state, action: {type: string, payload: string[]}) {
            state.showsFilter.setOriginCountries = Array.from(action.payload);
        },

        setOriginalLanguagesFilter(state, action: {type: string, payload: string[]}) {
            state.showsFilter.setOriginalLanguages = Array.from(action.payload);
        },

        setGenresFilter(state, action: {type: string, payload: number[]}) {
            state.showsFilter.setGenres = action.payload;
        },
    },
});

export const {
    fetchPopularShows,
    fetchTrendingShows,
    fetchPopularShowsSuccess,
    fetchTrendingShowsSuccess,
    setShowType,
    setCurrentShow,
    setOriginCountriesFilter,
    setOriginalLanguagesFilter,
    setGenresFilter,
} = popularTvShowsSlice.actions;
export default popularTvShowsSlice.reducer;


