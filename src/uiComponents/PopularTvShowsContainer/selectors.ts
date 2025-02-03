import {createSelector} from 'reselect';
import {SHOW_FILTER_TYPE} from '@/types/themoviedbTypes';
import {RootState} from '@/store/configureStore';

const selectPopularTvShows = (state: RootState) => state.popularTvShows;

export const selectCurrentShowType = createSelector(
    selectPopularTvShows,
    (shows) => {
        return shows.showType;
    },
);

export const selectShows = createSelector(
    selectPopularTvShows,
    selectCurrentShowType,
    (popularTvShows, currentShowType) => {
        const shows = currentShowType === SHOW_FILTER_TYPE.SHOW_TYPE_POPULAR ?
            popularTvShows.popularShows
            : popularTvShows.trendingShows;

        return shows;
    },
);

export const selectPopularShows = createSelector(
    selectPopularTvShows,
    (popularTvShows) => (popularTvShows.popularShows),
);

export const selectIsPopularShowsLoaded = createSelector(
    selectPopularTvShows,
    (popularTvShows) => (popularTvShows.isPopularShowsLoaded),
);

export const selectIsPopularShowsLoading = createSelector(
    selectPopularTvShows,
    (popularTvShows) => (popularTvShows.isPopularShowsLoading),
);

export const selectPopularShowsLoadedPages = createSelector(
    selectPopularTvShows,
    (popularTvShows) => (popularTvShows.loadedPopularPages),
);

export const selectTrendingShows = createSelector(
    selectPopularTvShows,
    (popularTvShows) => (popularTvShows.trendingShows),
);

export const selectIsTrendingShowsLoaded = createSelector(
    selectPopularTvShows,
    (popularTvShows) => (popularTvShows.isTrendingShowsLoaded),
);

export const selectIsTrendingShowsLoading = createSelector(
    selectPopularTvShows,
    (popularTvShows) => (popularTvShows.isTrendingShowsLoading),
);

export const selectTrendingShowsLoadedPages = createSelector(
    selectPopularTvShows,
    (popularTvShows) => (popularTvShows.loadedTrendingPages),
);


export const selectCurrentShow = createSelector(
    selectPopularTvShows,
    (popularTvShows) => (popularTvShows.currentShow),

);

export const selectAvailableOriginCountries = createSelector(
    selectShows,
    (shows) => {
        const availableLangugesSet = new Set<string>();
        shows.forEach((show) => {
            show.origin_country.forEach((country) => {
                availableLangugesSet.add(country);
            })
        })
        return availableLangugesSet;
    }
);

export const selectAvailableOriginLanguages = createSelector(
    selectShows,
    (shows) => {
        const availableLangugesSet = new Set<string>();
        shows.forEach((show) => {
            availableLangugesSet.add(show.original_language);
        })
        return availableLangugesSet;
    }
)

export const selectAvailableGenreIds = createSelector(
    selectShows,
    (shows) => {
        const availableGenreIdsSet = new Set<string>();
        shows.forEach((show) => {
            show.genre_ids.forEach((genreId) => {
                availableGenreIdsSet.add(genreId.toString());
            })
        })
        return availableGenreIdsSet;
    }
)

const selectShowsFilter = createSelector(
    selectPopularTvShows,
    (popularTVShows) => {
        return popularTVShows.showsFilter;
    },
);

export const selectSetOriginCountriesFilter = createSelector(
    selectShowsFilter,
    (showsFilter) => new Set(showsFilter.setOriginCountries)
)

export const selectSetOriginalLanguagesFilter = createSelector(
    selectShowsFilter,
    (showsFilter) => new Set(showsFilter.setOriginalLanguages)
)

export const selectSetGenresFilter = createSelector(
    selectShowsFilter,
    (showsFilter) => new Set(showsFilter.setGenres)
)


export const selectFilteredShows = createSelector(
    selectShows,
    selectAvailableOriginCountries,
    selectSetOriginCountriesFilter,
    selectAvailableOriginLanguages,
    selectSetOriginalLanguagesFilter,
    selectAvailableGenreIds,
    selectSetGenresFilter,
    (shows, availableOriginCountries, setOriginCountries, availableOriginLanguages, setOriginalLanguages, availableGenres, setGenres) => {
        if((!setOriginCountries.size && !setOriginalLanguages.size && !setGenres.size) ||
            (
                setOriginCountries.size === availableOriginCountries.size 
                && setOriginalLanguages.size === availableOriginLanguages.size
                && setGenres.size === availableGenres.size
            )
        ) {
            console.log('#selectFilteredShows: No Filter was applied')
            return shows;
        }

        return shows.filter((show) => {
            if(
                (
                    !setOriginCountries.size || 
                    show.origin_country.some((country) => setOriginCountries.has(country))
                ) && 
                (
                    !setOriginalLanguages.size || 
                    setOriginalLanguages.has(show.original_language)
                ) &&
                (
                    !setGenres.size || 
                    show.genre_ids.some((genreId) => setGenres.has(genreId))
                )
            ) {
                return true;
            }
            
            return false;
        })
    },

);
