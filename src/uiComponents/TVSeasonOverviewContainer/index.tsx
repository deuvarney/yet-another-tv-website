import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import TVSeasonsSideNav, { TvSeasonsNavBarListItem } from '../TVSeasonsNavBar';

import './styles.scss';
import { Season, Episode } from '@/types/themoviedbTypes';
import ContentContainer, { ContentContainerLabel, ContentContainerLabelValue, ContextContainerText_H1 } from '../base/ContentContainer';
import IconWithText from '../base/IconWIthText';
import { ArrowLeftToLine, ChevronDownIcon } from 'lucide-react';
import { ShowResponse } from '@/modules/moviedb-promise-main/dist';

import { type CarouselApi } from "@/components/ui/carousel"
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import BreadCrumbSeasons from '../base/BreadcrumbSeasons';
import { Poster, TvSeasonImagesResponse, Video, VideosResponse } from '@/modules/moviedb-promise-main/src';
import BackgroundPageImages from '../base/BackgroundPageImages';
import { useScreenWidth } from '@/hooks/useScreenWidth';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '@radix-ui/react-dropdown-menu';
import TVContentMainContainer from '../TVContentMainContainer';
import VideosDialogListContent from '../SharedComponents';
import useTheMovieDB from '@/hooks/useTheMovieDB';
import { useAppSelector } from '@/hooks/redux';
import { selectIsYoutubeEnabled } from '../AppContainer/selectors';
import usePrevious from '@/hooks/usePrevious';
import ImageLoader from '../base/ImageLoader';
import { PlaceholderPosterImageSVG } from '../base/PlaceHolderImageSVG';


interface TVSeasonsNavBarEpisodeItemsProps {
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

function getStatusText(season: Season, currentDate: number, lastEpisode?: Episode) {
    let statusText = '';
    // If there is not a season air_date, then the status text should be 'Announced'
    // If there there is a season air_date that is before the current data, the status text should be 'Scheduled'
    // If the air_date of the last episode is after the current date, the status text should be 'In Progress'
    if (!season?.air_date) {
        statusText = 'Announced';
    } else if (lastEpisode?.air_date) {
        statusText = new Date(lastEpisode.air_date).getTime() > currentDate ? 'In Progress' : 'Aired';
    } else if (new Date(season.air_date).getTime() < currentDate) {
        statusText = 'Scheduled';
    }
    return statusText;
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

type TVSeasonContainerPropsType = {
    seasonNumber: number;
    showId: string;
}

function TVSeasonOverviewContainer(props: TVSeasonContainerPropsType) {
    const { seasonNumber, showId } = props;

    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [seasonName, setSeasonName] = useState('');
    const [selectedEpisode, setSelectedEpisode] = useState<Episode>({});
    const [currentDate] = useState(new Date().getTime());
    const [tvShow, setTvShow] = useState<ShowResponse>({});
    const [seasonImages, setSeasonImages] = useState<Poster[]>([]);
    const [seasonVideos, setSeasonVideos] = useState<Video[]>([]);
    const isMobileView = useScreenWidth(600);
    const isVideoFeatureEnabled = useAppSelector(selectIsYoutubeEnabled);
    const prevIsVideoFeatureEnabled = usePrevious(isVideoFeatureEnabled);



    const [season, setSeason] = useState<Season>({});
    const [api, setApi] = React.useState<CarouselApi>();

    const [movieDbApi] = useTheMovieDB();

    if (!!prevIsVideoFeatureEnabled && !isVideoFeatureEnabled && !!seasonVideos.length) {
        setSeasonVideos([]);
    }

    const epiClick = (index: number) => {
        const episodeNumber = selectedEpisode?.episode_number || 0;
        if ((episodeNumber || 0) - 1 !== index && episodes[index]) {
            setSelectedEpisode(episodes[index]);
        }
    };

    //  TODO: Move this to its own custom hook
    React.useEffect(() => {
        let intervalId: NodeJS.Timeout | undefined;
        if (api) {
            intervalId = setInterval(() => {
                api.scrollNext();
            }, 5000)
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        }
    }, [api])


    useEffect(
        // TODO: Move all of this logic to the action Creators
        () => {
            movieDbApi?.seasonInfo({ id: showId, season_number: seasonNumber }).then((season: Season) => {
                setEpisodes(season.episodes || []);
                setSeasonName(season.name || '');
                setSelectedEpisode((season?.episodes && season.episodes[0]) || {});
                setSeason(season);
            });

            movieDbApi?.tvInfo({ id: showId }).then((tvShow: ShowResponse) => {
                setTvShow(tvShow);
            })

            movieDbApi?.seasonImages({ id: showId, season_number: seasonNumber }).then((resp: TvSeasonImagesResponse) => {
                if (resp.posters) { setSeasonImages(resp.posters); }
            });

            if (isVideoFeatureEnabled) {
                movieDbApi?.seasonVideos({ id: showId, season_number: seasonNumber }).then((resp: VideosResponse) => {
                    if (resp.results) { setSeasonVideos(resp.results); };
                });
            }
        },
        [movieDbApi, showId, seasonNumber, isVideoFeatureEnabled], // Run Only Once?
    );

    const episodesList = getTVSeasonsNavBarEpisodeItems({
        activeItemId: 'overview',
        currentDate,
        epiClickFn: epiClick,
        episodes,
        seasonNumber,
        showId,
    })

    const seasonOverview = tvShow?.seasons?.[seasonNumber]?.overview;
    const lastEpisode = season?.episodes?.at(-1);
    const statusText = getStatusText(season, currentDate, lastEpisode)

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
                <ContentContainer className="TVSeasonOverviewContent-cont">
                    <BreadCrumbSeasons showId={showId} seasonNumber={seasonNumber} seasonName={seasonName} tvShow={tvShow} />
                    {
                        isMobileView ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger style={{ background: 'none' }}>
                                    <IconWithText>
                                        <ContextContainerText_H1>Overview</ContextContainerText_H1>
                                        <ChevronDownIcon className='bouncing-element' size={24} style={{ paddingLeft: '.8rem' }} />
                                    </IconWithText>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='start' style={{ zIndex: 1 }}>
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
                            <ContextContainerText_H1>Overview</ContextContainerText_H1>
                        )
                    }

                    <div className="TVSeasonOverviewContent-overview-main-cont">
                        <div className='TVSeasonOverviewContent-overview-details-cont'>
                            <ContentContainerLabel>
                                Status: <ContentContainerLabelValue>[{statusText}]</ContentContainerLabelValue>
                            </ContentContainerLabel>

                            <ContentContainerLabel>
                                Air Date: <ContentContainerLabelValue>{season?.air_date}</ContentContainerLabelValue>
                            </ContentContainerLabel>

                            <ContentContainerLabel>
                                Episode Count: <ContentContainerLabelValue>{season?.episodes?.length || 0}</ContentContainerLabelValue>
                            </ContentContainerLabel>

                            <ContentContainerLabel>
                                Rating: <ContentContainerLabelValue>[{season?.vote_average || 0}]</ContentContainerLabelValue>
                            </ContentContainerLabel>
                            {!!seasonOverview &&
                                <ContentContainerLabel>
                                    Overview: <ContentContainerLabelValue>{seasonOverview}</ContentContainerLabelValue>
                                </ContentContainerLabel>
                            }
                        </div>
                        <div className='TVSeasonOverviewContent-overview-seasonImages-cont'>
                            <Carousel opts={{ loop: true, align: 'center' }} setApi={setApi}>
                                <CarouselContent>
                                    {
                                        (seasonImages || []).length > 0 && seasonImages
                                            .filter((image) => image.iso_639_1 === 'en')
                                            .map((image, idx, arr) => {
                                                return (
                                                    <CarouselItem className='TVSeasonOverviewContent-overview-seasonImages-img-cont'>
                                                        {image.file_path ?
                                                            <ImageLoader
                                                                src={`https://image.tmdb.org/t/p/w300${image.file_path}`}
                                                                alt={`Poster image of ${tvShow.name}`}
                                                                aspectRatio='2/3'
                                                                className='TVSeasonOverviewContent-overview-seasonImages-img'
                                                                placeholderComp={<PlaceholderPosterImageSVG className='animate-pulse TVSeasonOverviewContent-overview-seasonImages-img' />}
                                                                fallbackComp={<PlaceholderPosterImageSVG className='TVSeasonOverviewContent-overview-seasonImages-img' />}
                                                            />
                                                            : <PlaceholderPosterImageSVG className='TVSeasonOverviewContent-overview-seasonImages-img' />
                                                        }
                                                        <p>Count: {idx + 1} of {arr.length}</p>
                                                    </CarouselItem>
                                                );
                                            })
                                    }
                                </CarouselContent>
                            </Carousel>
                        </div>
                    </div>
                </ContentContainer>

                <VideosDialogListContent videos={seasonVideos} title='Season Videos' />
            </TVContentMainContainer>
        </BackgroundPageImages>
    );
}

export default TVSeasonOverviewContainer;
