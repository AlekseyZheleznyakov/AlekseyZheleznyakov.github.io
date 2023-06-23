const http = require("http");
const express = require("express");
const morgan = require("morgan");
const { Server } = require("socket.io");

const app = express();
app.use(morgan("combined"));
app.use(express.static("."));  // analise this directory

//initialize a simple http server
const server = http.createServer(app);
const io = new Server(server);

const clients = [];

io.on("connection", (socket) => {
  clients.push(socket);
  console.log(`Client ${socket.id} is connected`);
  socket.on("MessageToServer", (msg) => {
    const replyMsg = `${socket.id}: ${msg}`;
    for (client of clients) {
      console.log(replyMsg);
      client.emit("MessageFromServer", replyMsg); 
    }
  });
  socket.on("ChangedName", (msg) => {
    const replyMsg = `${socket.id} rename to ${msg}`;
    socket.id = msg;
    for (client of clients) {
      if (client === socket) {
        continue;
      }
      client.emit("MessageOfRename", replyMsg);
    }
  });
  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} is disconacted`);
    const index = clients.indexOf(socket);
    if (index > -1) {
      clients.splice(index, 1);
    }
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${server.address().port} :)`);
});
