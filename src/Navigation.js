import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import StartGame from "./pages/StartGame";
import GameTable from "./pages/GameTable";


const Navigation = () => {

    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route exact path="/" element={<StartGame/>} />
                    <Route path="/game/:gameId" element={<GameTable/>} />
                </Routes>
            </BrowserRouter>
        </div>
    )  

}

export default Navigation;