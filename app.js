var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/client'));

// views is directory for all template files
app.set('client', __dirname + '/client');
app.set('client engine', 'ejs');

app.get('/', function(request, response) {
  response.render('client/index.html');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
