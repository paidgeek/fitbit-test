var app = require('./app');
var debug = require('debug')('opkp-fitbit:server');
var http = require('http');

app.set('port', process.env.PORT || 1337);

var server = http.createServer(app);
server.listen(app.get("port"));
