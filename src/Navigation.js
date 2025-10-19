import { useState} from "react";
import { Routes, Route } from "react-router-dom";
import StartGame from "./pages/StartGame";
import GameTable from "./pages/GameTable";
import { GameObject } from "./context/GameObject.js";
import { DeckObject } from "./context/DeckObject.js";


const Navigation = () => {

    const [deckData, setDeckData] = useState({});

    const [gameData, setGameData] = useState({});

    return (
        <div>
            <DeckObject.Provider value={{value:deckData, setValue:setDeckData}}>
            <GameObject.Provider value={{value:gameData, setValue:setGameData}}>
                    <Routes>
                        <Route exact path="/" element={<StartGame/>} />
                        <Route path="/game/:gameId/:deckId" element={<GameTable/>} />
                    </Routes>
            </GameObject.Provider>
            </DeckObject.Provider>
        </div>
    )  

}

export default Navigation;