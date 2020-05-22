import React from "react";
import {
    Switch,
    Route,
    Link,
    useRouteMatch
} from "react-router-dom";
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import Loading from '../components/loading';
import Greeting from '../components/greeting';
import Consult from './consult';
import { CONSULT_DATA_FRAGMENT } from './consult';
import { colors, fontSizes, listStyle } from '../styles';
import ConsultsEspecialist from '../components/consultsSpecialist';
import ConsultsCoordinator from '../components/consultsCoordinator';

const limitWords = 100;

const style = css`
    text-align: center;

    h2>span{
        color: ${colors.warning};
    }

    /* bar chart */
    .recharts-wrapper{
        margin: 0 auto;
        padding: 0;
        margin-top: 1em;
        margin-top: 1em;
    }
    .recharts-bar text{
        stroke: ${colors.textLight};
        fill: ${colors.textLight};
    }
`;

export const ME = gql`
query me {
  me {
      name,
      roles
  }
}
`;

export default function Consults() {
    let match = useRouteMatch();

    const {
        data: dataMe,
        loading,
        error
    } = useQuery(ME);

    if (loading) return <Loading />;
    if (error || !dataMe){
        console.log(error);
        return <p>Error getting user data in consults :(</p>;
    }

    /** This is a dirty workaround to solve the not
     * automatic update of the token in the local 
     * storage. // remove
     * 
     * TODO: fix this as soon as possible
     **/
    if (!dataMe.me) window && window.location.reload();


    return (
        <div css={style}>
            <Switch>
                <Route path={`${match.path}/:consultId`}>
                    <Consult />
                </Route>
                <Route path={`${match.path}`}>
                    <Greeting name={dataMe.me && dataMe.me.name} />
                    <ConsultsEspecialist />
                    <ConsultsCoordinator />
                    {/* {dataMe.me.roles.includes('SPECIALIST') &&
                        <ConsultsEspecialist />}
                    {dataMe.me.roles.includes('COORDINATOR') &&
                        <ConsultsCoordinator />
                    } */}
                </Route>
            </Switch>
        </div>
    );
}

export function ConsultTile({ consult }) {
    let match = useRouteMatch();
    return (
        <li css={listStyle}>
            <Link to={`${match.url}/${consult.id}`}>
                <ul>
                    <li>
                        <span>Enviada</span>
                        <span>{consult.date}</span>
                    </li>
                    <li>
                        <span>Origen</span>
                        <span>{consult.city} / {consult.province}</span>
                    </li>
                    <li>
                        <span>Unidad</span>
                        <span>{consult.operatingUnit}</span>
                    </li>
                    <li>
                        <span>Motivo</span>
                        <span>{consult.reason.length > limitWords ?
                            `${consult.reason.substring(0, limitWords)}...`
                            : consult.reason}</span>
                    </li>
                </ul>
            </Link>
        </li>
    );
}