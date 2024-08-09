import React, { Component } from "react";
import { withRouter, Route, Switch } from "react-router-dom";
import Navbar from "./components/container/navbar/Navbar";
import "./App.css";
import { connect } from "react-redux";
import { login, logout } from "./redux/reducer";
import Cart from "./components/presentational/Cart";
import Home from "./components/container/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import About from "./components/container/About";
import Admin from "./components/container/Admin/Admin";
import axios from "axios";
class App extends Component {
  componentDidMount() {
    setTimeout(() => {
      axios.get("/api/user-data").then(res => {
        const { dispatch } = this.props;

        if (res.data.user) {
          dispatch(login(res.data.user));
        } else {
          dispatch(logout());
        }
      });
    }, 3000);
  }
  render() {
    return (
      <div className="App">
        <Navbar />
        <div className="container">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/about" component={About} />
            <Route exact path="/cart" component={Cart} />
            <Route exact path="/admin" component={Admin} />
          </Switch>
        </div>
      </div>
    );
  }
}
export default withRouter(connect()(App));
