'use strict';

var messages = [];


module.exports = {
  addMessage: function (newMessage) {
    messages.push(newMessage);
  },
  getNewMessages: function (counter) {
    return messages.slice(counter);
  }
};
