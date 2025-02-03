import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { ShowResponse } from '@/modules/moviedb-promise-main/dist';
import { ChevronDownIcon, Dot } from 'lucide-react';
import { Season } from '@/types/themoviedbTypes';
import IconWithText from '../IconWIthText';

// TODO: Update this logic to have this passed in as current logic is too tightly -coupled
import { Link } from 'react-router-dom';


import './styles.scss';

interface BreadCrumbSeasonProps {
    currentSeasonName: string;
    showDropdown?: boolean;
    tvShow?: ShowResponse;
    seasonNumber: number;
    showId: number | string;
}

interface BreadCrumbSeasonsProps {
    seasonName?: string;
    tvShow?: ShowResponse;
    showId: number | string;
    seasonNumber: number;
    showSeason?: boolean;
    showShowTitle?: boolean;
}

// TODO: Update interface to conditionally accept items based on whether showSeason is provided

function BreadCrumbSeason(props: BreadCrumbSeasonProps) {
    const { showDropdown, currentSeasonName } = props;
    return (

        showDropdown ?
            <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                    {currentSeasonName}
                    <ChevronDownIcon className='bouncing-element' size={14} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className='TVSeasonContainerName-Breadcrumb-Season-Dropdown'>
                    {
                        props.tvShow?.seasons?.map((season: Season, index: number) => {
                            return (
                                <DropdownMenuItem key={index} className='TVSeasonContainerName-Breadcrumb-Season-Dropdown-Item'>
                                    <IconWithText>
                                        {season.season_number === props.seasonNumber && <Dot className='TVSeasonContainerName-Breadcrumb-Season-Dropdown-Dot' />}
                                        <Link className='TVSeasonContainerName-Breadcrumb-Season-Dropdown-Link' to={`/show/${props.showId}/season/${season.season_number}`}>{season.name}</Link>
                                    </IconWithText>
                                </DropdownMenuItem>
                            )
                        })
                    }
                </DropdownMenuContent>
            </DropdownMenu>
            :
            <Link to={`/show/${props.showId}/season/${props.seasonNumber}`}>{currentSeasonName}</Link>
    );
}


export default function BreadCrumbSeasons(props: BreadCrumbSeasonsProps) {
    const showDropdown = (props.tvShow?.seasons?.length || 0) > 1;
    const currentSeasonName = props.seasonName || 'Season';
    const {showSeason = true, showShowTitle = true} = props;

    return (
        <Breadcrumb className="TVSeasonContainerName-Breadcrumb-Cont">
            <BreadcrumbList>
                {
                    !!showShowTitle && 
                    <>
                    <BreadcrumbItem className='TVSeasonContainerName-Breadcrumb TVSeasonContainerName-Breadcrumb-Home'>
                        <Link to={`/show/${props.showId}`}>{props.tvShow?.name || 'Show'}</Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    </>
                }
                
                {
                    !!showSeason && (
                        <>
                            <BreadcrumbItem className='TVSeasonContainerName-Breadcrumb TVSeasonContainerName-Breadcrumb-Season-Trigger'>
                                <BreadCrumbSeason currentSeasonName={currentSeasonName} showDropdown={showDropdown} showId={props.showId} seasonNumber={props.seasonNumber} tvShow={props.tvShow}/>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                        </>
                    )
                }

            </BreadcrumbList>
        </Breadcrumb>
    )
}