import ImageLoader from '../base/ImageLoader';
import { PlaceholderPosterImageSVG } from '../base/PlaceHolderImageSVG';
import './styles.scss';
import { Show } from '@/types/themoviedbTypes';

interface MovieImagePosterProps {
    poster_path: Show["poster_path"];
    name: Show["name"];
}

function MovieImagePoster(props: MovieImagePosterProps) {
    return props.poster_path ?
        <ImageLoader
            src={`https://image.tmdb.org/t/p/w300${props.poster_path}`}
            alt={`Poster image of ${props.name}`}
            aspectRatio='2/3'
            className='movie-image'
            placeholderComp={<PlaceholderPosterImageSVG className='animate-pulse movie-image' />}
            fallbackComp={<PlaceholderPosterImageSVG className='movie-image' />}
        />
        : <PlaceholderPosterImageSVG className='movie-image' />;
}

function MovieItem(props: Show) {
    const { id, poster_path, name, original_name, year, origin_country } = props;
    return (
        <div className="movie-item" key={id}>
            <MovieImagePoster poster_path={poster_path} name={name} />
            <p className="movie-name">{name || original_name}</p>
            <p className="movie-release-date">{`${year || ''} (${origin_country && origin_country[0]})`}</p>
            {/* <button className="info-button">
                <span className="icon-info"></span>
            </button> */}
        </div>
    );
}

export default MovieItem;
