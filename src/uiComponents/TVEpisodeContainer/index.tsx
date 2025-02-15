import React, { useCallback, useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import TVSeasonsSideNav, { TvSeasonsNavBarListItem } from '../TVSeasonsNavBar';

import './styles.scss';
import { Season, Episode } from '../../types/themoviedbTypes';
import { PeopleCarousel } from '../base/PeopleList';
import ContentContainer from '../base/ContentContainer';
import IconWithText from '../base/IconWIthText';
import { ArrowLeftToLine, CalendarDays, ChevronDownIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '@radix-ui/react-dropdown-menu';
import { ShowResponse } from '@/modules/moviedb-promise-main/dist';

import BreadCrumbSeasons from '../base/BreadcrumbSeasons';
import { useScreenWidth } from '@/hooks/useScreenWidth';
import { EpisodeVideosResponse, Video } from '@/modules/moviedb-promise-main/src';
import BackgroundPageImages from '../base/BackgroundPageImages';
import TVContentMainContainer from '../TVContentMainContainer';
import VideosDialogListContent from '../SharedComponents';
import useTheMovieDB from '@/hooks/useTheMovieDB';
import { useAppSelector } from '@/hooks/redux';
import { selectIsYoutubeEnabled } from '../AppContainer/selectors';
import usePrevious from '@/hooks/usePrevious';



type TVSeasonsNavBarEpisodeItemsProps = {
    activeItemId: number | string;
    currentDate: number;
    epiClickFn: (episodeNumber: number) => void;
    episodes: Episode[];
    seasonNumber: number;
    showId: string;
}

function getTVSeasonsNavBarEpisodeItems(props: TVSeasonsNavBarEpisodeItemsProps): React.ReactNode[] {
    const { activeItemId, currentDate, epiClickFn, episodes, seasonNumber, showId } = props;
    const overviewItem = (
        <TvSeasonsNavBarListItem
            key={'overview'}
            className='TVSeasons-NavBar-List-Item-Overview'
            isActive={activeItemId === 'overview'}
        >
            <Link to={`/show/${showId}/season/${seasonNumber}`}>
                <div className="TVSeasons-NavBar-List-Item-Overview-Link">{'Overview'}</div>
            </Link>
        </TvSeasonsNavBarListItem>
    );


    const episodesList = episodes.map((episode) => (
        <TvSeasonsNavBarListItem
            key={episode.id}
            isActive={episode.id === activeItemId}>
            <Link
                to={`/show/${showId}/season/${seasonNumber}/episode/${episode.episode_number}`}
                className="season-name"
                onClick={() => epiClickFn(episode.episode_number as number)}
            >{episode.name}
                {episode.air_date && new Date(episode.air_date).getTime() > currentDate ?
                    <p className="air-date">{`[Airing: ${episode.air_date}]`}</p> : null}
            </Link>
        </TvSeasonsNavBarListItem>
    ));
    episodesList.unshift(overviewItem);

    return episodesList;
}

type TVSeasonContainerPropsType = {
    seasonNumber: number;
    showId: string;
    episodeNumber: number;
}

type TvEpisodeSideNavProps = {
    episodesList: React.ReactNode
    showId: number | string;
    selectedEpisode: Episode;
    fullWidth?: boolean;
    showBreadCrumb?: boolean;
}

function TvEpisodeSideNav(props: TvEpisodeSideNavProps) {
    const { showBreadCrumb = true } = props;

    const breadCrumbElem = !!showBreadCrumb && (
        <Link to={`/show/${props.showId}/`}>
            <div className="navbar-back icon-back TVSeasonsNavBar-title">
                <IconWithText>
                    <ArrowLeftToLine /> {/** Centralize this logic? */}
                    <span className='TVSeasonsNavBar-title-value'>Show</span>
                </IconWithText>
            </div>
        </Link>
    ) || null;

    return (
        <TVSeasonsSideNav
            activeItemId={props.selectedEpisode.id}
            fullWidth={props.fullWidth}
            breadCrumbElem={breadCrumbElem}
        >
            {props.episodesList}
        </TVSeasonsSideNav>
    );
}

function TVSeasonContainer(props: TVSeasonContainerPropsType) {
    const { seasonNumber, showId, episodeNumber: episodeNumberPropValue } = props;

    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [seasonName, setSeasonName] = useState('');
    const [selectedEpisode, setSelectedEpisode] = useState<Episode>({});
    const [currentDate] = useState(new Date().getTime());
    const [tvShow, setTvShow] = useState<ShowResponse>({});
    // const [seasonImages, setSeasonImages] = useState<TvSeasonRequest[]>([]);
    const [episodeVideos, setEpisodeVideos] = useState<Video[]>([]);
    const isMobileView = useScreenWidth(600);
    const [movieDbApi] = useTheMovieDB();

    const isVideoFeatureEnabled = useAppSelector(selectIsYoutubeEnabled);
    const prevIsVideoFeatureEnabled = usePrevious(isVideoFeatureEnabled);

    if (!!prevIsVideoFeatureEnabled && !isVideoFeatureEnabled) {
        setEpisodeVideos([]);
    }


    const epiClick = useCallback((episodeNumber: number) => {
        const existingEpisode = episodes.find((episode: Episode) => episode.episode_number === episodeNumber);
        if (existingEpisode) {
            setSelectedEpisode(existingEpisode);
        }
    }, [episodes]);


    useEffect(
        // TODO: Move all of this logic to the action Creators

        () => {
            movieDbApi?.seasonInfo({ id: showId, season_number: seasonNumber }).then((season: Season) => {
                setEpisodes(season.episodes || []);
                setSeasonName(season.name || '');

                const curEpisode = season.episodes?.find((episode: Episode) => episode.episode_number === episodeNumberPropValue);
                if (curEpisode || season.episodes?.[0]) {
                    setSelectedEpisode(curEpisode || (season.episodes as Episode[])[0]);
                }
            });

            movieDbApi?.tvInfo({ id: showId }).then((tvShow: ShowResponse) => {
                setTvShow(tvShow);
            })
        },
        [movieDbApi, showId, seasonNumber], // Run Only Once
    );

    useEffect(() => {
        const currEpisodeNum =
            episodeNumberPropValue
            || selectedEpisode?.episode_number
            // || tvShow?.seasons?.[seasonNumber]?.episodes?.[0]?.episode_number
            || 1;
        // movieDbApi.episodeImages({ id: showId, season_number: seasonNumber, episode_number: currEpisodeNum }).then((resp) => {
        //     setSeasonImages(resp.stills);
        // });
        // TODO: Move this logic to the action Creators
        if (isVideoFeatureEnabled) {
            movieDbApi?.episodeVideos({ id: showId, season_number: seasonNumber, episode_number: currEpisodeNum }).then((videos: EpisodeVideosResponse) => {
                setEpisodeVideos(videos.results as Video[]);
            });
        }
    },
        [movieDbApi, showId, seasonNumber, episodeNumberPropValue, isVideoFeatureEnabled],
    );


    const episodesList = getTVSeasonsNavBarEpisodeItems({
        activeItemId: selectedEpisode.id as number,
        currentDate,
        epiClickFn: epiClick,
        episodes,
        seasonNumber,
        showId
    });

    return (
        <BackgroundPageImages backdropPath={selectedEpisode.still_path || ''}>
            {
                !isMobileView && (
                    <TvEpisodeSideNav
                        episodesList={episodesList}
                        showId={showId}
                        selectedEpisode={selectedEpisode}
                    />
                )
            }

            <TVContentMainContainer>
                <ContentContainer className='TVSeasonContainerName-Cont'>
                    <BreadCrumbSeasons showId={showId} seasonNumber={seasonNumber} seasonName={seasonName} tvShow={tvShow} />
                    {
                        isMobileView ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger style={{ background: 'none' }}>
                                    <IconWithText>
                                        <h1 className="TVSeasonContainerName-Name">{selectedEpisode.name}</h1>
                                        <ChevronDownIcon className='bouncing-element' size={24} style={{ paddingLeft: '.8rem' }} />
                                    </IconWithText>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" style={{ zIndex: 1 }}>
                                    {
                                        !!isMobileView && (
                                            <TvEpisodeSideNav
                                                episodesList={episodesList}
                                                showId={showId}
                                                selectedEpisode={selectedEpisode}
                                                fullWidth
                                                showBreadCrumb={false}
                                            />
                                        )
                                    }

                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <h1 className="TVSeasonContainerName-Name">{selectedEpisode.name}</h1>
                        )
                    }

                    <IconWithText>
                        <CalendarDays size={14} />
                        <p className="TVSeasonContainerName-AirDate">Air Date: {selectedEpisode.air_date}</p>
                    </IconWithText>
                    <p className="TVSeasonContainerName-Overview">{selectedEpisode.overview}</p>
                </ContentContainer>


                <VideosDialogListContent videos={episodeVideos} title="Episode Videos" />


                {
                    !!selectedEpisode?.guest_stars?.length &&
                    <ContentContainer>
                        <PeopleCarousel peopleList={selectedEpisode.guest_stars} title="Guest Stars" showCharacter />
                    </ContentContainer>
                }
                {
                    !!selectedEpisode?.crew?.length &&
                    <ContentContainer>
                        <PeopleCarousel peopleList={selectedEpisode.crew} title="Crew" showJob />
                    </ContentContainer>
                }
            </TVContentMainContainer>
        </BackgroundPageImages>
    );
}

export default TVSeasonContainer;
