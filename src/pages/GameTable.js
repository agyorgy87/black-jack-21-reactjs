import React, { useEffect, useState, useRef } from 'react';
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

    const refInitialPlayerCards = useRef(false);

    const refInitialDealerCards = useRef(false);

    const [currentGameData, setCurrentGameData] = useState(gameData);

    const [enemyCard, setEnemyCard] = useState(0);

    const [playerCards, setPlayerCards] = useState([]);

    const [dealerCards, setDealerCards] = useState([]);
    

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
    }, [gameId]);

    

    useEffect(() => {
        if (refInitialPlayerCards.current) return; 
        refInitialPlayerCards.current = true;

        const initialPlayerCards = async () => {
            const firstPlayerCard = await hitCard();
            const secondPlayerCard = await hitCard();
            setPlayerCards([firstPlayerCard, secondPlayerCard]);
        };
        initialPlayerCards();
    }, []);


    useEffect(() => {
        if (playerCards.length === 2 && !refInitialDealerCards.current) {
            refInitialDealerCards.current = true;

            const initialDealerCards = async () => {
                const firstDealerCard = await hitCard();
                const secondDealerCard = await hitCard();
                setDealerCards([firstDealerCard, secondDealerCard]);
        };
        initialDealerCards();
        }
    }, [playerCards]);



/*
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
        })
        .catch(error => {
            console.log("error message: ",error);
        })
    }
*/

const hitCard = async () => {
  const objToSend = {
    deckId: deckData.value.deckResponseData.id,
    gameId: gameId
  };

  try {
    const response = await axios.post("http://localhost:8080/game/pull-unpulled-card", objToSend);
    //setCurrentGameData(response.data);
    console.log("pull-unpulled-card:", response.data.cardType);
    return response.data.cardType;
  } catch (error) {
    console.log("error message:", error);
  }
};


    return (
        <div className="d-flex justify-content-center mt-5 game-text">
            <div>
                <div>
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
                {/*
                    <button onClick={showEnemyCard}>
                        SHOW
                    </button>
                    */}
                </div>
                <div className="dealer-cards">
                    {dealerCards.map((card, index) => (
                        <img
                            key={index}
                            src={`/french_cards_imgs/${card}.png`}
                            alt={card}
                            style={{ width: "80px", marginRight: "5px" }}
                        />
                    ))}
                </div>
                <div className="player-cards">
                    {playerCards.map((card, index) => (
                        <img
                            key={index}
                            src={`/french_cards_imgs/${card}.png`}
                            alt={card}
                            style={{ width: "80px", marginRight: "5px" }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default GameTable;