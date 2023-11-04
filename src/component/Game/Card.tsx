import { CardDetail } from '../../type/CardDetail';
import './Card.css';
interface CardProps {
    cardDetail: CardDetail;
    cardLabel?: string;
    index?: number;
    onClick: CallableFunction;
    disabled?: boolean;
}

const Card:React.FunctionComponent<CardProps> = (props) => {
    const cardclass = props.disabled ? "card disabled" : "card";
    return (
    <div className={cardclass} onClick={
        ()=> { if(!props.disabled)
            {props.onClick(props.index)}
            }}>
        <h2 className="card-label">
            {props.cardLabel ?? props.cardDetail.value+ ' of ' + props.cardDetail.suit}
        </h2>
    </div>
    );
}

export default Card;