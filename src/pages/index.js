/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import Footer from '../components/footer';
import Header from '../components/header';
import Consults from '../pages/consults';
import Profile from '../pages/profile';
import { breakpoints, mediaqueries } from '../styles';

const style = css`
  flex: 1;
  width: 100%;
  text-align: center;
  
  ${mediaqueries[0]}{
      max-width: ${breakpoints[3]}px;
  }
`

export default function Pages() {
  return (
    <Router>
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
      {/* if is enough wide the viewport, hide the footer and show it in the header */}
      {document.body.clientWidth < breakpoints[1] && <Footer />}
    </Router>
  );
}