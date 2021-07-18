import React, { useState } from 'react'
import './style.css';

let playerOneSelected = [];
let playerTwoSelected = [];
var count = 0;
const names = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let playerMoves = [['_', '_', '_'], ['_', '_', '_'], ['_', '_', '_']];
let element = null;
const player = 'X', opponent = 'O';

class Move {
    constructor() {
        let row, col;
    }
}

const TicTacToe = () => {
    const [isStarted, setIsStarted] = useState(false);
    const [isSinglePlayer, setIsSinglePlayer] = useState(true);
    const [giveChoice, setGiveChoice] = useState(false);
    const [isPlayerOnesTurn, setIsPlayerOnesTurn] = useState(true);
    const [isPlayerOneWon, setIsPlayerOneWon] = useState(false);
    const [isPlayerTwoWon, setIsPlayerTwoWon] = useState(false);

    const restart = () => {
        count = 0;
        playerMoves = [['_', '_', '_'], ['_', '_', '_'], ['_', '_', '_']];
        playerOneSelected = [];
        playerTwoSelected = [];
        setIsPlayerOneWon(false);
        setIsPlayerTwoWon(false);
        setIsPlayerOnesTurn(true);
        setIsSinglePlayer(false);
        setIsStarted(false);
    }

    const mainButton = (isRestart = false) => (
        <button 
            className="primary" 
            onClick={() => { 
                if (isRestart) { 
                    restart();
                }
                setGiveChoice(true);
            }}
        >
            {isRestart ? "Restart" : "Start"}
        </button>
    );

    const automateNextMove = () => {
        var newMove = findBestMove(playerMoves);
        setTimeout(() => {
            if (count < 9) {
                playerMoves[newMove.row][newMove.col] = player;
                playerTwoSelected = [...playerTwoSelected, `${newMove.row * 3 + newMove.col + 1}`];
                setIsPlayerOnesTurn(true);
                setIsPlayerTwoWon(evaluate(playerMoves) === 10);    
                count++;
            }
        }, 750);
    }

    const markPosition = (position) => {
        const playerPosition = Number(element.id) - 1;
        const row = parseInt(playerPosition / 3, 10);
        playerMoves[row][playerPosition - 3 * row] = position;
    }

    const changeTurn = (e) => {
        if (count < 9 && !(isPlayerOneWon || isPlayerTwoWon)) {
            element = e.target || e.srcElement;
            if (element.id) {
                const isAlreadyMarked = playerOneSelected.includes(element.id) || playerTwoSelected.includes(element.id);
                if (isPlayerOnesTurn && !isAlreadyMarked) {
                    markPosition(opponent);
                    playerOneSelected = [...playerOneSelected, element.id];
                    setIsPlayerOnesTurn(false);
                    setIsPlayerOneWon(evaluate(playerMoves) === -10);
                    if (isSinglePlayer) {
                        automateNextMove();
                    }
                    count++;
                } else if (!isAlreadyMarked) {
                    markPosition(player);
                    playerTwoSelected = [...playerTwoSelected, element.id];
                    setIsPlayerOnesTurn(true);
                    setIsPlayerTwoWon(evaluate(playerMoves) === 10);
                    count++;
                }
            }
        }
    }
    
    function isMovesLeft(board) {
        for(let i = 0; i < 3; i++)
            for(let j = 0; j < 3; j++)
                if (board[i][j] === '_')
                    return true;
                    
        return false;
    }

    function evaluate(b) {
        for(let row = 0; row < 3; row++) {
            if (b[row][0] === b[row][1] &&
                b[row][1] === b[row][2]) {
                if (b[row][0] === player)
                    return +10;
                    
                else if (b[row][0] === opponent)
                    return -10;
            }
        }
    
        for(let col = 0; col < 3; col++) {
            if (b[0][col] === b[1][col] &&
                b[1][col] === b[2][col]) {
                if (b[0][col] === player)
                    return +10;
    
                else if (b[0][col] === opponent)
                    return -10;
            }
        }
    
        if (b[0][0] === b[1][1] && b[1][1] === b[2][2]) {
            if (b[0][0] === player)
                return +10;
                
            else if (b[0][0] === opponent)
                return -10;
        }
    
        if (b[0][2] === b[1][1] &&
            b[1][1] === b[2][0]) {
            if (b[0][2] === player)
                return +10;
                
            else if (b[0][2] === opponent)
                return -10;
        }
    
        return 0;
    }

    function minimax(board, depth, isMax) {
        let score = evaluate(board);

        if (score === 10 || score === -10) {
            return score;
        }

        if (!isMovesLeft(board)) {
            return 0;
        }

        if (isMax) {
            let best = -1000;

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i][j] === '_') {
                        board[i][j] = player;
                        best = Math.max(best, minimax(board, depth + 1, !isMax));
                        board[i][j] = '_';
                    }
                }
            }

            return best - depth;
        } else {
            let best = 1000;

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i][j] === '_') {
                        board[i][j] = opponent;
                        best = Math.min(best, minimax(board, depth + 1, !isMax));
                        board[i][j] = '_';
                    }
                }
            }

            return best + depth;
        }
    }

    function findBestMove(board) {
        let bestVal = -1000;
        let bestMove = new Move();
        bestMove.row = -1;
        bestMove.col = -1;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === '_') {
                    board[i][j] = player;

                    let val = minimax(board, 0, false);

                    if (val > bestVal) {
                        bestVal = val;
                        bestMove.row = i;
                        bestMove.col = j;
                    }

                    board[i][j] = '_';
                }
            }
        }

        return bestMove;
    }

    if (isStarted) {
        return (
            <>
                {(isPlayerOneWon || isPlayerTwoWon) ? (
                    <h4>{`${isPlayerOneWon ? "Player One" : isSinglePlayer ? "Computer" : "Player Two"} Wins`}</h4>
                ) : count === 9 ? (
                    <h4>Draw</h4>
                ) : (
                    <h4>{`${isPlayerOnesTurn ? "Player One" : isSinglePlayer ? "Computer" : "Player Two"}'s Turn`}</h4>
                )}
                <div className="main">
                    {names.map((item) => (
                        <div key={item} id={item} className="cell playerMark" onClick={changeTurn}>
                            {playerOneSelected.includes(`${item}`) && <div>X</div>}
                            {playerTwoSelected.includes(`${item}`) && <div>O</div>}
                        </div>
                    ))}
                </div>
                {(isPlayerOneWon || isPlayerTwoWon || count === 9) && <div className="bottom">{mainButton(true)}</div>}
            </>
        )
    }

    if (giveChoice) {
        return (
            <div className="giveChoice">
                <button 
                    className="primary" 
                    onClick={() => { 
                        setIsSinglePlayer(true); 
                        setIsStarted(true); 
                        setGiveChoice(false); 
                    }}
                >
                    Single Player
                </button>

                <div>Or</div>

                <button
                    className="primary" 
                    onClick={() => { 
                        setIsStarted(true);
                        setGiveChoice(false);
                    }}
                >
                    Multi Player
                </button>
            </div>
        )
    }

    return mainButton();
}

export default TicTacToe;
