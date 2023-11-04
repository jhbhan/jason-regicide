import React, { useEffect, useContext } from 'react';
import '../../App.scss';
import 
{useNavigate}
from 'react-router-dom';
import { GameContext } from '../../context/gameContext';
import Deck from './Deck';
import Card from './Card';
import PlayerHand from './PlayerHand';
import PlayArea from './PlayArea';
import { Button, ButtonGroup } from '@mui/material';
import { CardDetail } from '../../type/CardDetail';

const Game:React.FunctionComponent = () => {
    const navigate = useNavigate();
    const gameContext = useContext(GameContext);
    const cardsPlayed = gameContext.gameState.activeCards;

    useEffect(() => {
        if(!gameContext.gameState.numPlayer){
            navigate('/');
        }
    });

    useEffect(() => {
        if(gameContext.gameState.playerHands == null){
          gameContext.dispatch({type: 'initialize_hand'});
        }
    }, []);

    const handleOnClickActiveCard = (item:number, card:CardDetail) => {
      gameContext.dispatch({type:'unset_card', cardIndex: item, cardDetail: card});
    };

    return (
      <div className="game">
          <header className="game_header">Regicide: {gameContext.gameState.numPlayer} Players</header>
          <div className="middle_section">
            <div className="boss_section">
              <Deck deckType='boss' className='boss_deck_area' />
            </div>
            <div className="play_section">
              <ButtonGroup className='play_button' variant="contained" aria-label="outlined primary button group">
                <Button onClick={() => gameContext.dispatch({type: 'play_card'})}>{gameContext.gameState.gamePhase}</Button>
              </ButtonGroup>
              <div className="cards_played">
                {cardsPlayed &&
                  cardsPlayed.map((item, key) => {
                    return <Card onClick={() => handleOnClickActiveCard(key, item)} key={key} index={key} cardDetail={item}/>
                  })
                }
              </div>
            </div>
            <div className="draw_section">
              <PlayArea />
            </div>
          </div>
          <div className="player_zone">
            <PlayerHand />
          </div>
      </div>
    );
}

export default Game;