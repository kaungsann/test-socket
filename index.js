require("dotenv").config();

const express = require("express");
const path = require("path");
const app = express();
const hogan = require("hogan-express");

const server = require("http").createServer(app);
const io = require("socket.io")(server);
app.use(express.json());
app.engine("html", hogan);
app.set("view engine", "html");
app.use(express.static(path.join(__dirname, "assets")));

app.get("/", (req, res) => {
  res.render("index");
});

let userMap = new Map();
let room1 = "private";
let room2 = "public";

let group = io.of("/group");
let mapSocket = io.of("/map");

group.on("connection", (socket) => {
  socket.on("sendGroup", (data) => {
    io.emit("resendgroup", socket.username + ": " + data);
  });
});

mapSocket.on("connection", (socket) => {
  socket.on("sendMap", (data) => {
    console.log(data);
  });
});

io.sockets.on("connection", (socket) => {
  socket.on("login", (data) => {
    console.log("user send data", data);
    socket.username = data;
    socket.emit("login-success", true);
    // userMap.set(socket.username, socket.id);
    // if (socket.username === "w" || socket.username === "x") {
    //   socket.join(room1);
    //   socket.emit("login-success", true);
    // } else {
    //   socket.join(room2);
    // }
    //  io.sockets.connected(socket.id).emit("login-success", true);
  });
  socket.on("sendMsg", (data) => {
    io.emit("resend", socket.username + " : " + data);
    // io.sockets.connected[socket.id].emit(
    // "resend",
    //  data + " : " + socket.username
    // );
    // io.emit("resend", data + " : " + socket.username);
    // socket.emit("resend", data + " : " + socket.username);
    //io.emit("resend", socket.username + ": " + data);
    // io.in(room1).emit("resend", socket.username + ": " + data);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`server running on port 3000`);
});
