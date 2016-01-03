var _ = require('lodash');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
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
      showRegisterForm: false
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

  submitParkingSpace(data) {
    // submit the space
    // ...
    console.log('submitting parking spaece...', data);
    this.toggleRegisterForm();
  },

  render() {
    var Button = ReactBootstrap.Button;
    var Modal = ReactBootstrap.Modal;
    return (
      <div className='container'>
        <h4>
          Your Spaces ({(this.props.user.spaces || []).length})
        </h4>
        { _.map(this.props.spaces, function(space) {
          return (
            <ParkingSpaceView space={space} user={this.props.user}/>
          );
        })}
        <Button bsStyle='primary' onClick={this.toggleRegisterForm}>
          Register Space
        </Button>
        { this.state.showRegisterForm && (
          <ParkingSpaceForm user={this.props.user}
            dismissForm={this.toggleRegisterForm}
            onSubmit={this.submitParkingSpace}/>
        )}
      </div>
    );
  }
});

module.exports = ParkingSpacesList;
