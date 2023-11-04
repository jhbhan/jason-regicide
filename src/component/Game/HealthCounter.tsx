import { useContext } from "react";
import { GameContext } from "../../context/gameContext";

export interface HealthCounterProp{
    bossType: string;
}

const HealthCounter:React.FunctionComponent<HealthCounterProp> = (props) => {
    const gameContext = useContext(GameContext);

    return (
        <div className="health-counter">
        <h2>Health: {gameContext.gameState.bossHealth}</h2>
        <h2>Attack: {gameContext.gameState.bossAttack}</h2>
        </div>
    );
}

export default HealthCounter;