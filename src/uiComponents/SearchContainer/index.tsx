import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import ArrowStepper from '../base/ArrowStepper';

import './styles.scss';
import Tag from '../base/Tag';
import ShowRating from '../base/ShowRating';
import useTheMovieDB from '@/hooks/useTheMovieDB';
import { PlaceholderPosterImageSVG } from '../base/PlaceHolderImageSVG';
import { genreIdMapping } from '@/constants/tvGenreMappings';
import { TvResult } from '@/modules/moviedb-promise-main/src';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { selectSearchedTvShows, selectSearchQuery } from './selectors';
import { copySearchResultsToSearchListPageResults, updateSearchQuery } from './actionCreators';
import { Dialog, DialogContentInline, DialogOverlay, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowBigLeftDash } from 'lucide-react';
import ImageLoader from '../base/ImageLoader';

interface SearchImagePosterProps {
    poster_path: TvResult["poster_path"];
    name: TvResult["name"];
}

function SearchImagePoster(props: SearchImagePosterProps) {
    return props.poster_path ? (
        <ImageLoader
            src={`https://image.tmdb.org/t/p/w300${props.poster_path}`}
            alt={`Poster image of ${props.name}`}
            aspectRatio='2/3'
            placeholderComp={<PlaceholderPosterImageSVG className='animate-pulse' />}
            fallbackComp={<PlaceholderPosterImageSVG />}
        />
    ) : (
        <PlaceholderPosterImageSVG />
    )
}

interface SearchedBarItemProps {
    maxGenreIds?: number;
    tvShow: TvResult;
    onShowClicked: () => void;
}


// TODO: Temporarily export this item
export function SearchedBarItem(props: SearchedBarItemProps) {
    const { tvShow, onShowClicked, maxGenreIds = 2 } = props;
    return (
        <Link className="focusable" to={`/show/${tvShow.id}`} onClick={onShowClicked}>
            <div className="searched-tv-show-list-item-content" style={{ display: 'flex' }}>
                {/* <img className="searched-tv-show-list-item-image" alt="name" src={(tvShow.poster_path && `https://image.tmdb.org/t/p/w200${tvShow.poster_path}`) || 'https://via.placeholder.com/150x250'} /> */}
                <div className="searched-tv-show-list-item-image">
                    <SearchImagePoster poster_path={tvShow.poster_path} name={tvShow.name} />
                </div>
                {/* <ImageLoader className="searched-tv-show-list-item-image" src={ (tvShow.poster_path && `https://image.tmdb.org/t/p/original${tvShow.poster_path}`) || 'https://via.placeholder.com/150x250'} alt="name" /> */}
                <div className='searched-tv-show-list-item-info'>
                    <p className='searched-tv-show-list-item-name'>{tvShow.name || tvShow.original_name}</p>
                    <p className='searched-tv-show-list-item-overview'>{tvShow.overview}</p>
                    <div className='searched-tv-show-list-item-misc-info'>
                        {/* <p className='searched-tv-show-list-item-rating'>{tvShow.vote_average}/10</p> */}
                        <ShowRating className='searched-tv-show-list-item-rating' rating={tvShow.vote_average || 0} />
                        {
                            !!tvShow?.genre_ids?.length &&
                            <ul className="searched-tv-show-list-item-genres">
                                {
                                    tvShow.genre_ids.slice(0, maxGenreIds).map((genreId: number) => {
                                        return (
                                            <li className="searched-tv-show-list-item-genre" key={genreId}>
                                                <Tag color='light-gray'>
                                                    <span>{genreIdMapping[genreId.toString()]}</span>
                                                </Tag>
                                            </li>
                                        );
                                    })
                                }
                            </ul>
                        }
                    </div>
                </div>
            </div>
        </Link>
    );
}

interface InputAreaProps {
    className?: string;
    onSearchWrapperFocus: (evt: React.FocusEvent) => void;
    searchQuery: string;
    enabled: boolean;
    searchedTvShows: unknown[]; // TODO: Check this type
    inputInfo: { selectionStart: number | null, selectionEnd: number | null };
    onSearchInputChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
    onSearchInputKeydown: (evt: React.KeyboardEvent<HTMLInputElement>) => void;
    onSearchInputSelect: (evt: React.ChangeEvent<HTMLInputElement>) => void;
    onBackBtnClick?: () => void;
}

interface InputAreaHandle {
    clearInputValue: () => void;
    focusOnInput: () => void;
    current?: HTMLInputElement | null | undefined;
}

// TODO: Forward Ref is not needed in React 19
const InputArea = forwardRef(function InputArea(props: InputAreaProps, ref: React.ForwardedRef<InputAreaHandle>) {

    const backButtonDisabled = !props.onBackBtnClick;
    const searchInputRef = useRef<HTMLInputElement | null>(null);

    useImperativeHandle(ref, () => ({
        clearInputValue: () => {
            if (searchInputRef.current) {
                searchInputRef.current.value = '';
            }
        },
        focusOnInput: () => {
            if (searchInputRef.current?.focus) {
                searchInputRef.current.focus();
            }
        }

    }) as InputAreaHandle, [searchInputRef])

    useEffect(() => {
        // Set the selection area when first rendered
        if (props.inputInfo) {
            const { selectionStart = 0, selectionEnd = 0 } = props.inputInfo;
            searchInputRef.current?.setSelectionRange(selectionStart || 0, selectionEnd || 0);
        }
    }, [])

    return (
        <div className={`first-line:icon-search search-input-wrapper ${props.className}`}>
            <div className='search-close-btn-cont inline-block'>
                <Button className='text-3xl font-bold py-4 h-12' onClick={props.onBackBtnClick} disabled={backButtonDisabled} aria-hidden={backButtonDisabled}><ArrowBigLeftDash />Back</Button>
            </div>
            <input
                defaultValue={props.searchQuery}
                disabled={!props.enabled} type="search" ref={searchInputRef} className={(props.searchedTvShows.length ? 'has-content focusable' : '') + " search-tv-show-input"} tabIndex={0}
                onChange={props.onSearchInputChange} onKeyDown={props.onSearchInputKeydown} placeholder="Search for a tv show!"
                onSelect={props.onSearchInputSelect}
            />
        </div>
    )
});

interface SearchTVContainerProps {
    enabled: boolean;
}

function SearchTVContainer(props: SearchTVContainerProps) {
    const searchTVContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<InputAreaHandle>(null);
    const { enabled } = props;
    const searchedTvShows = useAppSelector(selectSearchedTvShows);
    const dispatch = useAppDispatch();
    const [movieDbApi] = useTheMovieDB();
    const navigate = useNavigate(); // TODO: have this passed in instead as a prop as this is too tightly coupled
    const searchQuery = useAppSelector(selectSearchQuery);
    const searchInputInfoRef = useRef<{ selectionStart: number | null, selectionEnd: number | null }>({ selectionStart: 0, selectionEnd: 0 });
    const [backBtnAnimationStatus, setBackBtnAnimationStatus] = useState('initial');
    const [isDialogOpen, setDialogOpen] = useState(!!searchedTvShows.length);

    useEffect(() => {
        if (!isDialogOpen && !!searchedTvShows.length) {
            setDialogOpen(true);
        }
    }, [searchedTvShows]);

    const onSearchInputSelect = useCallback((evt: React.SyntheticEvent) => {
        searchInputInfoRef.current.selectionStart = (evt.target as HTMLInputElement).selectionStart;
        searchInputInfoRef.current.selectionEnd = (evt.target as HTMLInputElement).selectionEnd;
    }, [])


    const onSearchInputChange = useCallback((evt: React.ChangeEvent) => {
        const searchString = (evt.target as HTMLInputElement).value;
        onSearchInputSelect(evt)
        if (movieDbApi) {
            dispatch(updateSearchQuery({ tmdbInstance: movieDbApi, searchQuery: searchString }));
        }
    }, [dispatch, movieDbApi]);


    const onSearchTVBlur = useCallback((evt: React.FocusEvent) => {
        // TODO: Add proper check for IE and move blur logic to a shared util.
        if (!evt.relatedTarget || (evt.relatedTarget && !searchTVContainerRef?.current?.contains(evt.relatedTarget))) {
            setDialogOpen(false);
        }
    }, []);

    const onShowClicked = useCallback(() => {
        setDialogOpen(false);
    }, []);

    const onSearchTvContainerKeyDown = useCallback((evt: React.KeyboardEvent) => {
        // TODO: Use centralized key-code
        if (evt.key === 'Escape' && searchedTvShows.length) {
            setDialogOpen(false);

            if (inputRef.current) {
                inputRef.current.clearInputValue();
            }
        }
    }, [searchedTvShows.length]);

    const onSearchWrapperFocus = useCallback((evt: React.FocusEvent) => {
        evt.stopPropagation();
        evt.preventDefault();
        inputRef.current?.focusOnInput();
    }, []);

    const onSearchInputKeydown = useCallback((event: React.KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === 'Enter') {

            const queryString = (event.target as HTMLInputElement).value;
            const params = new URLSearchParams({ q: queryString });

            dispatch(copySearchResultsToSearchListPageResults());
            // TODO: Check if the current path is equal to the new path and do not allow the navigation
            navigate(`/search?${params.toString()}`, /*{state: {query: event.currentTarget.value}, viewTransition: true}*/);
            onShowClicked();// TODO: Centralize logic in the state
        }
    }, [dispatch, navigate, onShowClicked]);

    const onOpenChange = useCallback((isOpen: boolean) => {
        if (!isOpen && backBtnAnimationStatus !== "not-initial") {
            setBackBtnAnimationStatus("not-initial");
        }
    }, [backBtnAnimationStatus])

    function focusOnSearchInput(delay = true) {
        function fn() {
            inputRef.current?.focusOnInput();
        }
        if (delay) {
            setTimeout(fn, 100);
        } else {
            fn();
        }
    }

    const onEscapeKeydown = useCallback(() => {
        focusOnSearchInput()
    }, []);

    const onBackButtonClick = useCallback(() => {
        setDialogOpen(false);
        focusOnSearchInput();
    }, []);

    const onInteractOutside = useCallback(() => {
        setDialogOpen(false);
    }, []);

    const onOpenAutoFocus = useCallback((evt: Event) => {
        evt.preventDefault();
        focusOnSearchInput(false);
    }, []);

    return (
        <div className="SearchTVContainer" onKeyDown={onSearchTvContainerKeyDown} ref={searchTVContainerRef} onBlur={onSearchTVBlur}>
            <ArrowStepper>
                <Dialog open={isDialogOpen} onOpenChange={onOpenChange}>
                    <DialogTrigger asChild>
                        {
                            !isDialogOpen &&
                            <InputArea key={"Constant_SEARCH_INPUT_KEY"} className={backBtnAnimationStatus}
                                searchQuery={searchQuery}
                                inputInfo={searchInputInfoRef.current}
                                onSearchWrapperFocus={onSearchWrapperFocus}
                                enabled={enabled}
                                searchedTvShows={searchedTvShows}
                                onSearchInputChange={onSearchInputChange}
                                onSearchInputKeydown={onSearchInputKeydown}
                                onSearchInputSelect={onSearchInputSelect}
                                ref={inputRef}
                            />}
                    </DialogTrigger>

                    <DialogOverlay />

                    <DialogContentInline
                        onOpenAutoFocus={onOpenAutoFocus}
                        onEscapeKeyDown={onEscapeKeydown}
                        onInteractOutside={onInteractOutside}>
                        <>
                            {!!isDialogOpen &&
                                <InputArea key={"Constant_SEARCH_INPUT_KEY"} onBackBtnClick={onBackButtonClick}
                                    searchQuery={searchQuery}
                                    inputInfo={searchInputInfoRef.current}
                                    onSearchWrapperFocus={onSearchWrapperFocus}
                                    enabled={enabled}
                                    searchedTvShows={searchedTvShows}
                                    onSearchInputChange={onSearchInputChange}
                                    onSearchInputKeydown={onSearchInputKeydown}
                                    onSearchInputSelect={onSearchInputSelect}
                                    ref={inputRef}
                                />
                            }

                            <ul className="searched-tv-show-list">
                                {
                                    searchedTvShows.slice(0, 6).map((tvShow) => (
                                        <li key={tvShow.id} className="searched-tv-show-list-item">
                                            <SearchedBarItem tvShow={tvShow} onShowClicked={onShowClicked} />
                                        </li>
                                    ))
                                }
                            </ul>
                        </>
                    </DialogContentInline>
                </Dialog>
            </ArrowStepper>
        </div>
    );
}

export default SearchTVContainer;
