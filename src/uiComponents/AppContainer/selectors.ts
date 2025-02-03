import {createSelector} from 'reselect';
import {RootState} from '@/store/configureStore';

const appSettings = (state: RootState) => state.appSettings;

export const selectAPIKey = createSelector(
    appSettings,
    (appState) => {
        return appState.apiKey;
    }
)

export const selectIsInitialStateLoaded = createSelector(
    appSettings,
    (appState) => {
        return appState.isInitialLoaded;
    }
)

export const selectIsHomeFiltersEnabled = createSelector(
    appSettings,
    (appState) => {
        return appState.isHomeFiltersEnabled;
    }
)

export const selectIsYoutubeEnabled = createSelector(
    appSettings,
    (appState) => {
        return appState.isYoutubeEnabled;
    }
)
