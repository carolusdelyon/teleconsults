/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { Link } from "react-router-dom";
import { colors, fontSizes, mediaqueries } from '../styles';
import LogoutButton from './logout-button';


const style = css`
  background: ${colors.primary};
  color: ${colors.textLight};
  padding: 0.8rem 0;
  flex: 1;
  /* TODO: study if this has to be improved */
  /* flex-shrink: 0; */

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
    ${mediaqueries[1]}{
      font-size: ${fontSizes.veryLarge};
    }
  }
`;

export default function Navigator(props) {
  return (
    <nav css={style}>
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
  );
}