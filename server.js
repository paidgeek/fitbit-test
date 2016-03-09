var app = require('../app');
var debug = require('debug')('opkp-fitbit:server');
var http = require('http');

app.set('port', process.env.PORT || 8080);

var server = http.createServer(app);
server.listen(app.get("port"));
