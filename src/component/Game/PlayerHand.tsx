import React, { useContext } from 'react';
import '../../App.scss';
import Card from './Card';
import { GameContext } from '../../context/gameContext';
import _ from 'underscore';
import { CardDetail } from '../../type/CardDetail';

const PlayerHand:React.FunctionComponent = () => {
  const gameContext = useContext(GameContext);
  const playerHand = gameContext.gameState.playerHands;
  const currentPlayer = gameContext.gameState.currentPlayer;
  const playedCard = gameContext.gameState.activeCards;
  const handleOnClickCard = (item:number, card:CardDetail) => {
    gameContext.dispatch({type:'set_card', cardIndex: item, cardDetail: card});
  };

  const disableCard = (card: CardDetail) => {
    if(playedCard.length === 0 || gameContext.gameState.gamePhase == 'defend') {
      return false;
    }
    const values = _.pluck(playedCard, ('value'));
    if(!_.contains(values, 'A') && card.value === 'A'){
      return false;
    }

    if(_.filter(values, (item) => ['6','7','8','9','10','J','Q','K'].includes(item)).length !== 0) {
      return true;
    }
    if(!_.contains(values, card.value)){
      return true;
    }
    return false;
  };

  return (
    <div className="your_hand">
        <div className="player_label">
          Player {currentPlayer}
        </div>
        <div className="cards_in_hand">
          {playerHand && playerHand[currentPlayer-1] !== undefined &&
            playerHand[currentPlayer-1].map((item, key) => {
              return <Card disabled={disableCard(item)} onClick={() => handleOnClickCard(key, item)} key={key} index={key} cardDetail={item}/>
            })
          }
        </div>
    </div>
  );
}

export default PlayerHand;