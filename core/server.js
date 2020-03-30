const http = require('http');

const { serverPort } = require('../settings');
const { handler } = require('./handler');

http.createServer(handler).listen(serverPort, function () {
  console.log('server is running on port: ' + serverPort);
});
