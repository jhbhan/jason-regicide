import React, { createContext, useReducer } from "react";
import { getTavernDeck, getBossDeck, getValue, getBossAttack, getBossHealth } from "../helper";
import _ from 'underscore';
import { GameAction, GameContextType, GameState } from "../type/GameState";
import { CardDetail } from "../type/CardDetail";

type GameContextProviderProps = {
    children: React.ReactNode;
}

export const GameContext = createContext({} as GameContextType);

const initialState: GameState = {
    tavernDeck: getTavernDeck(),
    bossDeck: getBossDeck(),
    discardPile: [],
    graveyard: [],
    activeCards: [],
    numPlayer: 2,
    currentPlayer: 1,
    gamePhase: 'attack',
    bossHealth: 20,
    bossAttack: 10
}

const initial_hand_size:Map<string, number> = new Map([
    ['2', 7],
    ['3', 6],
    ['4', 5]
]);

const reducer = (state: GameState, action: GameAction) => {
    switch (action.type) {
        case 'initialize_hand': {
            if(state.playerHands || state.tavernDeck.length !== 40) {
                return state;
            }
            else{
                const newTavernDeck:CardDetail[] = [];
                Object.assign(newTavernDeck, state.tavernDeck);

                const newPlayerHand = new Array(state.numPlayer);

                for (let i = 0; i < state.numPlayer; i++) {
                    const playerHand:CardDetail[] = [];
                    for (let j = 0; j < initial_hand_size.get(state.numPlayer.toString())! ; j++) {
                        playerHand.push(newTavernDeck.pop()!);
                    }
                    newPlayerHand[i] = playerHand;
                }

                return {
                    ...state,
                    tavernDeck: newTavernDeck,
                    playerHands: newPlayerHand
                }
            }
        }
        case 'draw': {
            let playerHands = state.playerHands;
            const currentPlayerHand = playerHands![state.currentPlayer - 1];

            if(currentPlayerHand.length === initial_hand_size.get(state.numPlayer.toString())){
                return state;
            }

            const tavernDeck:CardDetail[] = [];
            Object.assign(tavernDeck,state.tavernDeck);

            const drawnCard = tavernDeck.pop();

            if(drawnCard && currentPlayerHand[currentPlayerHand.length - 1] !== drawnCard){
                currentPlayerHand.push(drawnCard);
            }
            playerHands![state.currentPlayer - 1] = currentPlayerHand;

            return {
                ...state,
                playerHands: playerHands,
                tavernDeck: tavernDeck
            }
        }
        case 'play_card' : {
            const currentActiveCard = state.activeCards;
            const values = _.pluck(currentActiveCard, 'value').map(i => (getValue(i)));
            const valueTotal = values.reduce((s, f) => {
                                    return s + f;
                                }, 0);

            const suits = _.pluck(currentActiveCard, 'suit');
            const currentBoss = state.bossDeck[0];
            let newBossHealth = state.bossHealth;
            let newBossAttack = state.bossAttack;
            const bossDeck:CardDetail[] = [];
            Object.assign(bossDeck,state.bossDeck);
            
            let playerHands:CardDetail[][] = [];
            Object.assign(playerHands, state.playerHands);

            const tavernDeck:CardDetail[] = [];
            Object.assign(tavernDeck,state.tavernDeck);

            let newDiscardPile:CardDetail[] = [];
            Object.assign(newDiscardPile, state.discardPile);

            const nextPlayer = state.currentPlayer + 1 > state.numPlayer ? 1 : state.currentPlayer + 1;
            let newGamePhase = '';
            if(state.gamePhase === 'attack'){
                newBossHealth = newBossHealth - valueTotal;
                if(_.contains(suits, 'Diamond') && currentBoss.suit != 'Diamond'){
                    let numFullHands = 0;
                    for (let index = 0; index < valueTotal; index++) {
                        const playerIndex = (state.currentPlayer + index - 1) % state.numPlayer;
                        const drawnCard = tavernDeck.pop();
                        if(drawnCard == undefined || playerHands == undefined){
                            break;
                        }
                        const currentPlayerHand = playerHands[playerIndex];
                        if(currentPlayerHand.length >= initial_hand_size.get(state.numPlayer.toString())!){
                            numFullHands++;
                            if(numFullHands == initial_hand_size.get(state.numPlayer.toString())!){
                                break;
                            }
                            continue;
                        }
                        numFullHands = 0;
                        currentPlayerHand.push(drawnCard);
                        playerHands[playerIndex] = currentPlayerHand;
                    }
                }
                if(_.contains(suits, 'Heart') && currentBoss.suit != 'Heart'){
                    newDiscardPile = _.shuffle(newDiscardPile);
                    const renewedCards = newDiscardPile.slice(0,valueTotal);
                    if(valueTotal > newDiscardPile.length){
                        newDiscardPile = [];
                    }
                    else {
                        newDiscardPile = newDiscardPile.slice(valueTotal,newDiscardPile.length);
                    }
                    renewedCards.forEach((item) => {
                        tavernDeck.unshift(item);
                    });
                }
                if(_.contains(suits, 'Club') && currentBoss.suit != 'Club'){
                    newBossHealth = newBossHealth - valueTotal;
                }
                if(_.contains(suits, 'Spade') && currentBoss.suit != 'Spade'){
                    newBossAttack = newBossAttack - valueTotal;
                }

                if(newBossHealth <= 0){
                    if(newBossHealth == 0){
                        tavernDeck.push(currentBoss);
                    }
                    bossDeck.shift();
                    newBossHealth = getBossHealth(bossDeck[0].value);
                    newBossAttack = getBossAttack(bossDeck[0].value);
                    newGamePhase = 'attack';
                }
                else{
                    newGamePhase = 'defend';
                }
            }
            else {
                newGamePhase = 'attack';
            }

            newDiscardPile = newDiscardPile.concat(state.activeCards);

            return {
                ...state,
                gamePhase: newGamePhase,
                currentPlayer: state.gamePhase === 'attack' ? state.currentPlayer : nextPlayer,
                discardPile: newDiscardPile,
                activeCards: [],
                bossHealth: newBossHealth,
                bossAttack: newBossAttack,
                playerHands: playerHands,
                tavernDeck: tavernDeck,
                bossDeck: bossDeck
            }
        }
        case 'set_card': {
            if(action.cardIndex < -1 || state.playerHands![state.currentPlayer - 1][action.cardIndex] !== action.cardDetail){
                return state;
            }
            const currentActiveCard = state.activeCards;
            let playerHands = state.playerHands;
            const currentPlayerHand = playerHands![state.currentPlayer - 1];
            currentActiveCard?.push(action.cardDetail);
            currentPlayerHand.splice(action.cardIndex, 1);
            playerHands![state.currentPlayer - 1] = currentPlayerHand;
            
            return {
                ...state,
                activeCards: currentActiveCard,
                playerHands: playerHands
            }
        }
        case 'unset_card': {
            if(action.cardIndex < -1 || state.activeCards[action.cardIndex] !== action.cardDetail){
                return state;
            }
            const currentActiveCard = state.activeCards;
            let playerHands = state.playerHands;
            const currentPlayerHand = playerHands![state.currentPlayer - 1];
            
            currentPlayerHand.push(action.cardDetail);
            currentActiveCard.splice(action.cardIndex, 1);
            playerHands![state.currentPlayer - 1] = currentPlayerHand;
            return {
                ...state,
                activeCards: currentActiveCard,
                playerHands: playerHands
            }
        }
        case 'error': {
            return state;
        }
        case 'reset': {
            return initialState;
        }
        case 'field': {
            return {
                ...state,
                [action.fieldName]: action.payload,
            };
        }
        default:
          return state;
      }
    
}

export const GameContextProvider = ({children}: GameContextProviderProps) => {
    const [gameState, dispatch] = useReducer(reducer, initialState);
    return <GameContext.Provider value={{gameState, dispatch}}> {children}</GameContext.Provider>

}