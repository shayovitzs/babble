'use strict';

for (var j = 0; j < 5; j++) {
  delayedLog(j);
}

function delayedLog (index) {
  setTimeout(function () {console.log(index);}, 1000);
}


// Collect all the forms
var forms = document.querySelectorAll('form');
for (var i = 0; i < forms.length; i++) {
  ajaxify(forms[i], onResponse);
}

// Attach event listeners to the submit event
function ajaxify (form, callback) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Serialize the form fields upon the event
    var data = serializeForm(form);

    // Send appropriate ajax request to the server
    sendRequest(form.action, form.method, callback, data);
  });
}

function sendRequest (url, method, callback, data) {
  var xhr = new XMLHttpRequest();
  xhr.addEventListener('load', callback);
  xhr.open(method || 'GET', url);
  xhr.send(data);
}

// Returns a query string
// key=value&key=value
function serializeForm (form) {
  var data = '';
  for (var i = 0; i < form.elements; i++) {
    var input = form.elements[i];
    if (input.name) {
      data += input.name + '=' + input.value + '&';
    }
  }
  return data;
}


// Print the response

function onResponse (response) {
  console.log(response);
}
