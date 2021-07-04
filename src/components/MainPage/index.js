import React, { useState } from 'react'
import './style.css';

let playerOneSelected = [];
let playerTwoSelected = [];
var count = 0;
const names = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const validMoves = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]];
let element = null;

const Index = () => {
    const [isStarted, setIsStarted] = useState(false);
    const [isPlayerOnesTurn, setIsPlayerOnesTurn] = useState(true);
    const [isPlayerOneWon, setIsPlayerOneWon] = useState(false);
    const [isPlayerTwoWon, setIsPlayerTwoWon] = useState(false);

    const restart = () => {
        count = 0;
        playerOneSelected = [];
        playerTwoSelected = [];
        setIsPlayerOneWon(false);
        setIsPlayerTwoWon(false);
        setIsStarted(true);
        setIsPlayerOnesTurn(true);
    }

    const isPlayerWon = (givenArray) => Math.max(...validMoves.map((validMove) => validMove.filter(value => givenArray.includes(`${value}`)).length)) === 3;

    const mainButton = (isRestart = false) => <button className="primary" onClick={() => isRestart ? restart() : setIsStarted(prevState => !prevState.isStarted)}>{isRestart ? "Restart" : "Start"}</button>;

    const changeTurn = (e) => {
        if (count < 9 && !(isPlayerOneWon || isPlayerTwoWon)) {
            element = e.target || e.srcElement;
            if (element.id) {
                const isAlreadyMarked = playerOneSelected.includes(element.id) || playerTwoSelected.includes(element.id);
                if (isPlayerOnesTurn && !isAlreadyMarked) {
                    playerOneSelected = [...playerOneSelected, element.id];
                    setIsPlayerOnesTurn(false);
                    setIsPlayerOneWon(isPlayerWon(playerOneSelected));
                    count++;
                } else if (!isAlreadyMarked) {
                    playerTwoSelected = [...playerTwoSelected, element.id];
                    setIsPlayerOnesTurn(true);
                    setIsPlayerTwoWon(isPlayerWon(playerTwoSelected));
                    count++;
                }    
            }
        }
    }

    if (isStarted) {
        return (
            <>
                {(isPlayerOneWon || isPlayerTwoWon) ? (
                    <h4>{`Player ${isPlayerOneWon ? "One" : "Two"} Wins`}</h4>
                ) : count === 9 ? (
                    <h4>Draw</h4>
                ) : (
                    <h4>{`Player ${isPlayerOnesTurn ? "One" : "Two"}'s Turn`}</h4>
                )}
                <div className="main">
                    {names.map((item) => (
                        <div id={item} className="cell" onClick={changeTurn}>
                            {playerOneSelected.includes(`${item}`) && <div>X</div>}
                            {playerTwoSelected.includes(`${item}`) && <div>O</div>}
                        </div>
                    ))}
                </div>
                {(isPlayerOneWon || isPlayerTwoWon || count === 9) && <div className="bottom">{mainButton(true)}</div>}
            </>
        )
    }

    return mainButton();
}

export default Index;
