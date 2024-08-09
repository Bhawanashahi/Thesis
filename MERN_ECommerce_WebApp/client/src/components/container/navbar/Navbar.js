import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";

// const { user } = this.props;

export class Navbar extends React.Component {
  linkFunc(path) {
    this.props.history.push(path);
  }
  logout = () => {
    //Pass a empty since you are just logging out the user.
    axios
      .post("/api/logout", {})
      .then(res => {
        //The will logout a user
        alert(res.data.message);
        //Reload the browser using this.props.history.go();
        this.props.history.go();
      })
      .catch(err => console.log("Logout Axios Error-------", err));
  };
  login = () => {
    //Define your encodedURi since your are dealing with oAuth, so it can be secure, and oAuth and decode it.
    //Have your location origin, with your auth0 proxy which will be auth/calllback
    const redirectURI = encodeURIComponent(
      `${window.location.origin}/auth/callback`
    );
    //Redirect the user to your Auth0 domain, with the correct query parameters to retrieve code from auth0.
    window.location = `https://${
      process.env.REACT_APP_AUTH0_DOMAIN
    }/login?client=${
      process.env.REACT_APP_AUTH0_CLIENT_ID
    }&scope=openid%20profile%20email&redirect_uri=${redirectURI}`;
  };
  render() {
    console.log("#", process.env);
    console.log(this.props.user);
    return (
      <nav
        className=" nav navbar navbar-expand-sm navbar-dark bg-primary mb-3 py-0"
        style={{ height: "50px" }}
      >
        <a href="/" className="navbar-brand mx-auto">
          E-Commerce
        </a>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item mx-3">
            <Link to="/" className="nav-link">
              <i className="fas fa-home" /> HOME
            </Link>
          </li>
          <li className="nav-item mx-3">
            <Link to="/about" className="nav-link">
              <i className="fas fa-question" /> ABOUT
            </Link>
          </li>
          <li className="nav-item mx-3">
            <Link to="/cart" className="nav-link">
              <i className="fas fa-shopping-cart" />
              CART
            </Link>
          </li>
          {this.props.user ? (
            <li
              style={{ cursor: "pointer" }}
              className="nav-item mx-3 nav-link"
              onClick={() => this.logout()}
            >
              <i className="fas fa-sign-out-alt" /> Logout
              <img
                style={{ borderRadius: "50%", height: "75%" }}
                className="user-image"
                src={this.props.user.profile_picture}
                alt={this.props.user.nickname}
              />
            </li>
          ) : (
            <li className="nav-item mx-3 nav-link" onClick={() => this.login()}>
              <i className="fas fa-sign-in-alt" /> LogIn
            </li>
          )}
        </ul>
      </nav>
    );
  }
}
const mapStateToProps = state => {
  return {
    user: state.user
  };
};
export default withRouter(connect(mapStateToProps)(Navbar));
