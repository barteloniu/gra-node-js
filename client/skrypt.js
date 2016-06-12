var ctx = document.getElementById("canvas").getContext("2d");

var keys = [];

var ileOnline = 0;

document.getElementById("nick").onkeydown = function (event) {
  if(event.keyCode == 13) start();
};

function start() {
  document.getElementById("grajButton").style.display = "none";
  document.getElementById("nick").style.display = "none";
  document.getElementById("canvas").style.display = "inline";

  var socket = io();

  socket.emit("nick", document.getElementById("nick").value);

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
      ctx.fillText(data[i].nick, data[i].x, data[i].y - 30);
    }
    ctx.fillStyle = "#cbcbcb";
    ctx.font = "20px Arial";
    ctx.fillText("Online: " + ileOnline, 10, 30);
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
