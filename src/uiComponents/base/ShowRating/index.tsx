
interface ShowRatingProps {
    className?: string;
    rating: number;
}
export default function ShowRating(props: ShowRatingProps) {
    return (
        <p className={props.className || ''}>{props.rating}/10</p>
    );
}
