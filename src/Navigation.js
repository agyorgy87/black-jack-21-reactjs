import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import StartGame from "./pages/StartGame";
import GameTable from "./pages/GameTable";


const Navigation = () => {

    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<StartGame/>} />
                    <Route path="/game/:player-name" element={<GameTable/>} />
                </Routes>
            </BrowserRouter>
        </div>
    )  

}

export default Navigation;