import React, { useState } from 'react';
import styled from 'styled-components';
import socket from '../util';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const RowContainer = styled.div`
  width: 100%;
  display: flex;
`;

const Cell = styled.div`
  width: 13em;
  height: 9em;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  cursor: pointer;
  border: 3px solid #222831;
  transition: all 270ms ease-in-out;
  &:hover {
    background-color: #222831;
  }
`;

const PlayStopper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 99;
  cursor: default;
`;

const X = styled.span`
  font-size: 100px;
  color: #8e44ad;
  &::after {
    content: "X";
  }
`;

const O = styled.span`
  font-size: 100px;
  color: #8e44ad;
  &::after {
    content: "O";
  }
`;

function Game(props){
  const [matrix, setMatrix] = useState([
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ]);

  const {
    setInRoom,
    playerSymbol,
    setPlayerSymbol,
    setPlayerTurn,
    isPlayerTurn,
    setGameStarted,
    isGameStarted,
  } = props;

  socket.on("start_game", data =>{
    const turn = data.turn;
    const symbol = data.symbol;
    setPlayerSymbol(symbol);
    setPlayerTurn(turn);
    setGameStarted(true);
  });

  socket.on("on_game_update", gameMatrix =>{
    setMatrix(gameMatrix);
    checkGameState(gameMatrix);
    setPlayerTurn(true);
  });

  socket.on("on_game_tie", () =>{
    alert("The Game is a TIE!");
    handleGameEnd();
  });

  socket.on("other_player_won", () =>{
    alert("You Lost");
    handleGameEnd();
  });

  socket.on("the_other_player_left", () =>{
    alert("Sorry the other player left!!");
    handleGameEnd();
  })

  const checkGameState = (matrix) => {
    for (let i = 0; i < matrix.length; i++) {
      const row = [];
      for (let j = 0; j < matrix[i].length; j++) {
        row.push(matrix[i][j]);
      }

      if (row.every((value) => value && value === playerSymbol)) {
        return [true, false];
      } else if (row.every((value) => value && value !== playerSymbol)) {
        return [false, true];
      }
    }

    for (let i = 0; i < matrix.length; i++) {
      const column = [];
      for (let j = 0; j < matrix[i].length; j++) {
        column.push(matrix[j][i]);
      }

      if (column.every((value) => value && value === playerSymbol)) {
        return [true, false];
      } else if (column.every((value) => value && value !== playerSymbol)) {
        return [false, true];
      }
    }

    if (matrix[1][1]) {
      if (matrix[0][0] === matrix[1][1] && matrix[2][2] === matrix[1][1]) {
        if (matrix[1][1] === playerSymbol) return [true, false];
        else return [false, true];
      }

      if (matrix[2][0] === matrix[1][1] && matrix[0][2] === matrix[1][1]) {
        if (matrix[1][1] === playerSymbol) return [true, false];
        else return [false, true];
      }
    }

    //Check for a tie
    if (matrix.every((m) => m.every((v) => v !== null))) {
      return [true, true];
    }

    return [false, false];
  };

  function updateGameMatrix(column, row, symbol){
    const newMatrix = [...matrix];

    if (newMatrix[row][column] === null || newMatrix[row][column] === "null") {
      newMatrix[row][column] = symbol;
      setMatrix(newMatrix);
    }

    if (socket) {
      socket.emit("update_game", newMatrix);
      const [currentPlayerWon, otherPlayerWon] = checkGameState(newMatrix);
      if (currentPlayerWon && otherPlayerWon) {
        socket.emit("game_tie");
        alert("The Game is a TIE!");
        handleGameEnd();
      } else if (currentPlayerWon && !otherPlayerWon) {
        socket.emit("game_win");
        alert("You Won!");
        handleGameEnd();
      }

      setPlayerTurn(false);
    }
  }

  function handleGameEnd(){
    setPlayerTurn(false);
    setGameStarted(false);
    setInRoom(false);
  }

  return(
    <GameContainer>
    {!isGameStarted && (
      <h2>Waiting for Other Player to Join to Start the Game!</h2>
    )}
    {(!isGameStarted || !isPlayerTurn) && <PlayStopper />}
    {matrix.map((row, rowIdx) => {
      return (
        <RowContainer>
          {row.map((column, columnIdx) => (
            <Cell
              onClick={() =>
                updateGameMatrix(columnIdx, rowIdx, playerSymbol)
              }
            >
              {column && column !== "null" ? (
                column === "x" ? (
                  <X />
                ) : (
                  <O />
                )
              ) : null}
            </Cell>
          ))}
        </RowContainer>
      );
    })}
  </GameContainer>
  )

}

export default Game;