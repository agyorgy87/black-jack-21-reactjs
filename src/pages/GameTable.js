import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import '../css/GameTable.css';
import axios from 'axios';
import { useContext } from 'react';
import { GameObject } from "../context/GameObject";
import { DeckObject } from '../context/DeckObject';
import { useNavigate } from "react-router-dom";

const GameTable = () => {

    let navigate = useNavigate();

    let { gameId } = useParams();

    const gameData = useContext(GameObject); 

    const deckData = useContext(DeckObject);

    const [currentGameData, setCurrentGameData] = useState(gameData);
    //const [currentDeckData, setCurrentDeckData] = useState(deckData);
    const [sum, setSum] = useState(); // ezt kell majd megjelenitenem a sum részen
    const [enemyCard, setEnemyCard] = useState(0);

    /*
    useEffect(() => {
        console.log(playerData);
        axios.get(`http://localhost:8080/get-game-id/${gameId}`)
            .then(response => {
                //console.log(playerData);
                setPlayerData(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.log("error message: ",error);
            })
    },[gameId])
    */
    

    useEffect(() => {
        axios.get(`http://localhost:8080/get-game-id/${gameId}`)
            .then(response => {
                setCurrentGameData(response.data);
            })
            .catch(error => {
                if (error.response && error.response.status === 404) {
                    navigate("/");
                } else {
                    console.log("error message: ", error);
                }
            });
            console.log("useeff deck data:",deckData);
    }, [gameId]);


const hitCard = () => {
  const currentDeckId = deckData.value.deckResponseData.id;
  const currentGameId = gameId;

  const objToSend = {
    deckId: currentDeckId,
    gameId: currentGameId
  };

  axios.post("http://localhost:8080/game/pull-unpulled-card", objToSend)
    .then(response => {
      setCurrentGameData(response.data);
      console.log("pull-unpulled-card:", response.data.cardType);
    })
    .catch(error => {
      console.log("error message:", error);
    });
};

    const showEnemyCard = () => {
        axios.get(`http://localhost:8080/show-cards/${gameId}`)
        .then(response => {
            setEnemyCard(response.data);
            console.log(response.data);
        })
        .catch(error => {
            console.log("error message: ",error);
        })
        console.log(currentGameData);
    }
    
    return (
        <div className="d-flex justify-content-center mt-5 game-text">
            <div>
                <div>
                    {/*<p>deck name: {deckData.value.name}</p>*/}
                    <p>deck name: {deckData.value.deckResponseData.name}</p>
                </div>
                <div>
                    <p>player Name: {currentGameData.playerName}</p>
                </div>
                <div>
                    <p>card sum: {currentGameData.cardSum}</p> <p>enemy card: {enemyCard.enemyCardSum}</p>
                </div>
                <div>
                    <p>turn: {currentGameData.turn}</p>
                </div>
                <div>
                    <button onClick={hitCard}>
                        HIT
                    </button>
                </div>
                <div>
                    <button onClick={showEnemyCard}>
                        SHOW
                    </button>
                </div>
            </div>
        </div>
    )
}

export default GameTable;