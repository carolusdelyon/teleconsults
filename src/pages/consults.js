import React from "react";
import {
    Switch,
    Route,
    Link,
    useRouteMatch
} from "react-router-dom";
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import Loading from '../components/loading';
import Header from '../components/header';
import Greeting from '../components/greeting';
import Consult from './consult';
import { CONSULT_DATA_FRAGMENT } from './consult';

export const MY_CONSULTS = gql`
query myConsults {
  me {
      name,
    pendent: consults(state: PENDENT) {
        ...ConsultData
    }
    answered: consults(state: ANSWERED) {
        ...ConsultData
    }
  }
}
${CONSULT_DATA_FRAGMENT}
`;

export default function Consults() {
    let match = useRouteMatch();

    const {
        data,
        loading,
        error
    } = useQuery(MY_CONSULTS, { fetchPolicy: "network-only" });

    if (loading) return <Loading />;
    if (error || !data) return <p>Error getting consults :(</p>;

    /** This is a dirty workaround to solve the not
     * automatic update of the token in the local 
     * storage. // remove
     * 
     * TODO: fix this as soon as possible
     **/
    if (!data.me) window && window.location.reload();

    return (
        <>
            <Header />
            <Switch>
                <Route path={`${match.path}/:consultId`}>
                    <Consult />
                </Route>
                <Route path={`${match.path}`}>
                    <Greeting name={data.me && data.me.name} />
                    <h2>Consultas Pendientes</h2>
                    <ul>
                        {data.me && data.me.pendent.map((consult, index) => (
                            <ConsultTile consult={consult} key={index} />
                        ))}
                    </ul>
                    <h2>Consultas Pasadas</h2>
                    <ul>
                        {data.me && data.me.answered.map((consult, index) => (
                            <ConsultTile consult={consult} key={index} />
                        ))}
                    </ul>
                </Route>
            </Switch>
        </>
    );
}

function ConsultTile({ consult }) {
    let match = useRouteMatch();

    return (
        <Link to={`${match.url}/${consult.id}`}>
            <li>
                {Object.entries(consult).map(([key, value], index) => (
                    // discarding foreign properties
                    consult.hasOwnProperty(key) && !/_.*/.test(key)
                    && <span key={index}> {key}: {value}</span>
                ))}
            </li>
        </Link>
    );

}