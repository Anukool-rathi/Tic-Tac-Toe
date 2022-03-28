import React, { useState } from 'react';
import styled from 'styled-components';
import JoinRoom from "./components/JoinRoom";
import Game from './components/Game';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1em;
`;

const WelcomeText = styled.h1`
  margin: 0;
  color: #222831;
`;

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function App() {

  const [isInRoom, setInRoom] = useState(false);
  const [playerSymbol, setPlayerSymbol] = useState("x");
  const [isPlayerTurn, setPlayerTurn] = useState(false);
  const [isGameStarted, setGameStarted] = useState(false);

  return (
    <Container>
      <WelcomeText>Welcome to Tic-Tac-Toe</WelcomeText>
      <MainContainer>
        {!isInRoom && <JoinRoom
          setInRoom={setInRoom}
        />}
        {isInRoom &&
          <Game
            setInRoom={setInRoom}
            playerSymbol={playerSymbol}
            setPlayerSymbol={setPlayerSymbol}
            isPlayerTurn={isPlayerTurn}
            setPlayerTurn={setPlayerTurn}
            isGameStarted={isGameStarted}
            setGameStarted={setGameStarted}
          />}
      </MainContainer>
    </Container>
  )
}

export default App;