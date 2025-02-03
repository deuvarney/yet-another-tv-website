import './styles.scss';
import {Show} from '@/types/themoviedbTypes';

function MovieItem(props: Show) {
    const {id, poster_path, name, original_name, year, origin_country} = props;
    return (
        <div className="movie-item" key={id}>
            <img className="movie-image" alt="name" src={ (poster_path && `https://image.tmdb.org/t/p/w200${poster_path}`) || 'https://via.placeholder.com/150x250'}/>
            <p className="movie-name">{name || original_name}</p>
            <p className="movie-release-date">{`${year || ''} (${origin_country && origin_country[0]})`}</p>
            {/* <button className="info-button">
                <span className="icon-info"></span>
            </button> */}
        </div>
    );
}

export default MovieItem;
