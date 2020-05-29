import { useMutation, useQuery } from '@apollo/react-hooks';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import gql from 'graphql-tag';
import { Link, Route, Switch, useParams, useRouteMatch } from "react-router-dom";
import Loading from '../components/loading';
import { listStyle } from "../styles";
import Answer from './answer';
import { getUrlDownloadFromFileServer, timestampToDate } from '../utils';
import Assign from '../components/assignSpecialist';

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
    pacientDescription
    pacientName
    pacientAge
    pacientSex
    pacientCurrentIll
    pacientPatologics
    pacientWeight
    pacientSize
    pacientTemperature
    pacientHead
    pacientNeck
    pacientHeart
    pacientLungs
    pacientPerine
    pacientSkin
    pacientSurgical
    pacientLimb
    pacientIll
    pacientSubIll
    pacientAbdomen
    pacientAllergies
    pacientQuestions
    pacientComentaries
    pacientExams
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

// TODO: try to unify all queries
const ILL = gql`
  query subills($id: ID!) {
    ill(id: $id){
        id
        name
        subIlls{
            id
            name
        }
    }
  }
`;

export default function Consult() {
    let match = useRouteMatch();
    const { consultId } = useParams();

    const {
        data: dataConsult,
        loadin: loadinConsult,
        error: errorConsult
    } = useQuery(CONSULT, {
        variables: { id: consultId }
    });

    const consult = dataConsult.consult;
    let answer = null;
    if (consult && consult.dateAnswered) answer = consult.answer;

    // getting ills to fetch the names
    const {
        data: dataSubill,
        loading: loadingSubill,
        error: errorSubill
    } = useQuery(ILL, {
        variables: { id: answer ? answer.illId : '' }
    });

    if (loadinConsult || !dataConsult.consult) return <Loading />;
    if (errorConsult || !dataConsult) return <p>Error al obtener la consulta :(</p>;
    if (loadingSubill) return <Loading />;
    if (errorSubill || !dataSubill) return <p>Error al obtener los datos de las enfermedades :(</p>;

    // retrieve consult autosave data to pass it to the module
    let autosaveData = null;
    if (localStorage.getItem('autosave')) {
        const autosave = JSON.parse(localStorage.getItem('autosave'));
        autosaveData = autosave[[consultId.toString()]];
    }

    const illName = dataSubill.ill.name;
    const subillName = dataSubill.ill.subIlls.filter(si => si.id === answer.subillId)[0].name;
    
    return (
        <div>
            <Switch>
                {/* modifying/updating the answer of the consult */}
                <Route path={`${match.path}/answer/:answerID`}>
                    <Answer answer={answer} />
                </Route>
                {/* answering the consult */}
                <Route path={`${match.path}/answer`}>
                    {/* loading corresponding data from local Storage */}
                    <Answer answer={autosaveData} />
                </Route>
                {/* detailed view of the consult and its answer if it's been answered*/}
                <Route path={`${match.path}`}>
                    <div css={listStyle}>
                        {/* Consult section */}
                        <div>
                            <h2>Datos</h2>
                            <ul>
                                <li>
                                    <span>Fecha de Envío</span>
                                    <span>{consult.date}</span>
                                </li>
                                <li>
                                    <span>Enviada por</span>
                                    <span>{consult.askerName}</span>
                                </li>
                                <li>
                                    <span>Motivo</span>
                                    <span>{consult.reason}</span>
                                </li>
                                {consult.specialistName && <li>
                                    <span>Asignada a</span>
                                    <span>{consult.specialistName}</span>
                                </li>}
                                <li>
                                    <span>Origen</span>
                                    <span>{consult.city} / {consult.province}</span>
                                </li>
                                <li>
                                    <span>Unidad Operativa</span>
                                    <span>{consult.operatingUnit}</span>
                                </li>
                                <li>
                                    <span>Especialidad del Hospital</span>
                                    <span>{consult.hospitalSpeciality}</span>
                                </li>
                                <li>
                                    <span>Descripción del Paciente</span>
                                    <span>{consult.pacientDescription}</span>
                                </li>
                                <li>
                                    <span>Nombre del Paciente</span>
                                    <span>{consult.pacientName}</span>
                                </li>
                                <li>
                                    <span>Edad del Paciente</span>
                                    <span>{consult.pacientAge}</span>
                                </li>
                                <li>
                                    <span>Sexo del Paciente</span>
                                    <span>{consult.pacientSex}</span>
                                </li>
                                <li>
                                    <span>Enfermedad Actual</span>
                                    <span>{consult.pacientCurrentIll}</span>
                                </li>
                                <li>
                                    <span>Enferemedad</span>
                                    <span>{consult.pacientIll}</span>
                                </li>
                                <li>
                                    <span>Subenfermedad</span>
                                    <span>{consult.pacientSubIll}</span>
                                </li>
                                <li>
                                    <span>Abdomen</span>
                                    <span>{consult.pacientAbdomen}</span>
                                </li>
                                <li>
                                    <span>Alergias</span>
                                    <span>{consult.pacientAllergies}</span>
                                </li>
                                <li>
                                    <span>Preguntas</span>
                                    <span>{consult.pacientQuestions}</span>
                                </li>
                                <li>
                                    <span>Comentarios</span>
                                    <span>{consult.pacientComentaries}</span>
                                </li>
                                <li>
                                    <span>Exámenes</span>
                                    <span>{consult.pacientExams}</span>
                                </li>
                                <li>
                                    <span>Patológicas</span>
                                    <span>{consult.pacientPatologics}</span>
                                </li>
                                <li>
                                    <span>Peso</span>
                                    <span>{consult.pacientWeight}</span>
                                </li>
                                <li>
                                    <span>Talla</span>
                                    <span>{consult.pacientSize}</span>
                                </li>
                                <li>
                                    <span>Temperatura</span>
                                    <span>{consult.pacientTemperature}</span>
                                </li>
                                <li>
                                    <span>Cabeza</span>
                                    <span>{consult.pacientHead}</span>
                                </li>
                                <li>
                                    <span>Cuello</span>
                                    <span>{consult.pacientNeck}</span>
                                </li>
                                <li>
                                    <span>Corazón</span>
                                    <span>{consult.pacientHeart}</span>
                                </li>
                                <li>
                                    <span>Pulmones</span>
                                    <span>{consult.pacientLungs}</span>
                                </li>
                                <li>
                                    <span>Periné</span>
                                    <span>{consult.pacientPerine}</span>
                                </li>
                                <li>
                                    <span>Piel</span>
                                    <span>{consult.pacientSkin}</span>
                                </li>
                                <li>
                                    <span>Quirúrgicas</span>
                                    <span>{consult.pacientSurgical}</span>
                                </li>
                                <li>
                                    <span>Extremidades</span>
                                    <span>{consult.pacientLimb}</span>
                                </li>
                                <li>
                                    <span>ID</span>
                                    <span>{consult.id}</span>
                                </li>
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
                                    <span>Fecha de respuesta</span>
                                    <span>{timestampToDate(answer.date)}</span>
                                </li>
                                <li>
                                    <span>Comentario</span>
                                    <span>{answer.commentary}</span>
                                </li>
                                <li>
                                    <span>Enfermedad</span>
                                    <span>{illName} ({answer.illId}) / {subillName} ({answer.subillId})</span>
                                </li>
                                <li>
                                    <span>Diagnóstico Presuntivo</span>
                                    <span>{answer.diagnosisPresumtive}</span>
                                </li>
                                <li>
                                    <span>Diagnóstico Definitivo</span>
                                    <span>{answer.diagnosisDefinitive}</span>
                                </li>
                                <li>
                                    <span>Prueba de diag. propuesto</span>
                                    <span>{answer.proposalDiagnosticTests}</span>
                                </li>
                                <li>
                                    <span>Plan educ. propuesto</span>
                                    <span>{answer.proposalEducation}</span>
                                </li>
                                <li>
                                    <span>Terapia propuesta</span>
                                    <span>{answer.proposalTherapy}</span>
                                </li>
                                <li>
                                    <span>Origen</span>
                                    <span>{answer.city} / {answer.province}</span>
                                </li>
                                <li>
                                    <span>Hospital</span>
                                    <span>{answer.hospital}</span>
                                </li>
                                <li>
                                    <span>Especialidad</span>
                                    <span>{answer.speciality}</span>
                                </li>
                                <li>
                                    <span>ID</span>
                                    <span>{answer.id}</span>
                                </li>
                            </ul>
                            {answer.attachments &&
                                <div>
                                    <h3>Adjuntos</h3>
                                    <i className="material-icons">attach_file</i>
                                    <ul>
                                        {answer.attachments.split(',').map((filename, index) =>
                                            <li className="link" key={index}>
                                                <a
                                                    // TODO: to be raplaced by a service
                                                    href={getUrlDownloadFromFileServer({
                                                        type: 'answer',
                                                        id: answer.id,
                                                        filename
                                                    })}>
                                                    {filename}
                                                </a>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            }
                            <Link to={`${match.url}/answer/${answer.id}`}>
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