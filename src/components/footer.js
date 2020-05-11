import React from "react";
import LogoutButton from './logout-button';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";

export default function Pages(props) {
  return (
    <>
      <footer>
        <nav>
          <ul>
            <li>
              <Link to="/consults">go to consults</Link>
            </li>
            <li>
              <Link to="/profile">go to profile</Link>
            </li>
          </ul>
        </nav>
        <LogoutButton />
      </footer>
    </>
  );
}