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

// from where we download the attachments
const fileserverUrl = 'http://localhost:9000';

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
    answer{
        id
  		city
  		province
  		commentary
  		illId
  		subillId
  		speciality
  		date
  		hospital
		specialistName
  		proposalDiagnosticTests
  		proposalEducation
  		proposalTherapy
  		diagnosisPresumtive
  		diagnosisDefinitive
        attachments
    }
  }
}
${CONSULT_DATA_FRAGMENT}
`;

export default function Consult() {
    let match = useRouteMatch();
    const { consultId } = useParams();

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
                <Route path={`${match.path}/answer/:answerID`}>
                    <Answer answer={consult.answer} />
                </Route>
                <Route path={`${match.path}/answer`}>
                    {/* loading corresponding data from local Storage */}
                    <Answer answer={JSON.parse(localStorage.getItem('autosave'))[consultId.toString()]} />
                </Route>
                <Route path={`${match.path}`}>
                    {/* Consult section */}
                    <div>
                        <h3>Consulta</h3>
                        <ul>
                            {Object.entries(consult).map(([key, value], index) => (
                                // discarding foreign properties
                                typeof value !== 'object' && !/_.*/.test(key)
                                && <li key={index}>{key}: {value}</li>
                            ))}
                        </ul>
                        {!consult.dateAnswered && <Link to={`${match.url}/answer`}>
                            <button>Responder Consulta</button>
                        </Link>}
                    </div>

                    {/* Answer section */}
                    {consult.dateAnswered && <div>
                        <h3>Respuesta</h3>
                        <ul>
                            {Object.entries(consult.answer).map(([key, value], index) => (
                                // discarding foreign properties
                                typeof value !== 'object' && !/_.*/.test(key)
                                && <li key={index}>{key}: {value}</li>
                            ))}
                        </ul>
                        {consult.answer.attachments && <ul>
                            {consult.answer.attachments.split(',').map((filename, index) =>
                                <a key={index}
                                    href={`${fileserverUrl}?id=${consult.answer.id}&type=answer&filename=${filename}`}>
                                    <li>{filename}</li>
                                </a>
                            )}
                        </ul>}
                        <Link to={`${match.url}/answer/${consult.answer.id}`}>
                            <button>Actualizar Respuesta</button>
                        </Link>
                    </div>
                    }
                </Route>
            </Switch>
        </div>
    );
}
