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

import Loading from '../components/loading';
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
        data: dataConsults,
        loading,
        error
    } = useQuery(MY_CONSULTS, { fetchPolicy: "network-only" });

    if (loading) return <Loading />;
    if (error || !dataConsults) return <p>Error getting consults :(</p>;

    /** This is a dirty workaround to solve the not
     * automatic update of the token in the local 
     * storage. // remove
     * 
     * TODO: fix this as soon as possible
     **/
    if (!dataConsults.me) window && window.location.reload();

    // setting chart bar data
    let countPendent = dataConsults.me ? dataConsults.me.pendent.length : 0;
    let countAnswered = dataConsults.me ? dataConsults.me.answered.length : 0;
    const dataChart = [{ name: 'Pendientes', count: countPendent }, { name: 'Contestadas', count: countAnswered }];

    return (
        <>
            {/* <ResponsiveContainer width={700} height={400} > */}
            {/* dont loose animation */}
                <BarChart width={400} height={200} data={dataChart}>
                    <Bar fill="#8884d8" dataKey="count" label={{ position: 'insideTop' }} />
                    <XAxis dataKey="name" />
                    {/* <YAxis allowDecimals={false} hide={true} padding={{ top: -300 }}/> */}
                    <YAxis allowDecimals={false} hide={true} domain={[0, 'dataMax']} />
                </BarChart>
            {/* </ ResponsiveContainer> */}
            <Switch>
                <Route path={`${match.path}/:consultId`}>
                    <Consult />
                </Route>
                <Route path={`${match.path}`}>
                    <Greeting name={dataConsults.me && dataConsults.me.name} />
                    <h2>Consultas Pendientes</h2>
                    <ul>
                        {dataConsults.me && dataConsults.me.pendent.map((consult, index) => (
                            <ConsultTile consult={consult} key={index} />
                        ))}
                    </ul>
                    <h2>Consultas Pasadas</h2>
                    <ul>
                        {dataConsults.me && dataConsults.me.answered.map((consult, index) => (
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