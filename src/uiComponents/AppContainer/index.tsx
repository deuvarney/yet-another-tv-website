import { BrowserRouter as Router, Route, Routes, Link, useLocation, useParams, useSearchParams } from 'react-router-dom';

import PopularTvShowsContainer from '../PopularTvShowsContainer';
import TVSeasonsContainer from '../TVShowContainer';
import TVSeasonContainer from '../TVEpisodeContainer';
import SearchMovieContainer from '../SearchContainer';
import './styles.scss';
import TVSeasonOverviewContainer from '../TVSeasonOverviewContainer';
import Settings from '../Settings';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toggleSettingsDialog } from '@/utils/actionsHander';
import SearchListContainer from '../SearchListContainer';
import TermsOfServiceContainer from '../TermsOfServiceContainer';
import YATWLogo from '@/assets/yatwLogo';
import { loadApplicationSettings } from './actionCreators';
import { selectAPIKey } from './selectors';
import basePath from '@/config/basePath';

const WrappedTVSeasonsContainer = (/* props*/) => {
    const { showId = '0' } = useParams();
    return <TVSeasonsContainer showId={parseInt(showId)} />;
};

const WrappedTVSeasonEpisodeContainer = (/* props*/) => {
    const { showId = '', seasonNumber = '0', episodeNumber = '1' } = useParams();
    return <TVSeasonContainer showId={showId} seasonNumber={parseInt(seasonNumber)} episodeNumber={parseInt(episodeNumber)} />;
};


const WrappedTVSeasonContainer = (/* props*/) => {
    const { showId = '', seasonNumber = '0' } = useParams();
    return <TVSeasonOverviewContainer showId={showId} seasonNumber={parseInt(seasonNumber)} />;
};

const WrappedSearchShowContainer = (/* props */) => {
    const [paramsz, _fn] = useSearchParams();
    return <SearchListContainer query={paramsz.get('q') || ''} />
}


function NoAPIKeyMessage() {
    return (
        <div className='w-full h-full fixed text-lg top-0 content-center shadow-xl pointer-events-none'>
            <Card className="m-auto w-[80%] md:w-[45rem] pointer-events-auto">
                <CardHeader>
                    <CardTitle className='text-3xl'>TMDB API Key Not Found</CardTitle>
                    <CardDescription className='text-xl'>In order to use this application, you must provide a TMDB API key in the settings menu.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Note: This key is not shared to the server and is only used to make requests to the TMDB API through your browser. For detailed information, take a look at the detailed usage page <Link className="underline" to='/tos'>here</Link>.</p>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button className='font-bold text-xl' onClick={() => { toggleSettingsDialog() }}>Open Settings</Button>
                </CardFooter>
            </Card>
        </div>
    );
}

function NoAPIKeyMessageRoutes() {
    return (
        <Routes>
            <Route path="/tos" element={<TermsOfServiceContainer />} />
            <Route path="*" element={<NoAPIKeyMessage />} />
        </Routes>
    )
}

function AppRoutes() {
    return (
        <Routes>
            <Route path="/show/:showId" element={<WrappedTVSeasonsContainer />} />
            <Route path="/show/:showId/season/:seasonNumber" element={<WrappedTVSeasonContainer />} />
            <Route path="/show/:showId/season/:seasonNumber/episode/:episodeNumber" element={<WrappedTVSeasonEpisodeContainer />} />
            <Route path="/search" element={<WrappedSearchShowContainer />} />
            <Route path="/tos" element={<TermsOfServiceContainer />} />
            <Route path="*" element={<PopularTvShowsContainer />} />
        </Routes>
    )
}

interface AppContainerContentProps {
    apiKey: string;
  }

function AppContainerContent(props: AppContainerContentProps) {

    const location = useLocation();
    const isTOSPage = location.pathname === '/tos';
    const showSearchBar = !isTOSPage;
    const { apiKey } = props;

    return (
        <div className="AppContainer">
            <header className="header flex justify-between items-center">
                <Link aria-label="Home" className='ml-2' to="/"><YATWLogo className='h-12 pt-1'/></Link>
                <Settings />
            </header>
            {
                !!showSearchBar &&
                <nav className="nav">
                    <SearchMovieContainer enabled={!!apiKey} />
                </nav>
            }

            <main className="main">
                {apiKey ? <AppRoutes /> : <NoAPIKeyMessageRoutes />}
            </main>
            <footer className="footer">
                <p>Last but not least, an awesome footer</p>
            </footer>
        </div>
    );
}

function App() {

    const apiKey = useAppSelector(selectAPIKey);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(loadApplicationSettings());
    }, []);

    return (
        <Router basename={basePath()}>
            <AppContainerContent apiKey={apiKey} />
        </Router>
    );
}

export default App;
