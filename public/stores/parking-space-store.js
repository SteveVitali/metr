var Reflux = require('reflux');
var _ = require('underscore');
var request = require('superagent');
var ParkingspaceActions = require('./parking-space-actions.js');

var ParkingSpaceStore = Reflux.createStore({
  listenables: [ParkingSpaceActions],

  init: function() {
    this.listenTo(ParkingSpaceActions.load, this.fetchData);
  },

  getInitialState: function() {
    return this.spaces = [];
  },

  fetchData: function() {
    var url = '/api/parking-spaces/for-user/' + currentUser._id;
    request.get(url, (res) => {
      this.spaces = res;
      console.log('response from current spaces', res);
      this.trigger(this.spaces);
    });
  },

  updateSpaces: function(spaces) {
    this.spaces = spaces;
    this.trigger(spaces);
  }
});

module.exports = TodoListStore;
