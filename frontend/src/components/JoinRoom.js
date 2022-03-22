import React, { useState } from 'react';
import io from 'socket.io-client';
import { customAlphabet } from 'nanoid';

function JoinRoom() {
    const socket = io.connect("http://localhost:8080/");

    socket.on("connect", ()=>{
    console.log(socket.connected);
    });

    socket.on("room_join_error", (message) =>{
        alert(message);
    })

    const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz123456789", 10);
    const [roomName, setRoomName] = useState(nanoid());

    function handleRoomNameChange(event){
        const value = event.target.value;
        setRoomName(value);
    }

    function joinRoom(event){
        event.preventDefault();

        socket.emit("joinRoom", roomName);
    }

    const containerStyle = {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "2em"
    }

    const roomIdInputStyle = {
        height: "30px",
        width: "20em",
        fontSize: "17px",
        outline: "none",
        border: "1px solid #8e44ad",
        borderRadius: "3px",
        padding: "0 10px"
    }

    const buttonStyle = {
        outline: "none",
        backgroundColor: "#8e44ad",
        color: "#fff",
        fontSize: "17px",
        border: "2px solid transparent",
        borderRadius: "5px",
        padding: "4px 18px",
        marginTop: "1em",
        cursor: "pointer"
    }

    return(
        <form onSubmit={joinRoom}>
            <div className='Container' style={containerStyle}>
                <h4>Enter Room ID to join the game</h4>
                <input 
                    className='RoomIdInput'
                    placeholder='Room ID'
                    style={roomIdInputStyle}
                    value={roomName}
                    onChange={handleRoomNameChange}
                />
                <button 
                    className='JoinButton' 
                    style={buttonStyle}>
                    Click to Join
                </button>
            </div>
        </form>
    );
}

export default JoinRoom;