import React, { useEffect, useState } from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import { colors, fontSizes } from '../styles';
import { useParams, useRouteMatch, useLocation } from 'react-router-dom';

const style = css`
    background: ${colors.secondary};
    color: ${colors.textLight};
    width: 100%;
    h1{
        padding: 0.6em;
    }
`;

const Header = () => {
    const { pathname } = useLocation();
    const title =
        /.*\/consults$/.test(pathname) ? 'Consultas' :
            /.*\/profile$/.test(pathname) ? 'Perfil' :
                /.*\/consults\/[1-9]*$/.test(pathname) ? 'Consulta' :
                    /.*\/consults\/[1-9]*\/answer$/.test(pathname) ? 'Respondiendo' :
                        /.*\/consults\/[1-9]*\/answer\/[1-9]*$/.test(pathname) ? 'Actualizando' : 'Teleconsultas';

    return (
        <header css={style}>
            <h1>{title}</h1>
        </header>
    );
}

export default Header;