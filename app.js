var express = require("express");
var app = express();
var server = require("http").Server(app);
var port = process.env.PORT || 5000;

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/client/index.html")
});
app.use("/client", express.static(__dirname + "/client"));
server.listen(port);

console.log("Server started on port " + port + "!");

var Player = function (id) {
  var self = {
    x:250,
    y:250,
    id:id,
    czyD: false,
    czyA: false,
    czyW: false,
    czyS: false,
    speed:5
  };
  return self;
}

var io = require("socket.io")(server, {});
var socketList = {};
var playerList = {};

io.sockets.on("connection", function (socket) {
 console.log("Socket connection!");
 socket.id = Math.random();
 socketList[socket.id] = socket;

 var player = Player(socket.id);
 playerList(socket.id) = player;

 logIleOnline();

 socket.on("disconnect", function () {
   delete socketList[socket.id];
   delete playerList[socket.id];
   logIleOnline();
 });

 socket.on("keypress", function (data) {
   player.czyD = data.keys[68];
   player.czyA = data.keys[65];
   player.czyW = data.keys[87];
   player.czyS = data.keys[83];
   console.log(player);
 });
});

function logIleOnline () {
  var ileOnline = 0;
  for (var i in socketList) {
    ileOnline++;
  }
  for (var i in socketList) {
    var socket = socketList[i];
    socket.emit("ileOnline", {ile: ileOnline});
  }
  console.log("Online:" + ileOnline);
}
