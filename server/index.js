'use strict';

var app = require('./app'),
  	db = require('./db'),
  	fs = require('fs'),
  	https = require('https'),
  	privateKey = fs.readFileSync('./secure/key.pem', 'utf-8'),
  	certificate = fs.readFileSync('./secure/cert.pem', 'utf-8')

var port = 8080;
var server = https.createServer({key: privateKey, cert: certificate}, app)

server.listen(port, function () {
	console.log('HTTPS server patiently listening on port', port);
});

module.exports = server;