import { useContext } from "react";
import Card from './Card';
import HealthCounter from "./HealthCounter";
import { GameContext } from "../../context/gameContext";
import { CardDetail } from "../../type/CardDetail";

export interface DeckProps{
    deckType: 'tavern' | 'boss' | 'discard';
    className?:string;
}

const Deck:React.FunctionComponent<DeckProps> = (props) => {
    const gameContext = useContext(GameContext);
    let cardList:CardDetail[] = [];
    switch (props.deckType) {
        case 'boss':
            cardList = gameContext.gameState.bossDeck;
            break;
        case 'tavern':
            cardList = gameContext.gameState.tavernDeck;
            break;
        case 'discard':
            cardList = gameContext.gameState.discardPile;
    };

    return (
        <div className={props.className}>
        {props.deckType === 'boss' &&
        <>
            <Card cardDetail={cardList[0]} onClick={() => {}}/>
            <HealthCounter bossType='J'/>
        </>
        }
        {props.deckType === 'tavern' &&
        <>
            <Card onClick={()=>{}} cardDetail={cardList[0]} cardLabel={cardList.length.toString()}/>
        </>
        }
        {props.deckType === 'discard' &&
        <>
            <Card onClick={()=>{}} cardDetail={cardList[0]} cardLabel={cardList.length.toString()}/>
        </>
        }
        </div>
    );
}

export default Deck;