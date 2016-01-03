var React = require('react');
var ReactBootstrap = require('react-bootstrap');

var ParkingSpaceView = React.createClass({
  propTypes: {
    space: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired,
    key: React.PropTypes.string
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  render() {
    var Panel = ReactBootstrap.Panel;
    var space = this.props.space;
    console.log('space', space);
    var ownerName = space.owner.firstName + ' ' + space.owner.lastName;
    var space = this.props.space;
    var title = space.address
      ? space.address.fullAddress
      : [space.location[0], space.location[1]].join(' ');
    var style = space.isAvailable ? 'success' : 'danger';

    return (
      <Panel header={title} eventKey={this.props.key} bsStyle={style}>
        <p><strong>Owner: </strong>{ownerName}</p>
      </Panel>
    );
  }
});

module.exports = ParkingSpaceView;
