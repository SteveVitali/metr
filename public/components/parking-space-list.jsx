var _ = require('lodash');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var ParkingSpaceActions = require('../actions/parking-space-actions.js');
var ParkingSpaceView = require('../components/parking-space-view.jsx');

var ParkingSpacesList = React.createClass({
  propTypes: {
    spaces: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    user: React.PropTypes.object.isRequired
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  componentDidMount() {
    ParkingSpaceActions.load();
  },

  render() {
    return (
      <div className='container'>
        <h4>
          Your Spaces ({(this.props.user.spaces || []).length})
        </h4>
        { _.map(this.props.spaces, function(space) {
          return <ParkingSpaceView space={space} user={this.props.user}/>;
        })}
      </div>
    );
  }
});

module.exports = ParkingSpacesList;
