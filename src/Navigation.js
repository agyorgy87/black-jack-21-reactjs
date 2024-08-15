import { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter, useNavigate } from "react-router-dom";
import StartGame from "./pages/StartGame";
import GameTable from "./pages/GameTable";
import { GameObject } from "./context/GameObject.js";


const Navigation = () => {

    const [gameData, setGameData] = useState({});

    return (
        <div>
            <GameObject.Provider value={{value:gameData, setValue:setGameData}}>
                    <Routes>
                        <Route exact path="/" element={<StartGame/>} />
                        <Route path="/game/:gameId" element={<GameTable/>} />
                    </Routes>
            </GameObject.Provider>
        </div>
    )  

}

export default Navigation;