import React, { useEffect } from 'react';
import { useParams } from "react-router-dom";
import '../css/GameTable.css';
import axios from 'axios';

const GameTable = () => {

    let { playerNickName } = useParams();

    const [playerData, setPlayerData] = ([]);

    useEffect(() => {
        axios.get(`http://localhost:8080/get-player-data/${playerNickName}`)
            .then(response => {
                setPlayerData(response.data)
            })
            .catch(error => {
                console.log("error message: ",error)
            })
        console.log("ez a player data: " + playerData);
    },[])

    return (
        <div className="d-flex justify-content-center mt-5 game-text">
            <div>
                <div>
                    <p >player Name:</p>
                </div>
                <div>
                    <p>card sum:</p>
                </div>
                <div>
                    <p>turn:</p>
                </div>
                <div>
                    <button>START</button>
                </div>
            </div>
        </div>
    )
}

export default GameTable;