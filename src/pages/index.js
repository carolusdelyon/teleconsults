import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Link,
  Route,
} from "react-router-dom";
import PageContainer from '../components/pageContainer';

import Consults from '../pages/consults';
import Profile from '../pages/profile';

export default function Pages() {
  return (
    <>
      <Router>
        <PageContainer>
          <Switch>
            <Route path="/profile">
              <Profile />
            </Route>
            <Route path="/consults">
              <Consults />
            </Route>
          </Switch>
        </PageContainer>
      </Router>
    </>
  );
}