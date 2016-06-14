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
    speedX:0,
    speedY:0,
    color: "#000",
    nick:""
  };
  self.updatePos = function () {

    self.speedX*= 0.97;
    self.speedY*= 0.97;

    if(self.czyD)self.speedX+= 0.2;
    if(self.czyA)self.speedX-= 0.2;
    if(self.czyS)self.speedY+= 0.2;
    if(self.czyW)self.speedY-= 0.2;

    if(self.speedX < -5) self.speedX = -5;
    if(self.speedX > 5) self.speedX = 5;
    if(self.speedY < -5) self.speedY = -5;
    if(self.speedY > 5) self.speedY = 5;

    console.log(self.speedX);
    self.x+= self.speedX;
    self.y+= self.speedY;
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
 socket.emit("id", socket.id);

 var player = Player(socket.id);
 playerList[socket.id] = player;
 player.color = randomColor();

 socket.on("nick", function (data) {
   player.nick = data;
 });

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

function randomColor() {
  var letters = "0123456789ABCDEF".split("");
  var color = "#";
  for(var i = 0; i < 6; i++){
    color+= letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function logIleOnline () {
  var ileOnline = 0;
  for (var i in socketList) {
    ileOnline++;
  }
  for (var i in socketList) {
    var socket = socketList[i];
    socket.emit("ileOnline", ileOnline);
  }
  console.log("Online: " + ileOnline);
}

setInterval(function () {
  var pack = [];
  for(var i in playerList){
    var player = playerList[i];
    player.updatePos();
    pack.push({x: player.x, y:player.y, color:player.color, nick:player.nick, id:player.id});
  }
  for (var i in socketList) {
    var socket = socketList[i];
    socket.emit("players", pack);
  }
}, 1000/30);
