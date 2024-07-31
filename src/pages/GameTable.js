import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import '../css/GameTable.css';
import axios from 'axios';

const GameTable = () => {

    let { gameId } = useParams();

    const [playerData, setPlayerData] = useState([]);

    useEffect(() => {
        console.log(playerData);
        axios.get(`http://localhost:8080/get-game-id/${gameId}`)
            .then(response => {
                console.log(playerData);
                setPlayerData(response.data)
            })
            .catch(error => {
                console.log("error message: ",error)
            })
    },[gameId])
    
    return (
        <div className="d-flex justify-content-center mt-5 game-text">
            <div>
                <div>
                    <p>player Name: {playerData.playerName}</p>
                </div>
                <div>
                    <p>card sum: {playerData.cardSum}</p>
                </div>
                <div>
                    <p>turn: {playerData.turn}</p>
                </div>
                <div>
                    <button>START</button>
                </div>
            </div>
        </div>
    )
}

export default GameTable;