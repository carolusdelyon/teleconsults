import React from "react";
import {
    Switch,
    Route,
    Link,
    useRouteMatch
} from "react-router-dom";
import { useParams } from "react-router-dom";
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import Answer from './answer';

import Loading from '../components/loading';

export const CONSULT_DATA_FRAGMENT = gql`
  fragment ConsultData on Consult {
    id
    date
    city
    province
    hospitalSpeciality
    specialistName
    dateAnswered
    reason
    operatingUnit
    askerName
  }
`;

export const CONSULT = gql`
query getConsult($id: ID!) {
  consult(id: $id) {
    ...ConsultData
  }
}
${CONSULT_DATA_FRAGMENT}
`;

export default function Consult() {
    let match = useRouteMatch();
    let { consultId } = useParams();

    const {
        data,
        loading,
        error
    } = useQuery(CONSULT, {
        variables: { id: consultId }
    });

    if (loading) return <Loading />;
    if (error || !data) return <p>Error getting consults :(</p>;

    const consult = data.consult;

    return (
        <div>
            <Switch>
                <Route path={`${match.path}/:answer`}>
                    <Answer />
                </Route>
                <Route path={`${match.path}`}>
                    <h3>Consult ID: {consultId}</h3>
                    <ul>
                        {Object.entries(consult).map(([key, value], index) => (
                            // discarding foreign properties
                            consult.hasOwnProperty(key) && !/_.*/.test(key)
                            && <li key={index}>{key}: {value}</li>
                        ))}
                    </ul>
                    {!consult.dateAnswered && <Link to={`${match.url}/answer`}>
                        <button>Responder Consulta</button>
                    </Link>}
                </Route>
            </Switch>
        </div>
    );
}
