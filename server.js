'use strict';

var path = require('path');
var express = require('express');
var http = require('http');
var ws = require('ws');

var expressApp = express();
var alexaRouter = express.Router();
expressApp.set('view engine', 'ejs');
expressApp.set('views', path.join(__dirname, 'tester-views'));
expressApp.use(express.static(path.join(__dirname, 'tester-views')));
expressApp.use('/alexa', alexaRouter);

var srvrInstance = http.createServer(expressApp);
srvrInstance.listen(process.env.PORT || 8080);

// var script = require('./examples/demo1.js');
// var script = require('./examples/tutorial.js');
// var script = require('./scripts/fins.js');
//var script = require("./scripts/hls-diabetes.js");
var script = require("./scripts/bathroom-script.js");
script.setServerApp(express, alexaRouter);

var wss = new ws.Server({ server: srvrInstance  });

console.log('Waiting for requests...');

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));
});

function broadcast(jsonObj) {
  console.log('Broadcasting...', jsonObj);
  wss.clients.forEach((client) => {
    client.send(JSON.stringify(jsonObj));
  });
}

script.setBroadcaster(broadcast);
