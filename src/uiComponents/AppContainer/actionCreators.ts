import { DispatchThunk } from "@/hooks/redux";
import { setApiKey, setHomeFiltersEnabled, setYoutubeEnabled } from "./reducer";
import { selectAPIKey, selectIsYoutubeEnabled, selectIsHomeFiltersEnabled } from "./selectors";


enum LOCAL_STORAGE_KEYS {
    TMDB_API_KEY = 'tmdbApiKey',
    IS_YOUTUBE_ENABLED = 'isYoutubeEnabled',
    IS_HOME_FILTERS_ENABLED = 'isHomeFiltersEnabled',
}

export const updateAPIKey: DispatchThunk<[string, boolean?]> = ([apiKey, shouldSave = true]) => {
    return (dispatch, getState) => {
        const currentApiKey = selectAPIKey(getState());
        if (apiKey !== currentApiKey) {
            dispatch(setApiKey(apiKey));
            if (shouldSave) {
                localStorage.setItem(LOCAL_STORAGE_KEYS.TMDB_API_KEY, apiKey);
            }
        }
    };
}

export const updateIsYoutubeEnabled: DispatchThunk<[boolean, boolean?]> = ([isEnabled, shouldSave = true]) => {
    return (dispatch, getState) => {
        const isCurrentlyEnabled = selectIsYoutubeEnabled(getState());
        if (isCurrentlyEnabled !== isEnabled) {
            dispatch(setYoutubeEnabled(isEnabled));
            if (shouldSave) {
                localStorage.setItem(LOCAL_STORAGE_KEYS.IS_YOUTUBE_ENABLED, isEnabled ? '1' : '0');
            }
        }
    };
}

export const updateIsHomeFiltersEnabled: DispatchThunk<[boolean, boolean?]> = ([isEnabled, shouldSave = true]) => {
    return (dispatch, getState) => {
        const isCurrentlyEnabled = selectIsHomeFiltersEnabled(getState());
        if (isCurrentlyEnabled !== isEnabled) {
            dispatch(setHomeFiltersEnabled(isEnabled));
            if (shouldSave) {
                localStorage.setItem(LOCAL_STORAGE_KEYS.IS_HOME_FILTERS_ENABLED, isEnabled ? '1' : '0');
            }
        }
    };
}

export const loadApplicationSettings: DispatchThunk = () => {
    return (dispatch/*, getState*/) => {
        // Check if the tmdb API Key is already set in the user's browser and add it to redux state
        const localAPIKey = localStorage.getItem(LOCAL_STORAGE_KEYS.TMDB_API_KEY);
        if (localAPIKey) {
            dispatch(updateAPIKey([localAPIKey]));
        }

        const localIsYoutubeEnabled = localStorage.getItem(LOCAL_STORAGE_KEYS.IS_YOUTUBE_ENABLED);
        if (localIsYoutubeEnabled) {
            dispatch(updateIsYoutubeEnabled([localIsYoutubeEnabled === '1']));
        }

        const localIsHomeFiltersEnabled = localStorage.getItem(LOCAL_STORAGE_KEYS.IS_HOME_FILTERS_ENABLED);
        if (localIsHomeFiltersEnabled) {
            dispatch(updateIsHomeFiltersEnabled([localIsHomeFiltersEnabled === '1']));
        }
    };
}