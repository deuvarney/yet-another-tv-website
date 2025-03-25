

import { useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

import { useDynamicScrollExec } from '@/hooks/useScrollPosition';
import MovieItem from '../MovieItem';

// import action Creators
import { updateSelectedShowType, getShowTypeShows } from './actionCreators';

// import selectors
import { selectCurrentShowType, selectFilteredShows } from './selectors';

import './styles.scss';
import { SHOW_FILTER_TYPE, type Show } from '@/types/themoviedbTypes';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import ShowListFilters from './ShowListFilters';
import useTheMovieDB from '@/hooks/useTheMovieDB';
import { selectIsHomeFiltersEnabled } from '../AppContainer/selectors';

type ShowsGridViewProps = {
    isPoplularBtnDisabled?: boolean;
    isTrendingBtnDisabled?: boolean;
    onPopularClicked: () => void;
    onTrendingClicked: () => void;
    shows: Show[];
    showHomeFilters: boolean;
}

function ShowsGridView(props: ShowsGridViewProps) {
    return (
        <div className="tv-series">
            <div className="tv-series-filters">
                <Button disabled={props.isPoplularBtnDisabled} onClick={props.onPopularClicked}>Popular</Button>
                <Button disabled={props.isTrendingBtnDisabled} onClick={props.onTrendingClicked}>Trending</Button>
            </div>

            { !!props.showHomeFilters && <ShowListFilters /> }

            <div className="popular-tv-shows">
                {
                    props.shows.map((currentTvShow) => (
                        <Link className='movie-item-link' key={currentTvShow.id} to={`/show/${currentTvShow.id}`}>
                            <MovieItem {...currentTvShow} />
                        </Link>
                    ))
                }
            </div>
        </div>
    );
}


function PopularTvShowsContainer(/*props*/) {
    const popularTvShows = useAppSelector(selectFilteredShows);
    const showType = useAppSelector(selectCurrentShowType);
    const showHomeFilters = useAppSelector(selectIsHomeFiltersEnabled);
    const [theMovieDB] = useTheMovieDB();
    const dispatch = useAppDispatch();

    useEffect(() => {
        // this.props.updatePopularShows();
        if(theMovieDB){
            dispatch(getShowTypeShows(theMovieDB));
        }
    }, [theMovieDB]); // Only Run once

    useDynamicScrollExec(!!popularTvShows.length, () => {
        if(theMovieDB){
            dispatch(getShowTypeShows(theMovieDB));
        }
    });

    const onTrendingClicked = useCallback((/* evt*/) => {
        if(!theMovieDB) {return;}
        dispatch(updateSelectedShowType({
            selectedShowType: SHOW_FILTER_TYPE.SHOW_TYPE_TRENDING,
            tmdbInstance: theMovieDB
        }));
    }, [dispatch, theMovieDB]);

    const onPopularClicked = useCallback((/* evt*/) => {
        if(!theMovieDB) {return;}
        dispatch(updateSelectedShowType({
            selectedShowType: SHOW_FILTER_TYPE.SHOW_TYPE_POPULAR,
            tmdbInstance: theMovieDB
        }));
    }, [dispatch, theMovieDB]);

    const isTrendingBtnDisabled = showType === SHOW_FILTER_TYPE.SHOW_TYPE_TRENDING;
    const isPoplularBtnDisabled = !isTrendingBtnDisabled;

    return (
        <ShowsGridView
            shows={popularTvShows}
            onPopularClicked={onPopularClicked}
            onTrendingClicked={onTrendingClicked}
            isPoplularBtnDisabled={isPoplularBtnDisabled}
            isTrendingBtnDisabled={isTrendingBtnDisabled}
            showHomeFilters={showHomeFilters}
        />
    );
}

export default PopularTvShowsContainer;
