import React from "react";
import LogoutButton from './logout-button';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";

import { colors, fontSizes } from '../styles';

const style = css`
  background: ${colors.primary};
  color: ${colors.textLight};
  width: 100%;
  flex-shrink: 0;
  position: sticky;
  bottom:0;
  padding: 1em 0;
  margin-top: 4em;

  :not(.material-icons){
    font-size: ${fontSizes.small};
  }
  
  ul{
    display: flex;
    justify-content: space-evenly;
  }

  li>*{
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  a{
    text-decoration: none;
    color: inherit; 
  }

  .material-icons{
    font-size: ${fontSizes.large};
  }
`;

export default function Pages(props) {
  return (
    <footer css={style}>
      <nav>
        <ul>
          <li>
            <Link to="/consults">
              <span className="material-icons">
                local_library
              </span>
              <span>Consultas</span>
            </Link>
          </li>
          <li>
            <Link to="/profile">
              <span className="material-icons">
                account_circle
            </span>
              <span>Perfil</span>
            </Link>
          </li>
          <li>
            <LogoutButton>
              <span className="material-icons">
                exit_to_app
              </span>
              <span>Salir</span>
            </LogoutButton>
          </li>
        </ul>
      </nav>


    </footer>
  );
}