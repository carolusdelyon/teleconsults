/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useLocation } from 'react-router-dom';
import { colors, breakpoints, mediaqueries } from '../styles';
import Navigator from './navigator';


const style = css`
    display: flex;
    background: ${colors.quaternary};
    color: ${colors.textLight};
    width: 100%;

    h1{
        ${mediaqueries[0]}{
            padding: 0.6em 1em;
        }
        padding: 0.8rem;
    }
`;

const Header = () => {
    const { pathname } = useLocation();
    // inferring the actual path to set the header title
    const title =
        /.*\/consults$/.test(pathname) ? 'Consultas' :
            /.*\/profile$/.test(pathname) ? 'Perfil' :
                /.*\/consults\/[1-9]*$/.test(pathname) ? 'Consulta' :
                    /.*\/consults\/[1-9]*\/answer$/.test(pathname) ? 'Respondiendo' :
                        /.*\/consults\/[1-9]*\/answer\/[1-9]*$/.test(pathname) ? 'Actualizando' : 'Teleconsultas';

    return (

        <header css={style}>
            <h1>{title}</h1>
            {document.body.clientWidth > breakpoints[1] && <Navigator />}
        </header>
    );
}

export default Header;