var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var ParkingSpaceActions = require('../actions/parking-space-actions.js');
var ParkingSpaceView = require('../components/parking-space-view.jsx');

var ParkingSpacesList = React.createClass({
  propTypes: {
    spaces: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
  },

  getInitialState() {
    return {};
  },

  getDefaultProps() {
    return {};
  },

  componentDidMount() {
    ParkingSpaceActions.load();
  },

  render() {
    return (
      <div className='container'>
        <h4>Your Spaces</h4>
        { _.map(this.props.spaces, function(space) {
          return <ParkingSpaceView space={space}/>;
        })}
      </div>
    );
  }
});

module.exports = ParkingSpacesList;
