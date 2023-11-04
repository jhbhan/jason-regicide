import React, { useContext } from 'react';
import '../../App.scss';
import { Button,
FormControl,
InputLabel,
Select,
MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { GameContext } from '../../context/gameContext';
import { signOut, getAuth } from 'firebase/auth';
import { db } from '../../App';
import { onSnapshot, doc } from 'firebase/firestore';

const Home:React.FunctionComponent = () => {
  const [view, setView] = React.useState('start');
  const gameContext = useContext(GameContext);
  const auth = getAuth();
  const navigate = useNavigate();

  const unsub = onSnapshot(doc(db, "cities", "SF"), (doc) => {
    const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
    console.log(source, " data: ", doc.data());
  });

  return (
    <>
    <h1 className="start-page">Regicide</h1>
      { view === 'start' &&
      <div className='menu-container'>
        <Button 
          onClick={() => setView('play')} 
          className="start-buton">
            Play
        </Button>
        <Button 
          onClick={() => setView('help')} 
          className="about-button">
            Help
        </Button>
        <Button 
          onClick={() => {
            signOut(auth);
            navigate('/login');}} 
          className="about-button">
            Sign Out
        </Button>
        </div>}
      { view === 'play' &&
      <div className='menu-container'>
      <div className="button-container">
        <Button 
          color="secondary"
          onClick={()=>setView('setup')} 
          className="newgame-button">
            New Game
        </Button>
        <Button 
          color="secondary"
          onClick={()=>setView('join-gain')} 
          className="joingame-button">
            Join Game
        </Button>
        <Button 
          color="secondary"
          onClick={()=>setView('start')} 
          className="goback-button">
            Home
        </Button>
      </div>
      </div>}
      { view === 'setup' &&
      <div className='menu-container'>
        <FormControl fullWidth>
        <InputLabel>Number of Players</InputLabel>
        <Select
          value={gameContext.gameState.numPlayer}
          label="Number of Players"
          onChange={(e) => {
            gameContext.dispatch({type:'field',
            fieldName: 'numPlayer',
            payload: e.target.value.toString()})
          }}
        >
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={4}>4</MenuItem>
        </Select>
      </FormControl>
      <div className="button-container">
        <Button 
          color="primary"
          onClick={()=>setView('start')} 
          className="start-button">
              <Link
                to={`/game`}
                >
                    Start the Game
                    </Link>
        </Button>
        <Button 
          color="secondary"
          onClick={()=>setView('start')} 
          className="goback-button">
            Home
        </Button>
      </div>
      </div>}
      { view === 'help' && 
      <div className='menu-container'>
      <Button 
        color="secondary"
        onClick={()=>setView('start')} 
        className="goback-button">
          Home
      </Button>
      </div>}
    </>
  );
}

export default Home;