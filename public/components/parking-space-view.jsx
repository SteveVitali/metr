var React = require('react');
var ReactBootstrap = require('react-bootstrap');

var ParkingSpaceView = React.createClass({
  propTypes: {
    spaces: React.PropTypes.object.isRequired
  },

  getInitialState() {
    return {};
  },

  getDefaultProps() {
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
