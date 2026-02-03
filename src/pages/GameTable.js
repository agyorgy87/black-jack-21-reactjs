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

    const [playerCards, setPlayerCards] = useState([]);

    const [dealerCards, setDealerCards] = useState([]);

    const [revealDealer, setRevealDealer] = useState(false);

    const [playerCurrentCardPoints, setPlayerCurrentCardPoints] = useState(0);

    const [dealerCurrentCardPoints, setDealerCurrentCardPoints] = useState(0);

    const [playerCurrentCardPointsTwentyOne, setPlayerCurrentCardPointsTwentyOne] = useState(false);

    const [turnResultText, setTurnResultText] = useState("");

    const [playerCoin, setPlayerCoin] = useState(300);

    const [coinToBet, setCoinToBet] = useState(0);


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
            const firstPlayerCard = await cardDrawing();
            const secondPlayerCard = await cardDrawing();
            setPlayerCards([firstPlayerCard, secondPlayerCard]);
        };
        initialPlayerCards();
        const totalHandPoints = handValueCouting(playerCards);
        setPlayerCurrentCardPoints(totalHandPoints);
    }, []);


    useEffect(() => {
        const totalHandPoints = handValueCouting(playerCards);
        setPlayerCurrentCardPoints(totalHandPoints);
    }, [playerCards]);


    useEffect(() => {
        if (playerCards.length === 2 && !refInitialDealerCards.current) {
            refInitialDealerCards.current = true;

            const initialDealerCards = async () => {
                const firstDealerCard = await cardDrawing();
                const secondDealerCard = await cardDrawing();
                setDealerCards([firstDealerCard, secondDealerCard]);
        };
        initialDealerCards();
        }
    }, [playerCards]);


    useEffect(() => {
        if(playerCurrentCardPoints > 21) {
            setTimeout(() => {
                turnResult(playerCurrentCardPoints, dealerCurrentCardPoints);
            }, 1000);
        }
    }, [playerCurrentCardPoints]);


    useEffect(() => {
        if(playerCurrentCardPoints > 20) {
            setPlayerCurrentCardPointsTwentyOne(true);
            stand();
        }
    }, [playerCurrentCardPoints]);
    

    const handValueCouting = (cards) => {

        let sum = 0;
        let aces = 0;

        for(let i = 0; i < cards.length; i++) {
            const card = cards[i];
            if(!card) continue;
            const cardValue = card.split("_")[1];

            if(cardValue === "A") {
                aces += 1;
                sum += 11;
            } else if(["J","Q","K"].includes(cardValue)) {
                sum += 10;
            } else {
                sum += parseInt(cardValue);
            }
        }

        while (sum > 21 && aces > 0) {
            sum -= 10;
            aces -= 1;
        }
        return sum;
    }


    const cardDrawing = async () => { 

        const objToSend = {
            deckId: deckData.value.deckResponseData.id,
            gameId: gameId
        };

        try {
            const response = await axios.post("http://localhost:8080/game/pull-unpulled-card", objToSend);
            console.log("pull-unpulled-card:", response.data.cardType);
            return response.data.cardType;
            
        } catch (error) {
            console.log("error message:", error);
        }

    };


    const hitDealerCard = async () => {

        const totalDealerPointsNow = handValueCouting(dealerCards);
        setDealerCurrentCardPoints(totalDealerPointsNow);

        if(totalDealerPointsNow >= 18){
            turnResult(playerCurrentCardPoints, dealerCurrentCardPoints);
            return;
        }
    
        let fortunaNumber = Math.floor(Math.random() * 1000000) + 1;

        const shouldDraw = totalDealerPointsNow < 17 || 
        (totalDealerPointsNow >= 17 && fortunaNumber > 777777);

        if(!shouldDraw) return;

            try {
            const newCard = await cardDrawing();
            if(!newCard) return;

            setDealerCards(prevCards => {
                const updatedCards = [...prevCards, newCard];
                const newTotal = handValueCouting(updatedCards);

                setDealerCurrentCardPoints(newTotal);

                console.log("Új kártya a dealernél: ", newCard);
                console.log("dealer pontszám: ", newTotal);

                if (newTotal >= 18) {
                    turnResult(playerCurrentCardPoints, newTotal);
                    return updatedCards;              
                }

                let fortunaNumber2 = Math.floor(Math.random() * 1000000) + 1;
                if(newTotal < 17 || (newTotal === 17 && fortunaNumber2 > 777777)) {
                    setTimeout(hitDealerCard, 2000);
                } else {
                    setTimeout(() => {
                        turnResult(playerCurrentCardPoints, newTotal);
                    }, 2000);
                }


                return updatedCards;
            });          

            } catch (error) {
            console.error("error when drawing a card: ", error);
            } 
    }         


    const hitCard = async () => {

        try {
            await new Promise(resolve => setTimeout(resolve, 2000)); 
            const newCard = await cardDrawing();

            if(!newCard) return;

            const updatedCards = [...playerCards, newCard];
            const totalHandPoints = handValueCouting(updatedCards);

            setPlayerCards(updatedCards);
            setPlayerCurrentCardPoints(totalHandPoints);

            console.log("Új kártya: ", newCard);
            console.log("Játékos pontszám: ", totalHandPoints);

            } catch (error) {
                console.error("error when drawing a card: ", error);
            }
        
    };


    const stand = () => {
        setRevealDealer(true);

        const totalDealerPoints = handValueCouting(dealerCards);
        setDealerCurrentCardPoints(totalDealerPoints);

        console.log("dealer lapok felfedve: ", dealerCards);
        console.log("dealer jelenlegi pontszám: ", totalDealerPoints);

        setTimeout(() => {
            hitDealerCard(totalDealerPoints);
        }, 1000);   
    }

    const coinClick = (coin) => {
        setCoinToBet(coin);
    }

    const betCoin = () => {
        
    }

    const turnResult = (playerCurrentCardPoints,dealerCurrentCardPoints) => {

        const gamePoints = {
            playerPoint: playerCurrentCardPoints,
            dealerPoint: dealerCurrentCardPoints
        };

        console.log("Sending to backend:", gamePoints);


        axios.post("http://localhost:8080/turn-result", gamePoints)
        .then(response => {
            setTurnResultText(response.data)})
        .catch(error => console.log("error:", error))
    }
    

    return (
        <div className="d-flex justify-content-center mt-5 game-text">
            <div>
                <div>
                    <p>Deck name: {deckData.value.deckResponseData.name}</p>
                </div>
                <div className="mb-3">
                    {dealerCards.map((card, index) => (
                        <img
                            key={index}
                            src={index === 1 && !revealDealer ? "/french_cards_png/back.png" :`/french_cards_png/${card}.png`}
                            alt={card}
                            style={{ width: "80px", marginRight: "-30px" }}
                        />
                    ))}-
                </div>
                <div className="dealer-card-points-container mb-2">
                    <div className="dealer-card-points-frame">
                        {dealerCurrentCardPoints === 0 ? "?" : dealerCurrentCardPoints}
                    </div>           
                </div>
                <div className="turn-result-text-container mb-2">
                    <p>{turnResultText}</p>
                </div>                 
                <div className="player-card-points-container mb-2">
                    <div>
                        <p className="player-card-points-frame">{playerCurrentCardPoints}</p>
                    </div>                     
                </div>
                <div className="player-cards mb-3">
                    {playerCards.map((card, index) => (
                        <img
                            key={index}
                            src={`/french_cards_png/${card}.png`}
                            alt={card}
                            style={{ width: "80px", marginRight: "-30px" }}
                        />
                    ))}
                </div>
                <div className="d-flex">
                    
                    <div>
                        <button onClick={stand} disabled={playerCurrentCardPointsTwentyOne}>
                            STAND
                        </button>                   
                    </div>   
                    <div>
                        <button>
                            DOUBLE
                        </button>
                    </div> 
                    <div>
                        <button 
                        className="hit-button" 
                        onClick={hitCard} 
                        disabled={playerCurrentCardPointsTwentyOne}>
                            HIT
                        </button>
                    </div> 
                </div>
                <div>                 
                    {/*
                    <div>
                    {betCoin === 0 ? null : <p>Bet: {betCoin}</p>}
                    </div>
                    */}
                </div>
                <div>
                    <div className="pokerchip flat" onClick={() => coinClick(10)}>10</div>
                    <div className="pokerchip flat red" onClick={() => coinClick(25)}>20</div>
                    <div className="pokerchip flat blue" onClick={() => coinClick(50)}>30</div>
                </div>
                <div className="d-flex">
                    <div className="me-3">
                        <p>{currentGameData.playerName}</p>
                    </div>
                    <div className="me-3">
                        <p>{playerCoin} coin</p>
                    </div>
                    <div>
                        <p>turn: {currentGameData.turn}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GameTable;