var ctx = document.getElementById("canvas").getContext("2d");
ctx.fillRect(10, 10, 10, 10);
ctx.fillText("Hello, World!", 10, 50);

var keys = [];

var socket = io();
socket.on("ileOnline", function (data) {
  document.getElementById("tekst").innerHTML = "Online: " + data.ile + "!";

  document.onkeydown = function (event) {
    keys[event.keyCode] = true;
    socket.emit("keypress", {keys: keys});
  };

  document.onkeyup = function (event) {
    delete keys[event.keyCode];
    socket.emit("keypress", {keys: keys});
  };

});
