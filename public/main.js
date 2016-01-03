var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./app.jsx');

document.addEventListener('DOMContentLoaded', () => {
  var parent = document.getElementById('app');
  var user = JSON.parse(document.getElementById('user').value);
  window.currentUser = user; // hack until I figure out right way
  var rootNode = React.createElement(App, { user: user }, parent);
  ReactDOM.render(rootNode, parent);
});
