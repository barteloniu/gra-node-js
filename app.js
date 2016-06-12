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
  self.updatePos = function () {
    if(self.czyD)self.x+= self.speed;
    if(self.czyA)self.x-= self.speed;
    if(self.czyS)self.y+= self.speed;
    if(self.czyW)self.y-= self.speed;
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
 playerList[socket.id] = player;

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
 });
});

function logIleOnline () {
  var ileOnline = 0;
  for (var i in socketList) {
    ileOnline++;
  }
  for (var i in socketList) {
    var socket = socketList[i];
    socket.emit("ileOnline", ileOnline);
  }
  console.log("Online:" + ileOnline);
}

setInterval(function () {
  var pack = [];
  for(var i in playerList){
    var player = playerList[i];
    player.updatePos();
    pack.push({x: player.x, y:player.y});
  }
  for (var i in socketList) {
    var socket = socketList[i];
    socket.emit("newPos", pack);
  }
}, 1000/30);
