import {Link} from 'react-router-dom';
import './styles.scss';
import {Show} from '../../types/themoviedbTypes';

function TVNavBarListContainer(props: Show) {
    return (
        <div className="TVSeasonsNavBar">
            <ul className="TVSeasonsNavBarList">

                <li>
                    <div>{props.name}</div>
                </li>
                {
                    props.seasons.map((season) => {
                        return (
                            <li key={season.id}>
                                <Link to={`/show/${season.id}/season/${season.season_number}`}>
                                    <p className="season-name">{season.name}</p>
                                </Link>
                            </li>
                        );
                    })
                }
            </ul>
        </div>
    );
}

export default TVNavBarListContainer;
