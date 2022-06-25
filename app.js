const express = require("express");
const socketIO = require("socket.io");
const cors = require("cors");
const http = require("http");
require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (_, res) => {
  res.send("Server is up & running 💓");
});

const server = http.createServer(app);
const io = socketIO(server, {
  path: "/clock",
  cors: {
    origin: "*",
  },
});

let interval;

io.on("connection", (socket) => {
  console.log("A Client Got Connected 🔋");

  interval = setInterval(() => {
    const time = new Date();
    socket.emit("tick", {
      hours: time.getHours(),
      minutes: time.getMinutes(),
      seconds: time.getSeconds(),
    });
  }, 1000);

  socket.on("disconnect", () => {
    console.log("A Client Got Disconnected 🪫");
    clearInterval(interval);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server started on PORT ${process.env.PORT}`);
});
