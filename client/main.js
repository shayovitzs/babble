'use strict';

var forms = document.querySelectorAll('form');

for (var i = 0; i < forms.length; i++) {
  ajaxify(forms[i]);
}

function ajaxify (form) {
  form.addEventListener('submit', onSubmit);

  function onSubmit (e) {
    e.preventDefault();
    var action = form.getAttribute('action');
    var xhr = new XMLHttpRequest();
    var method = form.getAttribute('method') || 'GET';
    xhr.addEventListener('load', handleResponse);
    xhr.open(method, action);
    if (method === 'POST') {
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    xhr.send(serializeForm(form));
  }

  function serializeForm (form) {
    var serialized = '';
    for (var i = 0; i < form.elements.length; i++) {
      var element = form.elements[i];
      if (element.name) {
        serialized += element.name + '=' + encodeURIComponent(element.value);
      }
    }
    return serialized;
  }

  function handleResponse (e) {
    console.log(e);
    console.log('Responded with: ' + e.target.responseText);
  }
}
