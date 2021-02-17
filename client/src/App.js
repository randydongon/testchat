import { Profiler } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css";
import Chat from "./Components/js/Chat";

import Home from "./Components/js/Home";
import Login from "./Components/js/Login";
import Navbar from "./Components/js/Navbar";
import Profile from "./Components/js/Profile";
import Signup from "./Components/js/Signup";

import { API_HOST } from "./config";
const API = process.env.REACT_APP_API;

function App() {
  return (
    <div className="App">
      <Navbar />

      <Switch>
        <Route exact path="/home" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/profile" component={Profile} />
        <Route path="/chat" component={Chat} />
      </Switch>
    </div>
  );
}

export default App;
