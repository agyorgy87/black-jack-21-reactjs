import {useState} from 'react';
import '../css/StartGame.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';
import { GameObject } from "../context/GameObject";

const StartGame = () => {

    let navigate = useNavigate();

    const gameData = useContext(GameObject);
    
    const [playerData, setPlayerData] = useState({
        playerName: "",
        turn: 0,
        cardSum: 0,
        finished: false,
    }); 

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setPlayerData({
            ...playerData,
            [id]: value
        });
    };

    const sendPlayerName = (e) => {
        e.preventDefault();
        axios.post("http://localhost:8080/api/game", playerData)
            .then(response => {
                navigate(`/game/${response.data.id}`);
                
            })
            .catch(error => {
                console.log("error message: ",error)
            })
        gameData.setValue(playerData);
    }

    return (
        <div className="start-game-container">  
            <div>   
                <div>
                    <label htmlFor="nameInput" className="form-label enter-your-name-label">Enter your name:</label>
                    <input 
                    type="text" 
                    className="form-control" 
                    id="playerName"
                    value={playerData.playerName}
                    onChange={handleInputChange}
                    />
                </div>
                <div className="d-flex justify-content-center mt-3">
                    <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={sendPlayerName}>
                        Start Game
                    </button>
                </div>
            </div>
        </div>
    );
}

export default StartGame;