import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import TVSeasonsSideNav, { TvSeasonsNavBarListItem } from '../TVSeasonsNavBar';

import { useAppDispatch } from '../../hooks/redux';
import { useSelector } from 'react-redux';

import './styles.scss';
import { getCurrentShowInfo } from '../PopularTvShowsContainer/actionCreators';
import { selectCurrentShow } from '../PopularTvShowsContainer/selectors';
import PeopleList from '../base/PeopleList';
import ContentContainer, { ContextContainerText_H1 } from '../base/ContentContainer';
import { ChevronDownIcon, ExternalLink } from 'lucide-react';
import IconWithText from '../base/IconWIthText';
import BackgroundPageImages from '../base/BackgroundPageImages';
import TVRecentEpisodesTabs from '../RecentEpisodeTabs';
import TVContentMainContainer from '../TVContentMainContainer';
import { useScreenWidth } from '@/hooks/useScreenWidth';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '@radix-ui/react-dropdown-menu';
import useTheMovieDB from '@/hooks/useTheMovieDB';

interface SideNavProps {
    fullWidth?: boolean;
    seasonsList: JSX.Element[]; // or whatever type seasonsList is
  }
  
  

function SideNav(props: SideNavProps){
    return (
    <TVSeasonsSideNav fullWidth={props.fullWidth} header={'Seasons'}>
        {props.seasonsList}
    </TVSeasonsSideNav>
    );
}


type TVSeasonsContainerPropsType = {
    showId: number;
}
function TVSeasonsContainer(props: TVSeasonsContainerPropsType) {
    const { showId } = props;
    const tvShow = useSelector(selectCurrentShow);
    const dispatch = useAppDispatch();
    const isMobileView = useScreenWidth(600);
    const [tmdbInstance] = useTheMovieDB();

    useEffect(() => {
        if(tmdbInstance){
            dispatch(getCurrentShowInfo({showId, tmdbInstance}));
        }
    }, [showId, tmdbInstance]);

    const {
        backdrop_path: backdropPath,
        created_by: createdBy = [],
        homepage,
        name,
        overview,
        /* number_of_seasons, */
        seasons = [],

        last_episode_to_air: lastAired,
        networks = [],
        next_episode_to_air: nextToAir,
        tagline,
        status,
    } = tvShow || {};

    const seasonsList = seasons.map((season) => {
        const hasAired = !!season.air_date && new Date(season.air_date).getTime() < new Date().getTime();

        return (
            <TvSeasonsNavBarListItem key={season.id}>
                <Link className='TVSeasonsNavBarList-item-link' key={season.id} to={`/show/${showId}/season/${season.season_number}`}>
                    <p className="season-name">{season.name}</p>
                    {hasAired && nextToAir?.season_number === season.season_number && <p className="season-info">[In Progress]</p>}
                    {!hasAired && <p className="season-info">[Scheduled]</p>}
                </Link>
            </TvSeasonsNavBarListItem>
        );

    });

    const lastToAirSeason = seasons.find((season) => season.season_number === lastAired?.season_number);
    const nextToAirSeason = seasons.find((season) => season.season_number === nextToAir?.season_number);

    return (
        <BackgroundPageImages backdropPath={backdropPath || ''}>

            {
                !isMobileView && (
                    <SideNav seasonsList={seasonsList} />
                )
            }

            <TVContentMainContainer>
                <ContentContainer className='TVSeasonsContentz-MainCont'>
                {
                        isMobileView ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger style={{background: 'none'}}>
                                    <IconWithText>
                                    <ContextContainerText_H1 className="TVSeasonsContentz-Name">{name}</ContextContainerText_H1>
                                    <ChevronDownIcon className='bouncing-element' size={24} style={{paddingLeft: '.8rem'}} />
                                    </IconWithText>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='start' style={{ zIndex: 1 }}>
                                    {
                                        !!isMobileView && (
                                            <SideNav
                                                fullWidth
                                                seasonsList={seasonsList} 
                                            />
                                        )
                                    }

                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <ContextContainerText_H1 className="TVSeasonsContentz-Name">{name}</ContextContainerText_H1>
                        )
                    }
                    {tagline ? <h2 className="TVSeasonsContentz-TagLine">{tagline}</h2> : null}
                    {status ?
                        (
                            <div className="TVSeasonsContentz-Status">
                                <span className="TVSeasonsContentz-Status-label">Status</span>
                                <span className='TVSeasonsContentz-Status-value'>[{status}]</span>
                            </div>
                        )
                        : null
                    }
                    <p className="TVSeasonsContentz-OverView">{overview}</p>
                </ContentContainer>

                <TVRecentEpisodesTabs lastAired={lastAired} lastToAirSeason={lastToAirSeason} nextToAir={nextToAir} nextToAirSeason={nextToAirSeason} showId={showId} />

                {
                    !!createdBy.length &&
                    <ContentContainer>
                        <PeopleList title={'Cast'} peopleList={createdBy} />
                    </ContentContainer>
                }

                {
                    networks.length > 0 &&
                    <ContentContainer>
                        <div className="TVSeasonsContentz-networks">
                            <div className="TVSeasonsContentz-networks-label">Networks</div>
                            <div className="TVSeasonsContentz-networks-items">
                                {
                                    networks.map((network) => {
                                        return (
                                            <div className="TVSeasonsContentz-networks-item" key={network.id}>
                                                <img className='TVSeasonsContentz-networks-item-logo' src={`https://image.tmdb.org/t/p/w200${network.logo_path}`} alt={network.name} />
                                                <p className="TVSeasonsContentz-networks-item-name">{network.name}</p>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    </ContentContainer>
                }

                <ContentContainer>
                    <div className="TVSeasonsContentz-misc-label">Misc</div>
                    <IconWithText className={'TVSeasonsContentz-misc-homepage-link'}>
                        <ExternalLink size={16} />
                        <a target="_blank" rel='noreferrer' href={homepage}>Homepage Link</a>
                    </IconWithText>
                </ContentContainer>
            </TVContentMainContainer>

        </BackgroundPageImages>
    );
}

export default TVSeasonsContainer;
