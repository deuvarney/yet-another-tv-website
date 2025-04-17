import {createSlice} from '@reduxjs/toolkit';

export type AppSettingsType = {
    isInitialLoaded: boolean;
    apiKey: string;
    isYoutubeEnabled: boolean;
    favoriteShowIds: number[];

    // Dev/Experimental Settings
    isHomeFiltersEnabled: boolean;
}

const initialState: AppSettingsType = {
    isInitialLoaded: false,
    apiKey: '',
    isYoutubeEnabled: false,
    favoriteShowIds: [],

    isHomeFiltersEnabled: false,
};


type ActionType<T> = {
    type: string,
    payload: T
}

const appSettingsSlice = createSlice({
    name: 'appSettings',
    initialState: initialState,
    reducers: {
        setApiKey(state, action: ActionType<string>) {
            state.apiKey = action.payload;
        },

        setIsInitiaLStateoaded(state, action: ActionType<boolean>) {
            state.isInitialLoaded = action.payload
        },

        setYoutubeEnabled(state, action: ActionType<boolean>) {
            state.isYoutubeEnabled = action.payload
        },
        
        setHomeFiltersEnabled(state, action: ActionType<boolean>) {
            state.isHomeFiltersEnabled = action.payload
        },
        setFavoriteShows(state, action: ActionType<number[]>) {
            state.favoriteShowIds = action.payload
        }
    },
});

export const {
    setApiKey,
    setIsInitiaLStateoaded,
    setYoutubeEnabled,
    setHomeFiltersEnabled,
    setFavoriteShows,
} = appSettingsSlice.actions;
export default appSettingsSlice.reducer;


