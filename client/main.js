'use strict';

var forms = document.querySelectorAll('form');
var apiUrl = 'http://192.168.34.112:9000';
var messageCount = 0;

for (var i = 0; i < forms.length; i++) {
  ajaxify(forms[i]);
}

pollMessages();

function pollMessages () {
  sendRequest(apiUrl + '/poll?counter=' + messageCount, 'GET', '', function (e) {
    console.log(e);
    console.log('Responded with: ' + e.target.responseText);

    var messages = JSON.parse(e.target.responseText);
    messageCount += messages.length;
    displayMessages(messages);

    // if newMessages display, increase counter
    // sendRequest /poll?counter=new count
    pollMessages();
  });
}

function displayMessages (messages) {
  var ul = document.querySelector('#messages');
  for (var i = 0; i < messages.length; i++) {
    var message = messages[i];
    var li = document.createElement('li');
    li.textContent = message.email +' said: ' + message.message;
    var img = document.createElement('img');
    img.src = 'https://s.gravatar.com/avatar/de337d0c091f8b3ce2a30b038bbafbc3?s=80';
    li.appendChild(img);
    ul.appendChild(li);
  }
}

function sendRequest (url, method, data, callback) {
  var xhr = new XMLHttpRequest();
  xhr.addEventListener('load', callback);
  xhr.open(method, url);
  if (method === 'POST') {
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  }
  xhr.send(data);
}

function ajaxify (form) {
  form.addEventListener('submit', onSubmit);

  function onSubmit (e) {
    e.preventDefault();
    var action = form.getAttribute('action');
    var method = form.getAttribute('method') || 'GET';
    sendRequest(action, method, serializeForm(form), function (e) {
      console.log(e);
      console.log('Responded with: ' + e.target.responseText);
    });
  }

  function serializeForm (form) {
    var serialized = '';
    for (var i = 0; i < form.elements.length; i++) {
      var element = form.elements[i];
      if (element.name) {
        serialized += element.name + '=' + encodeURIComponent(element.value) + '&';
      }
    }
    return serialized;
  }
}
