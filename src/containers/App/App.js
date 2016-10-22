import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { IndexLink } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import Helmet from 'react-helmet';
import {
  isLoaded as isAuthLoaded,
  load as loadAuth,
  logout
} from 'redux/modules/auth';
import { push } from 'react-router-redux';
import config from '../../config';
import { asyncConnect } from 'redux-async-connect';
import Cookie from 'js-cookie';

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    const promises = [];
    const token = Cookie.get('token');

    if (!isAuthLoaded(getState()) && token) {
      promises.push(dispatch(loadAuth()));
    }

    return Promise.all(promises);
  }
}])
@connect(state => ({
  user: state.auth.user,
  registrationResponse: state.auth.registrationResponse
}), { logout, pushState: push })
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    logout: PropTypes.func.isRequired,
    registrationResponse: PropTypes.object,
    pushState: PropTypes.func.isRequired
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      // login
      this.props.pushState('/loginSuccess');
    } else if (this.props.user && !nextProps.user) {
      // logout
      this.props.pushState('/');
    }
  }

  handleLogout = (event) => {
    event.preventDefault();
    this.props.logout();
  };

  render() {
    const {user} = this.props;
    const styles = require('./App.scss');

    return (
      <div className={styles.app}>
        <Helmet {...config.app.head}/>
        {user && <Navbar fixedTop>
          <Navbar.Header>
            <Navbar.Brand>
              <IndexLink to="/">
                <div className={styles.brandLogo}/>
                <span>{config.app.title}</span>
              </IndexLink>
            </Navbar.Brand>
            <Navbar.Toggle/>
          </Navbar.Header>

          <Navbar.Collapse eventKey={0}>
            <Nav navbar>
              {user &&
                <LinkContainer to="/todo">
                  <NavItem eventKey={1}>Todo List</NavItem>
                </LinkContainer>}
            </Nav>
            <Nav navbar pullRight>
              <NavItem eventKey={2} className="logout-link" onClick={this.handleLogout}>
                  <i className="fa fa-sign-out" aria-hidden="true"></i>
                  &nbsp;
                  Logout
                </NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>}

        <div className={styles.appContent + ' container'}>
          {this.props.children}
        </div>
        {user && <footer className="footer">
          <div className="container">
            <div className="row text-center">
              <a target="_blank" href="https://www.facebook.com/yogakurniawan"><img className={styles.socialLogo} src="https://storage.googleapis.com/cerebral/facebook.svg" /></a>
              <a target="_blank" href="https://www.github.com/yogakurniawan"><img className={styles.socialLogo} src="https://storage.googleapis.com/cerebral/github.svg" /></a>
              <a target="_blank" href="https://www.instagram.com/yogakurniawan/"><img className={styles.socialLogo} src="https://storage.googleapis.com/cerebral/instagram.svg" /></a>
              <a target="_blank" href="https://www.twitter.com/yogkurniawan"><img className={styles.socialLogo} src="https://storage.googleapis.com/cerebral/twitter.svg" /></a>
              <a target="_blank" href="https://www.linkedin.com/in/yogakurniawan"><img className={styles.socialLogo} src="https://storage.googleapis.com/cerebral/linkedin.svg" /></a>
            </div>
            <div className="row text-center">
              <p><i className={styles.strong + ' fa fa-code'} aria-hidden="true"></i> with <i className={styles.red + ' fa fa-heart'} aria-hidden="true"></i> by <strong>Yoga</strong></p>
            </div>
          </div>
        </footer>}
      </div>
    );
  }
}
