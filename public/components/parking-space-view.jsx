var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Loader = require('react-loader');
var moment = require('moment');
var numeral = require('numeral');
var request = require('superagent');

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
    return {
      space: this.props.space,
      loaded: true
    };
  },

  updateHourlyRate(e) {
    var space = this.state.space;
    var value = e.target.value;
    if (isNaN(value)) return;
    space.hourlyRate = value;
    this.setState({
      space: space
    });
  },

  saveHourlyRate(e) {
    var space = this.state.space;
    this.setState({
      loaded: false
    });

    request
    .put('/api/parking-spaces/' + this.state.space._id)
    .send(this.state.space)
    .end((err, res) => {
      this.setState({
        loaded: true,
        space: JSON.parse(res.text)
      });
    });
  },

  render() {
    var Panel = ReactBootstrap.Panel;
    var Button = ReactBootstrap.Button;
    var Input = ReactBootstrap.Input;

    var space = this.state.space;
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

    var updateButton = (
      <Button onClick={this.saveHourlyRate}>
        Update
      </Button>
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
        <Loader loaded={this.state.loaded}>
          <strong>Hourly Rate: </strong>
          { space.occupiedBy && (<span>
            {numeral(space.hourlyRate).format('$0,0.00')}
          </span>)}
          { !space.occupiedBy && (
            <Input type='text' value={this.state.space.hourlyRate}
              addonBefore='$'
              buttonAfter={updateButton}
              onChange={this.updateHourlyRate}/>
          )}
        </Loader>
      </Panel>
    );
  }
});

module.exports = ParkingSpaceView;
