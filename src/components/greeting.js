import React from "react";
import { useQuery } from '@apollo/react-hooks';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import { ME } from '../pages/profile';
import Loading from './loading';
import { colors, fontSizes } from '../styles';

const style = css`
    background: ${colors.tertiary};
    color: ${colors.textLight};
    padding: 1em;
    font-weight: 400;
`;

const Greeting = ({ name }) => {
    const {
        data,
        loading,
        error
    } = useQuery(ME);

    if (loading) return <Loading />;
    if (error || !data) {
        console.log(error);
        return <p>Error getting user data in greetings :(</p>;
    }

    const hour = new Date().getHours();

    return (
        <h4 css={style}>{(hour < 12 ? 'Buenos días '
            : hour < 18 ? 'Buenas tardes '
                : 'Buenas noches ')}<span
                    css={css`
                        text-transform: capitalize;
                    `}
                // taking just the first name
                >{name.split(' ')[0].toLowerCase()}</span></h4>
    );
}

export default Greeting;