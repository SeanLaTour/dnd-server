const express = require("express");
const http = require("http")
const app = express();
const { Server, Socket } = require("socket.io")
const cors = require("cors");
const { listenerCount } = require("process");

app.use(cors());

const server = http.createServer();

const io = new Server(server, {
    cors: {
        origin: "http://localhost:8000",
        methods: ['GET', "POST"],
    }
});

io.on("connection", (socket) => {
    console.log("User Connected" + socket.id)
    socket.on("send_message", (data) => {
        console.log(data)
        socket.broadcast.emit("recieve_message", data)
    })
})


server.listen(process.env.PORT || 3000, () => {
    console.log("SERVER RUNNING 3000")
})