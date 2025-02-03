import { Episode, Season } from "@/types/themoviedbTypes";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import BreadCrumbSeasons from "../base/BreadcrumbSeasons";
import ContentContainer from "../base/ContentContainer";
import IconWithText from "../base/IconWIthText";

import './styles.scss';
import PlaceholderImageSVG from "../base/PlaceHolderImageSVG";


function getProfileImageJSX(episode: Episode) {
    return episode.still_path ?
        <img 
            className='RecentEpisodeTabContent-image'
            src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
            alt={episode.name}
        />
        : <PlaceholderImageSVG className='RecentEpisodeTabContent-image'/>;
}



interface RecentEpisodeTabContentProps {
    episode: Episode;
    seasonName?: string;
    seasonNumber?: number;
    showId: number | string;
}

function RecentEpisodeTabContent(props: RecentEpisodeTabContentProps) {
    const { episode, seasonName, seasonNumber = 1, showId } = props;
    return (
        <div className='RecentEpisodeTabContent'>
            {/* <Link to={`/show/${showId}/season/${seasonNumber}`}><p>{seasonName}</p></Link> */}
            <BreadCrumbSeasons showShowTitle={false} showId={showId} seasonNumber={seasonNumber} seasonName={seasonName} />
            <Link to={`/show/${showId}/season/${seasonNumber}/episode/${episode.episode_number}`}>
                <p className='RecentEpisodeTabContent-name'>{episode.name}</p>
                <IconWithText>
                    <CalendarDays size={18} />
                    <p className='RecentEpisodeTabContent-date'>{episode.air_date}</p>
                </IconWithText>
                <div className='RecentEpisodeTabContent-mainCont'>
                    {getProfileImageJSX(episode)}
                    <p className='RecentEpisodeTabContent-overview'>{episode.overview}</p>
                </div>
            </Link>
        </div>
    );
}

interface RecentEpisodesTabsProps {
    lastAired?: Episode;
    lastToAirSeason?: Season;
    nextToAir?: Episode;
    nextToAirSeason?: Season;
    showId: number;
  }

export default function RecentEpisodesTabs(props: RecentEpisodesTabsProps){
    const {lastAired, lastToAirSeason, nextToAir, nextToAirSeason, showId} = props;

    if(!lastAired && !nextToAir){return null;}

    return (
        <ContentContainer className='RecentEpisodesTabs-cont'>
            <Tabs defaultValue={nextToAir ? "next" : "last"}>
                <TabsList className="grid w-full grid-cols-2 rounded-b-none RecentEpisodesTabs-triggers">
                    {!!lastAired && <TabsTrigger className="RecentEpisodesTabs-trigger" value="last" tabIndex={0}>Previous Episode</TabsTrigger>}
                    {!!nextToAir && <TabsTrigger className='RecentEpisodesTabs-trigger' value="next" tabIndex={0}>Next Episode</TabsTrigger>}
                </TabsList>

                { !!lastAired && 
                    <TabsContent value="last">
                        <RecentEpisodeTabContent episode={lastAired} seasonName={lastToAirSeason?.name} seasonNumber={lastToAirSeason?.season_number} showId={showId} />
                    </TabsContent>
                }
                { !!nextToAir && 
                    <TabsContent value="next">
                        <RecentEpisodeTabContent episode={nextToAir} seasonName={nextToAirSeason?.name} seasonNumber={nextToAirSeason?.season_number} showId={showId} />
                    </TabsContent>
                }
            </Tabs>
        </ContentContainer>
    );
}