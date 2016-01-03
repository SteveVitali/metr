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

  submitParkingSpace() {
    // submit the space
    // ...
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
        <Modal bsSize='large'
          aria-labelledby='register-space-modal'
          show={this.state.showRegisterForm}>
          <Modal.Header closeButton>
            <Modal.Title id='register-space-modal'>
              Register Parking Space
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Form goes here.
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle='primary' onClick={this.submitParkingSpace}>
              Submit
            </Button>
            <Button onClick={this.toggleRegisterForm}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
});

module.exports = ParkingSpacesList;
