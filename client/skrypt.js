var ctx = document.getElementById("canvas").getContext("2d");

var keys = [];

var ileOnline = 0;

document.getElementById("canvas").style.display = "none";

function start() {
  document.getElementById("grajButton").style.display = "none";
  document.getElementById("canvas").style.display = "inline";
  var socket = io();
  socket.on("ileOnline", function (data) {
    ileOnline = data;
  });

  socket.on("players", function (data) {
    ctx.clearRect(0, 0, 500, 500);
    for(var i = 0;i < data.length; i++){
      ctx.fillStyle = data[i].color;
      ctx.beginPath();
      ctx.arc(data[i].x, data[i].y, 20, 0, 2 * Math.PI);
      ctx.fill();
    }
    ctx.fillStyle = "#000";
    ctx.fillText(10, 10, "Online: " + ileOnline + "!");
  });

  document.onkeydown = function (event) {
    keys[event.keyCode] = true;
    socket.emit("keypress", {keys: keys});
  };

  document.onkeyup = function (event) {
    delete keys[event.keyCode];
    socket.emit("keypress", {keys: keys});
  };
}
