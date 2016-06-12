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

var io = require("socket.io")(server, {});
var socketList = {};

io.sockets.on("connection", function (socket) {
 console.log("Socket connection!");
 socket.id = Math.random();
 socketList[socket.id] = socket;

 socket.on("disconnect", function () {
   delete socketList[socket.id];
 });
});

setInterval(function () {
  var ileOnline = 0;
  for (var i in socketList) {
    ileOnline++;
  }
  console.log("Online:" + ileOnline);
});
