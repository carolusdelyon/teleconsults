import React, { useEffect, useState } from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import { colors, fontSizes } from '../styles';
import { useParams, useRouteMatch, useLocation } from 'react-router-dom';

const style = css`
    background: ${colors.secondary};
    color: ${colors.textLight};
    width: 100%;
    padding: 1em;
    margin-bottom: 1em;
`;

const Header = () => {
    let location = useLocation();
    return (
        <header css={style}>
            <h1>{location.pathname.includes('profile') ? 'Perfil' : 'Consultas'}</h1>
        </header>
    );
}

export default Header;