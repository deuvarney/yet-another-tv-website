import './styles.scss';

const mainClass = `IconWithText`;

interface IconWIthTextProps {
    className?: string;
    children: React.ReactNode;
}

export default function IconWithText(props: IconWIthTextProps) {
    return (
        <div className={`${mainClass}-cont ${props.className || ''}`}>
            {props.children}
        </div>
    );
}