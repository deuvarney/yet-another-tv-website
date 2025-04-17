import './styles.scss';

type MiniShowDescPropsType = {
    name: string;
}

function MiniShowDesc(props: MiniShowDescPropsType) {
    return (
        <div className="QuickShowInfo" role="dialog">
            <p>{props.name}</p>
        </div>
    );
}

export default MiniShowDesc;
