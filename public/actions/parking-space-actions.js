var Reflux = require('reflux');
var request = require('superagent');

var ParkingSpaceActions = Reflux.createActions([
  'load'
]);

module.exports = ParkingSpaceActions;
