var React = require('react');
var Reflux = require('reflux');

var ParkingSpaceStore = require('./stores/parking-space-store.js');
var ParkingSpaceList = require('./components/parking-space-list.jsx');

var App = React.createClass({
  propTypes: {
    user: React.PropTypes.object.isRequired
  },

  mixins: [Reflux.connect(ParkingSpaceStore, 'spaces')],

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  render: function() {
    return (
      <ParkingSpaceList user={this.props.user}
        spaces={this.state.parkingSpaces}/>
    );
  }
});

module.exports = App;
