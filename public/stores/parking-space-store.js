var Reflux = require('reflux');
var _ = require('lodash');
var request = require('superagent');
var ParkingSpaceActions = require('../actions/parking-space-actions');

var ParkingSpaceStore = Reflux.createStore({
  listenables: [ParkingSpaceActions],

  init() {
    this.listenTo(ParkingSpaceActions.load, this.fetchData);
  },

  fetchData() {
    var url = '/api/parking-spaces/for-user/' + currentUser._id;
    request.get(url, (err, res) => {
      this.spaces = JSON.parse(res.text);
      this.trigger(this.spaces);
    });
  },

  updateSpaces(spaces) {
    this.spaces = spaces;
    this.trigger(spaces);
  }
});

module.exports = ParkingSpaceStore;
