var React = require('react');
var ReactBootstrap = require('react-bootstrap');

var ParkingSpaceView = React.createClass({
  propTypes: {
    space: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  render() {
    return (
      <div className='container'>
        {JSON.stringify(this.props.space)}
      </div>
    );
  }
});

module.exports = ParkingSpaceView;
