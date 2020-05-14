import React, { Fragment, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Link,
  Route,
  useParams,
  useRouteMatch,
  Redirect,
} from "react-router-dom";
// import PageContainer from '../components/pageContainer';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import Consults from '../pages/consults';
import Profile from '../pages/profile';
import Footer from '../components/footer';
import Header from '../components/header';

const style = css`
  flex: 1;
`

export default function Pages() {
  return (
    <Router>
      {/* <PageContainer> */}
      {/* fill all the possible screen */}
      <Header />
      <div css={style}>
        <Switch>
          <Route path="/profile">
            <Profile />
          </Route>
          <Route path="/consults">
            <Consults />
          </Route>
          <Redirect from='/' to="/consults" />
        </Switch>
      </div>
      <Footer />
      {/* </PageContainer> */}
    </Router>
  );
}