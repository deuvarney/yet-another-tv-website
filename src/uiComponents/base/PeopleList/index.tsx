import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import type { CreatedBy, Crew, GuestStar } from '@/types/themoviedbTypes';
import './styles.scss';
import PersonSVG from '../PlaceholderPersonSVG';
import ImageLoader from '../ImageLoader';

// TODO: Move to centralized location
function getProfileImageJSX(personItem: CreatedBy | GuestStar | Crew) {
    return personItem.profile_path ?
        <ImageLoader
            src={`https://image.tmdb.org/t/p/w200${personItem.profile_path}`}
            alt={`Headshot of ${personItem.name}`}
            className='PeopleList-createdBy-image'
        />
        : <PersonSVG className='PeopleList-createdBy-image'/>;
}

interface PeopleListProps {
    peopleList: CreatedBy[] | GuestStar[] | Crew[];
    title: string;
    showCharacter?: boolean;
    showJob?: boolean;
}

export function PeopleCarousel(props: PeopleListProps) {
    return (
        <div className="PeopleList-createdBy">
            <div className="PeopleList-createdBy-label">{props.title}</div>
            <Carousel opts={{dragFree: false, skipSnaps: true}}>
                <CarouselContent >
                    {
                        props.peopleList.map((personItem) => {
                            return (
                                <CarouselItem className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 2xl:basis-1/6 text-center">
                                    <div key={personItem.id} className='PeopleList-createdBy-item flex aspect-square items-center justify-center p-6'>
                                        {getProfileImageJSX(personItem)}
                                        <p className='PeopleList-createdBy-name'>{personItem.name}</p>

                                        {
                                            props.showCharacter &&
                                            (personItem as GuestStar).character &&
                                            <p className='PeopleList-createdBy-detail'>{(personItem as GuestStar).character}</p>
                                        }

                                        {
                                            props.showJob &&
                                            (personItem as Crew).job &&
                                            <p className='PeopleList-createdBy-detail'>{(personItem as Crew).job}</p>
                                        }

                                    </div>
                                </CarouselItem>


                            );
                        })

                    }
                </CarouselContent>
                <CarouselPrevious className='text-accent-foreground left-0 h-full animate-in fade-in-0 transition opacity-100 transform translate-x-0 disabled:opacity-0 disabled:-translate-x-4 duration-500' />
                <CarouselNext className='text-accent-foreground right-0 h-full animate-in fade-in-0 transition opacity-100 transform translate-x-0 disabled:opacity-0 disabled:translate-x-4 duration-500' />
            </Carousel>

        </div>
    );
}

export default function PeopleList(props: PeopleListProps) {
    const { peopleList } = props;
    if (!peopleList.length) {
        return null;
    }

    return (
        // TODO: Create a stylesheet
        <div className="PeopleList-createdBy">
            <div className="PeopleList-createdBy-label">{props.title}</div>
            {
                peopleList.map((personItem) => {
                    return (
                        <div key={personItem.id} className='PeopleList-createdBy-item'>
                            {getProfileImageJSX(personItem)}
                            <p className='PeopleList-createdBy-name'>{personItem.name}</p>

                            {
                                props.showCharacter &&
                                (personItem as GuestStar).character &&
                                <p className='PeopleList-createdBy-detail'>{(personItem as GuestStar).character}</p>
                            }

                            {
                                props.showJob &&
                                (personItem as Crew).job &&
                                <p className='PeopleList-createdBy-detail'>{(personItem as Crew).job}</p>
                            }

                        </div>
                    );
                })

            }

        </div>
    );
}
