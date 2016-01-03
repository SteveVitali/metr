var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var moment = require('moment');
var numeral = require('numeral');

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
    var style = space.isAvailable ? 'success' : 'danger';

    var occupiedAt = new Date(space.occupiedAt);

    var location = space.address
      ? space.address.fullAddress
      : [space.location[0], space.location[1]].join(', ');

    var locationUrl = 'https://www.google.com/maps/place/' + (space.address
      ? space.address.fullAddress
      : [[space.location[1], space.location[0]].join(',')]
    );

    var title = (
      <a href={locationUrl} target='_blank'>{location}</a>
    );
    return (
      <Panel header={title} eventKey={this.props.key} bsStyle={style}>
        { space.occupiedBy && (
          <p>
            <strong>Occupied By: </strong>
            {space.occupiedBy.firstName + ' ' + space.occupiedBy.lastName}
            <span style={{ color: 'gray' }}>
              {' since ' + moment(occupiedAt).format('MMMM Do YYYY, h:mm:ss a')}
            </span>
          </p>
        )}
        <p>
          <strong>Hourly Rate: </strong>
          {numeral(space.hourlyRate).format('$0,0.00')}
        </p>
      </Panel>
    );
  }
});

module.exports = ParkingSpaceView;
