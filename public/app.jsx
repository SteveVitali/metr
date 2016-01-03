var React = require('react');
var Reflux = require('reflux');

var ParkingSpaceStore = require('./stores/parking-space-store.js');
var ParkingSpaceList = require('./components/parking-space-list.jsx');

var App = React.createClass({
  mixins: [Reflux.connect(ParkingSpaceStore, 'spaces')],
  render: function() {
    return (
      <ParkingSpaceList spaces={this.state.parkingSpaces}/>
    );
  }
});

module.exports = App;
