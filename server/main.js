'use strict';

var http = require('http');
var qs = require('querystring');
var url = require('url');

var port = 9000;

var server = http.createServer();
server.listen(port);
server.on('request', handleRequest);
console.log('Listening on port %d', port);

function handleRequest (request, response) {
  console.log('Handling request URL: %s', request.url);
  console.dir(request.headers);

  var requestUrl = url.parse(request.url, true);

  if (requestUrl.pathname === '/status') {
    response.writeHead(200, {
      'Content-Type': 'text/html'
    });
    response.write('OK\n');
    response.end();
  } else if (requestUrl.pathname === '/echo') {
    var requestBody = '';
    request.on('data', function (chunk) {
      requestBody += chunk;
    });
    request.on('end', function () {
      var data = qs.parse(requestBody);
      if (data.message) {
        response.writeHead(200, {
          'Content-Type': 'text/html'
        });
        response.write('You said: "' + data.message + '"\n');
      } else {
        response.writeHead(400);
        response.write(http.STATUS_CODES[400] + '\n');
      }
      response.end();
    });
  } else {
    response.writeHead(404);
    response.write(http.STATUS_CODES[404] + '\n');
    response.end();
  }
}
