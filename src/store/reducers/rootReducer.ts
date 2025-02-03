import {combineReducers} from 'redux';
import popularTvShows from '@/uiComponents/PopularTvShowsContainer/reducer';
import searchTvShows from '@/uiComponents/SearchContainer/reducer';
import appSettings from '@/uiComponents/AppContainer/reducer';

const rootReducer = combineReducers({
    appSettings,
    popularTvShows,
    searchTvShows,
});

export default rootReducer;
