var React = require('react');
var ReactBootstrap = require('react-bootstrap');

var NavigationBar = React.createClass({
  propTypes: {
    user: React.PropTypes.object.isRequired
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  render() {
    var Navbar = ReactBootstrap.Navbar;
    var Nav = ReactBootstrap.Nav;
    var NavItem = ReactBootstrap.NavItem;
    var NavDropdown = ReactBootstrap.NavDropdown;
    var MenuItem = ReactBootstrap.MenuItem;
    var firstName = this.props.user.firstName;
    return (
      <Navbar inverse>
        <Navbar.Header>
          <Navbar.Brand>
            <a href='#'>Metr</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem eventKey={1} href="#">My Spaces</NavItem>
          </Nav>
          <Nav pullRight>
            <NavDropdown eventKey={3} title={firstName} id='nav-dropdown'>
              <MenuItem eventKey={3.1}>My Spaces</MenuItem>
              <MenuItem divider />
              <MenuItem eventKey={3.3}>Logout</MenuItem>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
});

module.exports = NavigationBar;