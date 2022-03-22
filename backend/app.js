const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
    }
});

io.on('connection', (socket) => {
    console.log('a user connected :', socket.id);

    socket.on("joinRoom", (roomId, callback) =>{
        console.log("New User joining room: ", roomId);

        const connectedSockets = io.sockets.adapter.rooms.get(roomId);
        const socketRooms = Array.from(socket.rooms.values()).filter(
        (r) => r !== socket.id
        );

        if (socketRooms.length > 0 ||
            (connectedSockets && connectedSockets.size === 2)){
                socket.emit("room_join_error", "Room is full please choose another room to play!");
        } else {
            socket.join(roomId);
        }
    });
});

server.listen(8080, () =>{
    console.log("Server is listening on port 8080");
});