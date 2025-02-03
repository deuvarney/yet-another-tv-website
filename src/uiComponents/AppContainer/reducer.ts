import {createSlice} from '@reduxjs/toolkit';

export type AppSettingsType = {
    isInitialLoaded: boolean;
    apiKey: string;
    isYoutubeEnabled: boolean;

    // Dev/Experimental Settings
    isHomeFiltersEnabled: boolean;
}

const initialState: AppSettingsType = {
    isInitialLoaded: false,
    apiKey: '',
    isYoutubeEnabled: false,

    isHomeFiltersEnabled: false,
};


const appSettingsSlice = createSlice({
    name: 'appSettings',
    initialState: initialState,
    reducers: {
        setApiKey(state, action: {type: string, payload: string}){
            state.apiKey = action.payload;
        },

        setIsInitiaLStateoaded(state, action:{type: string, payload: boolean}){
            state.isInitialLoaded = action.payload
        },

        setYoutubeEnabled(state, action: {type: string, payload: boolean}){
            state.isYoutubeEnabled = action.payload
        },
        
        setHomeFiltersEnabled(state, action: {type: string, payload: boolean}){
            state.isHomeFiltersEnabled = action.payload
        }
    },
});

export const {
    setApiKey,
    setIsInitiaLStateoaded,
    setYoutubeEnabled,
    setHomeFiltersEnabled,
} = appSettingsSlice.actions;
export default appSettingsSlice.reducer;


