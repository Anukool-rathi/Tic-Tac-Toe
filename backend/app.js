const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});

io.on('connection', (socket) => {
  console.log('a user connected :', socket.id);

  function getRoomId(){
    const roomId = Array.from(socket.rooms.values()).filter(
      (room) => room !== socket.id
    );
    return roomId;
  }

  socket.on("joinRoom", (roomId) => {
    console.log("New User joining room: ", roomId);

    const connectedSockets = io.sockets.adapter.rooms.get(roomId);
    const socketRooms = getRoomId();

    if (socketRooms.length > 0 ||
      (connectedSockets && connectedSockets.size === 2)) {
      socket.emit("room_join_error", "Room is full please choose another room to play!");
    } else {
      socket.join(roomId);
      socket.emit("room_joined");
      if(io.sockets.adapter.rooms.get(roomId).size === 2){
        socket.emit("start_game", {
          turn: true,
          symbol: "x"
        });
        socket.to(roomId).emit("start_game", {
          turn: false,
          symbol: "o"
        });
      }
    }
  });

  socket.on("update_game", gameMatrix =>{
    const roomId = getRoomId();
    socket.to(roomId).emit("on_game_update", gameMatrix);
  });

  socket.on("game_tie", () =>{
    const roomId = getRoomId();
    socket.to(roomId).emit("on_game_tie");
  });

  socket.on("game_win", () =>{
    const roomId = getRoomId();
    socket.to(roomId).emit("other_player_won");
  });

  socket.on("disconnect", () =>{
    const roomId = getRoomId();
    socket.to(roomId).emit("the_other_player_left");
  })
});

server.listen(8080, () => {
  console.log("Server is listening on port 8080");
});