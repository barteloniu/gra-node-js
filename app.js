var http = require('http');
function onReq(req, res) {
  res.writeHead(200, {"Context-Type": "text/html"});
  res.write("Hello, World!");
  res.end();
}
http.createServer(onReq).listen(2000);
console.log("Server started!");
