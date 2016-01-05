var _ = require('lodash');
var async = require('async');
var request = require('superagent');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Loader = require('react-loader');
var ParkingSpaceActions = require('../actions/parking-space-actions.js');
var ParkingSpaceView = require('../components/parking-space-view.jsx');
var ParkingSpaceForm = require('../components/parking-space-form.jsx');

var ParkingSpacesList = React.createClass({
  propTypes: {
    spaces: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    user: React.PropTypes.object.isRequired
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {
      showRegisterForm: false,
      loaded: true
    };
  },

  componentDidMount() {
    ParkingSpaceActions.load();
  },

  toggleRegisterForm() {
    this.setState({
      showRegisterForm: !this.state.showRegisterForm
    });
  },

  submitParkingSpace(spaces) {
    this.setState({
      loaded: false
    });
    async.eachSeries(spaces, function(space, next) {
      request.post('/api/parking-spaces')
        .type('json')
        .send(space)
        .end((err, res) => {
          !err && console.log('successfully created', res);
          next(err);
        });
    },
    (err) => {
      err && console.log(err);
      ParkingSpaceActions.load();
      this.setState({
        loaded: true
      });
    });
    this.toggleRegisterForm();
  },

  render() {
    var Button = ReactBootstrap.Button;
    var Modal = ReactBootstrap.Modal;
    var Accordion = ReactBootstrap.Accordion;
    return (
      <div className='container'>
        <h4>
          My Spaces ({(this.props.spaces || []).length})
        </h4>
        <Loader loaded={this.state.loaded}>
          <Accordion>
            { _.map(this.props.spaces, (space, i) => {
              return (
                <ParkingSpaceView space={space} user={this.props.user} key={i}/>
              );
            })}
          </Accordion>
          <Button bsStyle='primary' onClick={this.toggleRegisterForm}>
            Register Space
          </Button>
          { this.state.showRegisterForm && (
            <ParkingSpaceForm user={this.props.user}
              dismissForm={this.toggleRegisterForm}
              onSubmit={this.submitParkingSpace}/>
          )}
        </Loader>
      </div>
    );
  }
});

module.exports = ParkingSpacesList;
