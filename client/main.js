'use strict';

// var baseUrl = 'https://babble-server-1.herokuapp.com';
var baseUrl = 'http://localhost:9000';

var xhr = new XMLHttpRequest();
xhr.addEventListener('load', handleResponse);
xhr.open('GET', baseUrl + '/status');
xhr.send();

function handleResponse (e) {
  console.log(e);
  console.log('Responded on ' + new Date(e.timeStamp));
  console.log('With data: ' + e.target.responseText);
}
