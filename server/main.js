'use strict';

var http = require('http');
var qs = require('querystring');
var url = require('url');

var messages = require('./messages');

var port = process.env.PORT || 9000;

var clientsWaitingList = [];

var server = http.createServer();
server.listen(port);
server.on('request', handleRequest);
console.log('Listening on port %d', port);

function handleRequest (request, response) {
  console.log('Handling request URL: %s', request.url);
  console.dir(request.headers);

  var requestUrl = url.parse(request.url, true);

  response.setHeader('Access-Control-Allow-Origin', '*');

  if (requestUrl.pathname === '/status') {
    handleStatus(request, response);
  } else if (requestUrl.pathname === '/echo') {
    handleEcho(request, response);
  } else if (requestUrl.pathname === '/message') {
    handleMessage(request, response);
  } else if (requestUrl.pathname === '/poll') {
    handlePoll(request, response);
  } else {
    respondWithStatus(response, 404);
  }
}

// Poll Flow
// Client: sendRequest /poll?counter=5
// Server: handlePoll
// Server: getNewMessages
// Server: if newMessages response end
// Server: else waiting list, delay response

// Message Flow
// Client: sendRequest /message
// Server: handleMessage
// Server: release clientsWaitingList

function handlePoll (request, response) {
  var requestUrl = url.parse(request.url, true);
  var counter = Number(requestUrl.query.counter);
  var newMessages = messages.getNewMessages(counter);
  if (newMessages.length) {
    respondWithJSON(response, newMessages);
  } else {
    clientsWaitingList.push({
      request: request,
      response: response,
      counter: counter
    });
  }
  console.log(newMessages);
}

function handleMessage (request, response) {
  if (request.method !== 'POST') {
    respondWithStatus(405);
    return;
  }
  getBufferedRequest(request, function (data) {
    if (data) {
      messages.addMessage(data);
      for (var i = 0; i < clientsWaitingList.length; i++) {
        var client = clientsWaitingList[i];
        respondWithJSON(client.response, messages.getNewMessages(client.counter));
      }
      clientsWaitingList.length = 0;
      respondWithHtml(response, 'This is your message: "' + data.message + '"\n');
    } else {
      respondWithStatus(response, 400);
    }
  });
}

function handleStatus (request, response) {
  if (request.method !== 'GET') {
    respondWithStatus(405);
    return;
  }
  respondWithHtml(response, 'OK\n');
}

function handleEcho (request, response) {
  if (request.method !== 'POST') {
    respondWithStatus(405);
    return;
  }
  getBufferedRequest(request, function (data) {
    if (data.echo) {
      respondWithHtml(response, 'You said: "' + data.echo + '"\n');
    } else {
      respondWithStatus(response, 400);
    }
  });
}

function getBufferedRequest (request, onEnd) {
  var requestBody = '';
  request.on('data', function (chunk) {
    requestBody += chunk;
  });
  request.on('end', function () {
    var data = qs.parse(requestBody);
    onEnd(data);
  });
}

function respondWithJSON (response, data) {
  response.writeHead(200, {
    'Content-Type': 'application/json'
  });
  response.write(JSON.stringify(data));
  response.end();
}

function respondWithHtml (response, html) {
  response.writeHead(200, {
    'Content-Type': 'text/html'
  });
  response.write(html);
  response.end();
}

function respondWithStatus (response, code) {
  response.writeHead(code);
  response.write(http.STATUS_CODES[code] + '\n');
  response.end();
}
