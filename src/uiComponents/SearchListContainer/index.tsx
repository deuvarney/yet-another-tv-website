import useTheMovieDB from "@/hooks/useTheMovieDB";
import { useEffect } from "react";
import { SearchedBarItem } from "../SearchMovieContainer";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { selectSearchedTVShowsListPageLoadedCount, selectSearchedTVShowsListPageResults } from "../SearchMovieContainer/selectors";
import { queryMoreSearchListResults } from "../SearchMovieContainer/actionCreators";
import useScrollPosition from '@/hooks/useScrollPosition';


interface SearchListContainerProps {
    query: string;
}

function SearchListContainer(props: SearchListContainerProps) {

    const [movieDbApi] = useTheMovieDB();
    const scrollPosition = useScrollPosition();

    const dispatch = useAppDispatch();
    const searchBarSearchTvResults = useAppSelector(selectSearchedTVShowsListPageResults);
    const loadedSearchResultsPagesCount = useAppSelector(selectSearchedTVShowsListPageLoadedCount);
    const searchQuery = props.query.trim();

    useEffect(() => {
        console.log("SearchListContainer useEffect called", loadedSearchResultsPagesCount, searchQuery, movieDbApi);
        if (!loadedSearchResultsPagesCount && searchQuery && movieDbApi) {
            dispatch(queryMoreSearchListResults({ tmdbInstance: movieDbApi, searchQuery }));
        }
    }, [movieDbApi]);

    useEffect(() => {
        if (movieDbApi && (scrollPosition + window.screen.availHeight) / document.body.scrollHeight >= .75) {
            dispatch(queryMoreSearchListResults({ tmdbInstance: movieDbApi, searchQuery }));
        }
    }, [scrollPosition]); // Only Run once

    return (
        <>
            {/* <ShowListFilters /> */}
            <h1 className="text-4xl text-center my-4">Search Results for: <em>&quot;{props.query}&quot;</em></h1>
            <ul>
                {searchBarSearchTvResults.map((tvShow) => {
                    return (
                        <li key={tvShow.id} className="searched-tv-show-list-item mb-4 p-3 h-56">
                            {/* TODO: Temp import */}
                            <SearchedBarItem tvShow={tvShow} onShowClicked={() => { }} maxGenreIds={4}/>
                        </li>
                    );
                })}
            </ul>
        </>
    );
}

export default SearchListContainer;