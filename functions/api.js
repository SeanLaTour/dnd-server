const express = require("express");
const serverless = require('serverless-http')
const http = require("http")
const app = express();
const { Server, Socket } = require("socket.io")
const cors = require("cors");
const router = express.Router()

app.use(cors());

const server = http.createServer();

const io = new Server(server, {
    cors: {
        origin: "*",
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

router.get("/", (req, res) => {
    res.send("Hey Sean")
})


server.listen(3000, () => {
    console.log("SERVER RUNNING 3000")
})

app.use('/.netlify/functions/api', router)
module.exports.handler = serverless(app)