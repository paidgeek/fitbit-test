var app = require('./app');
var debug = require('debug')('opkp-fitbit:server');
var http = require('http');
var config = require('./configuration');

app.set('port', process.env.PORT || config.port);

var server = http.createServer(app);
server.listen(app.get("port"));
