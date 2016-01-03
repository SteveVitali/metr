var _ = require('lodash');
var request = require('superagent');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var FormGenerator = require('form-generator-react');

var ParkingSpaceForm = React.createClass({
  propTypes: {
    user: React.PropTypes.object.isRequired,
    dismissForm: React.PropTypes.func,
    onSubmit: React.PropTypes.func
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      address: {},
      showIdentityForm: true,
      eligibleLocations: []
    };
  },

  toggleRegisterForm() {
    this.props.dismissForm && this.props.dismissForm();
  },

  lookupIdentity(data) {
    console.log('data', data, 'looking up identity');
    request.post('/white-pages/identity-check')
      .type('json')
      .send(data)
      .end((err, res) => {
        this.setState({
          showIdentityForm: false,
          eligibleLocations: _.map(res.body || [], function(loc) {
            return {
              city: loc.city,
              zip: loc.postal_code,
              state: loc.state_code,
              country: loc.country_code,
              fullAddress: loc.address,
              house: loc.house,
              streetName: loc.street_name,
              streetType: loc.street_type,
              streetDirection: loc.pre_dir,
              aptNumber: loc.apt_number,
              latitude: loc.lat_long.latitude,
              longitude: loc.lat_long.longitude,
              line1: '1143 S Sydenham St',
              line2: '',
              line3: 'Philadelphia PA 19146-3113'
            };
          })
      });
    });
  },

  onSubmit(data) {
    console.log('data', data);
    this.props.onSubmit && this.props.onSubmit(data);
  },

  render() {
    var Button = ReactBootstrap.Button;
    var Modal = ReactBootstrap.Modal;
    var identityForm = FormGenerator.create({
      firstName: {
        type: String,
        label: 'First Name',
        defaultValue: this.state.firstName,
        isRequired: true
      },
      lastName: {
        type: String,
        label: 'Last Name',
        defaultValue: this.state.lastName,
        isRequired: true
      },
      address: {
        type: {
          city: {
            type: String,
            label: 'City'
          },
          state: {
            type: String,
            validators: [
              FormGenerator.validators.minLength(0),
              FormGenerator.validators.maxLength(2)
            ],
            label: 'State Code'
          },
          zip: {
            type: String,
            validators: [
              FormGenerator.validators.minLength(0),
              FormGenerator.validators.maxLength(5)
            ],
            label: 'Zip Code'
          }
        },
        label: 'Address',
        defaultValue: this.state.address
      }
    }, 'identityFormRef', this.lookupIdentity, true);

    var propertySelection = _.map(this.state.eligibleLocations, function(loc) {
      return <p>{loc.fullAddress}</p>;
    });

    return (
      <Modal bsSize='large'
        aria-labelledby='register-space-modal'
        show={true}>
        <Modal.Header closeButton>
          <Modal.Title id='register-space-modal'>
            Register Parking Space
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { this.state.showIdentityForm && identityForm }
          { !this.state.showIdentityForm && propertySelection }
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.dismissForm}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
});

module.exports = ParkingSpaceForm;
