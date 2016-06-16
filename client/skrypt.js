var ctx = document.getElementById("canvas").getContext("2d");
ctx.font = "20px Arial";

var keys = [];
var ileOnline = 0;
var siatka = document.getElementById("siatka");
var player = {
  x:0,
  y:0,
  id:0
};

document.getElementById("nick").onkeydown = function (event) {
  if(event.keyCode == 13) start();
};

function start() {
  document.getElementById("divNick").style.display = "none";
  document.getElementById("canvas").style.display = "inline";
  var socket = io();

  socket.emit("nick", document.getElementById("nick").value);

  socket.on("id", function (data) {
    player.id = data;
  });

  socket.on("ileOnline", function (data) {
    ileOnline = data;
  });

  socket.on("players", function (data) {
    ctx.clearRect(0, 0, 500, 500);

    for (var x = -10; x < 10; x++) {
      for (var y = -10; y < 10; y++) {
        ctx.drawImage(siatka, x * 1000 + ctx.canvas.width / 2 - player.x, y * 1000 + ctx.canvas.height / 2 - player.y);
      }
    }

    for(var i = 0;i < data.length; i++){

      ctx.fillStyle = data[i].color;
      ctx.textAlign = "center";
      ctx.beginPath();

      if(data[i].id == player.id){
        ctx.canvas.style.border = "1px solid " + data[i].color;
        player.x = data[i].x;
        player.y = data[i].y;
        ctx.arc(ctx.canvas.width / 2, ctx.canvas.height / 2, 20, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillText(data[i].nick, ctx.canvas.width / 2, ctx.canvas.height / 2 - 30);
      }else {
        ctx.arc(data[i].x + ctx.canvas.width / 2 - player.x, data[i].y + ctx.canvas.height / 2 - player.y, 20, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillText(data[i].nick, data[i].x + ctx.canvas.width / 2 - player.x, data[i].y - 30  + ctx.canvas.height / 2 - player.y);
      }
    }
    ctx.fillStyle = "#cbcbcb";
    ctx.textAlign = "left";
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
