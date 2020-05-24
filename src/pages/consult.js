import { useMutation, useQuery } from '@apollo/react-hooks';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import gql from 'graphql-tag';
import { useState } from "react";
import { Link, Route, Switch, useParams, useRouteMatch } from "react-router-dom";
import Loading from '../components/loading';
import { listStyle } from "../styles";
import Answer from './answer';


// from where we download the attachments
const fileserverUrl = 'http://18.217.185.213:9000';


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

export const GET_SPECIALISTS = gql`
query getSpecialists($speciality: String) {
    specialists(speciality: $speciality) {
        name
        username
        id
  }
}`

export const SET_SPECIALIST = gql`
mutation setSpecialist($specialistId: ID!, $consultId: ID!){
    assignEspecialist(specialistId:$specialistId, consultId: $consultId){
        success
        message
    }
}
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
    if (error || !data) console.log('Error getting consults in consult.js :( ===> '+ error);

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
                    <div css={listStyle}>
                        {/* Consult section */}
                        <div>
                            <h2>Datos</h2>
                            <ul>
                                <li>
                                    <span>ID</span>
                                    <span>{consult.id}</span>
                                </li>
                                <li>
                                    <span>Fecha de Envío</span>
                                    <span>{consult.date}</span>
                                </li>
                                <li>
                                    <span>Origen</span>
                                    <span>{consult.city} / {consult.province}</span>
                                </li>
                                <li>
                                    <span>Unidad Operativa</span>
                                    <span>{consult.operatingUnit}</span>
                                </li>
                                <li>
                                    <span>Especialidad del hospital</span>
                                    <span>{consult.hospitalSpeciality}</span>
                                </li>
                                <li>
                                    <span>Origen</span>
                                    <span>{consult.city} / {consult.province}</span>
                                </li>
                                <li>
                                    <span>Enviada por</span>
                                    <span>{consult.askerName}</span>
                                </li>
                                <li>
                                    <span>Motivo</span>
                                    <span>{consult.reason}</span>
                                </li>
                                {consult.specialistName &&<li>
                                    <span>Asignada a</span>
                                    <span>{consult.specialistName}</span>
                                </li>}
                            </ul>
                            {!consult.dateAnswered && consult.specialistName &&
                                <Link to={`${match.url}/answer`}>
                                    <button>Responder Consulta</button>
                                </Link>}
                            {!consult.specialistName &&
                                <Assign
                                    speciality={consult.hospitalSpeciality}
                                    consultId={consult.id}
                                />
                            }
                        </div>

                        {/* Answer section */}
                        {consult.dateAnswered && <div>
                            <h2>Respuesta</h2>
                            <ul>
                                <li>
                                    <span>ID</span>
                                    <span>{consult.answer.id}</span>
                                </li>
                                <li>
                                    <span>Fecha de respuesta</span>
                                    <span>{consult.answer.date &&
                                        new Date(Number(consult.answer.date)).toString()}</span>
                                </li>
                                <li>
                                    <span>Origen</span>
                                    <span>{consult.answer.city} / {consult.answer.province}</span>
                                </li>
                                <li>
                                    <span>Hospital</span>
                                    <span>{consult.answer.hospital}</span>
                                </li>
                                <li>
                                    <span>Especialidad</span>
                                    <span>{consult.answer.speciality}</span>
                                </li>
                                <li>
                                    <span>Comentario</span>
                                    <span>{consult.answer.commentary}</span>
                                </li>
                                <li>
                                    <span>Enfermedad</span>
                                    <span>{consult.answer.illId} / {consult.answer.subIllId}</span>
                                </li>
                                <li>
                                    <span>Prueba de diag. propuesto</span>
                                    <span>{consult.answer.proposalDiagnosticTests}</span>
                                </li>
                                <li>
                                    <span>Plan educ. propuesto</span>
                                    <span>{consult.answer.proposalEducation}</span>
                                </li>
                                <li>
                                    <span>Terapia propuesta</span>
                                    <span>{consult.answer.proposalTherapy}</span>
                                </li>
                                <li>
                                    <span>Diagnóstico Presuntivo</span>
                                    <span>{consult.answer.diagnosisPresumtive}</span>
                                </li>
                                <li>
                                    <span>Diagnóstico Definitivo</span>
                                    <span>{consult.answer.diagnosisDefinitive}</span>
                                </li>
                            </ul>
                            {consult.answer.attachments && 
                            <div>
                            <h3>Adjuntos</h3>
                            <ul>
                                {consult.answer.attachments.split(',').map((filename, index) =>
                                    <a key={index}
                                        href={`${fileserverUrl}?id=${consult.answer.id}&type=answer&filename=${filename}`}>
                                        <li>{filename}</li>
                                    </a>
                                )}
                            </ul>
                            </div>}
                            <Link to={`${match.url}/answer/${consult.answer.id}`}>
                                <button>Actualizar Respuesta</button>
                            </Link>
                        </div>
                        }
                    </div>
                </Route>
            </Switch>
        </div>
    );
}

function Assign({ speciality, consultId }) {
    // state to control specialistId
    const [specialistId, setSpecialistId] = useState(null);

    // mutation to assign an specialist to a consult
    const [setSpecialist, { loading: loadingSetSpecilist, error: errorSetSpecilist }] = useMutation(
        SET_SPECIALIST,
        {
            onCompleted(returnData) {
                console.log(returnData); //remove
                alert(returnData.assignEspecialist.message);
                window.location.href = '/consults';
            }
        }
    );
    if (loadingSetSpecilist) console.log('loading setting an specialist');
    if (errorSetSpecilist) console.log('error in setting an specialist');

    // searching specialists with corresponding speciality
    const {
        data: dataSpecialists,
        loading: loadingSpecialists,
        error: errorSpecialists
    } = useQuery(GET_SPECIALISTS, {
        variables: { speciality }
    });

    if (loadingSpecialists) console.log('loading specialists');
    if (errorSpecialists || !dataSpecialists) console.log('error loading specialists '
        + JSON.stringify(errorSpecialists));

    function submitSetSpecialist() {
        const dataSend = {
            variables: {
                specialistId,
                consultId
            }
        };
        setSpecialist(dataSend);
    }

    return (
        <div css={css`
            input, button{
                margin: 0.5em;
            }
        `}>
            <input list="specialists" name="specialistList" onInput={({ target }) => setSpecialistId(target.value)} />
            <datalist id="specialists">
                {dataSpecialists.specialists && dataSpecialists.specialists.map((specialist, index) => (
                    <option key={index} value={specialist.id}>{specialist.name}</option>
                ))}
            </datalist>
            <button onClick={submitSetSpecialist}>Asignar</button>
        </div>
    );
}