import React, { useState } from 'react';
import { customAlphabet } from 'nanoid';
import styled from 'styled-components';
import socket from '../util';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 2em;
`;

const RoomIdInput = styled.input`
  height: 30px;
  width: 20em;
  font-size: 17px;
  outline: none;
  border: 1px solid #222831;
  border-radius: 3px;
  padding: 0 10px;
  background-color: #393E46;
`;

const Button = styled.button`
  outline: none;
  background-color: #222831;
  color: #fff;
  font-size: 17px;
  border: 2px solid transparent;
  border-radius: 5px;
  padding: 4px 18px;
  transition: all 230ms ease-in-out;
  margin-top: 1em;
  cursor: pointer;
  &:hover {
    background-color: transparent;
    border: 2px solid #222831;
    color: #222831;
  }
`;

function JoinRoom(props) {

  const { setInRoom } = props;

  socket.on("connect", () => {
    console.log(socket.connected);
  });

  socket.on("room_join_error", (message) => {
    setIsJoining(false);
    alert(message);
  });

  socket.on("room_joined", () => {
    setInRoom(true);
    setIsJoining(false);
  });

  const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz123456789", 10);
  const id = nanoid();

  const [roomName, setRoomName] = useState(id);
  const [isJoining, setIsJoining] = useState(false);

  function handleRoomNameChange(event) {
    const value = event.target.value;
    setRoomName(value);
  }

  function joinRoom(event) {
    event.preventDefault();
    if (!roomName || roomName.trim() === "") {
      return;
    }
    setIsJoining(true);
    socket.emit("joinRoom", roomName);
  }

  return (
    <form onSubmit={joinRoom}>
      <Container>
        <h4>Enter Room ID to join the game</h4>
        <RoomIdInput
          placeholder='Room ID'
          value={roomName}
          onChange={handleRoomNameChange}
        />
        <Button disabled={isJoining}>
          {isJoining ? "Joining" : "join"}
        </Button>
      </Container>
    </form>
  );
}

export default JoinRoom;