const express = require("express");
const http = require("http")
const app = express();
const { Server, Socket } = require("socket.io")
const cors = require("cors");
const fs = require('fs');
const path = require('path');
const dbFilePath = path.join(__dirname, 'database.json');

app.use(cors());
app.use(express.json()); // For JSON
app.use(express.text()); // For plain text

app.get("/map", (req, res) => {
    const data = readDatabase();
    res.send(data)
})

app.post("/map", (req, res) => {
    let data = readDatabase();
    const map = req.body
    data.map = map
    writeDatabase(data);
    res.send(200)
})

app.get("/map-list", (req, res) => {
    const data = readDatabase();
    res.send(data)
})

app.post("/map-list", (req, res) => {
    let data = readDatabase();
    const mapList = req.body
    data.mapList.push(mapList)
    writeDatabase(data);
    res.send(200)
})

app.get("/characters", (req, res) => {
    const data = readDatabase();
    res.send(data)
})

app.post("/characters", (req, res) => {
    let data = readDatabase();
    const characters = req.body

    if(typeof data !== "object") {
        data = {characters: characters}
    }
    else {
        data.characters = characters
    }

    writeDatabase(data);
    res.send(200)
})

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ['GET', "POST"],
    }
});

io.on("connection", (socket) => {
    console.log("User Connected" + socket.id)
    socket.on("send_message", (data) => {
        console.log("connected")
        socket.broadcast.emit("recieve_message", data)
    })
    socket.on("load_map", (data) => {
        console.log("connected")
        socket.broadcast.emit("get_loaded_map", data)
    })
})

server.listen(process.env.PORT || 3000, () => {
    console.log("SERVER RUNNING 3000")
})

function readDatabase() {
  try {
    const data = fs.readFileSync(dbFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}
  
function writeDatabase(data) {
  fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf8');
}