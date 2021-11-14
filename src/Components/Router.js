import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
// import Home from "../HomeRoutes/Home";
import Home from "../Routes/Home";

// eslint-disable-next-line import/no-anonymous-default-export
export default () => (
  <>
    <Router>
      <Switch>
        <Route path="/" exact component={Home}></Route>
      </Switch>
    </Router>
  </>
);
