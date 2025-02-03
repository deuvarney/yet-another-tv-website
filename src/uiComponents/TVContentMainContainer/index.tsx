
import './styles.scss';

interface TVContentMainContainerProps {
    children: React.ReactNode;
}

export default function TVContentMainContainer(props: TVContentMainContainerProps) {
    return (
        <div className="TVContentMainContainer">
            {props.children}
        </div>
    );
}