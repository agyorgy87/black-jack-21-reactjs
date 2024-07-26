import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import StartGame from "./pages/StartGame";


const Navigation = () => {

    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<StartGame/>} />
                </Routes>
            </BrowserRouter>
        </div>
    )  

}

export default Navigation;