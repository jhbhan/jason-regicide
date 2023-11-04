import React from 'react';
import './App.scss';
import Home from './component/Game/Home';
import Game from './component/Game/Game';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { GameContextProvider } from './context/gameContext';
import { firebaseConfig } from './firebase/firebaseConfig';
import { initializeApp } from 'firebase/app';
import AuthRoute from './component/Auth/AuthRoute';
import LoginPage from './component/Auth/Login';
import { getFirestore } from 'firebase/firestore';
import { collection, addDoc } from "firebase/firestore"; 

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const App:React.FunctionComponent = () => {
  return (
    <div className="regicide">
      <GameContextProvider>
        <Router>
          <Routes>
              <Route
                path="/"
                element={<AuthRoute>
                    <Home />
                </AuthRoute>}>
              </Route>
              <Route path="/login" element={<LoginPage />} />
            <Route path="/game" element={<Game />}></Route>
          </Routes>
        </Router>
      </GameContextProvider>
    </div>
  );
}

export default App;
