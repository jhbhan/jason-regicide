import { CardDetail } from "./CardDetail";

export type GameContextType = {
    gameState: GameState;
    dispatch: React.Dispatch<GameAction>;
}

export type GameStateContainer = {
    gameState: GameState;
    id: string;
}

export type GameAction =
  | { type: 'pass_turn' | 'error' | 'reset' | 'initialize_hand' | 'draw' | 'play_card' }
  | { type: 'card_action'; card: CardDetail}
  | { type: 'field'; fieldName: string; payload: string }
  | { type: 'set_card'; cardIndex: number; cardDetail: CardDetail}
  | { type: 'unset_card'; cardIndex: number; cardDetail: CardDetail};


export interface GameState {
    tavernDeck: CardDetail[];
    bossDeck: CardDetail[];
    discardPile: CardDetail[];
    graveyard?: CardDetail[];
    activeCards: CardDetail[];
    numPlayer: 2 | 3 | 4;
    playerHands?: CardDetail[][];
    currentPlayer: number;
    gamePhase: string;
    bossHealth: number;
    bossAttack: number;
}
