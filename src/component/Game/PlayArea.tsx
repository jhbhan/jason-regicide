import { Button } from '@mui/material';
import React, {useContext} from 'react';
import '../../App.scss';
import { GameContext } from '../../context/gameContext';
import Deck from './Deck';

const PlayArea:React.FunctionComponent = () => {
  const gameContext = useContext(GameContext);
  const onClickDraw = () => {
    gameContext.dispatch({type: 'draw'});
  }
  return (
    <div className="play_area">
        <Deck deckType='discard' />
        <Deck deckType='tavern' />
        <Button
        onClick={() => onClickDraw()}
        variant="contained"
        color='success'>Draw</Button>
    </div>
  );
}

export default PlayArea;