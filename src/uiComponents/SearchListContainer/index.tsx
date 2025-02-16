import useTheMovieDB from "@/hooks/useTheMovieDB";
import { useEffect } from "react";
import { SearchedBarItem } from "../SearchContainer";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { selectSearchedTVShowsListPageLoadedCount, selectSearchedTVShowsListPageResults } from "../SearchContainer/selectors";
import { queryMoreSearchListResults } from "../SearchContainer/actionCreators";
import { useScrollPositionExec } from '@/hooks/useScrollPosition';


interface SearchListContainerProps {
    query: string;
}

function SearchListContainer(props: SearchListContainerProps) {

    const [movieDbApi] = useTheMovieDB();

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

    useScrollPositionExec(.75, () => {
        if(!movieDbApi) { return; }
        dispatch(queryMoreSearchListResults({ tmdbInstance: movieDbApi, searchQuery }));
    });

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