import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React from 'react';
import { CONSULT_DATA_FRAGMENT } from "../pages/consult";
import ConsultTile from './consultTile';
import Loading from './loading';
import BarChart from './barchart';
import { colors } from "../styles";

export const MY_CONSULTS = gql`
query myConsults {
  me {
        id,
        name,
        roles,
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

export default function ConsultSpecialist() {
    const {
        data: dataConsults,
        loading: loadingConsults,
        error: errorConsults
    } = useQuery(MY_CONSULTS, { fetchPolicy: "network-only" });
    if (loadingConsults) return <Loading />;
    if (errorConsults || !dataConsults) return <p>Error obeteniendo las consultas</p>;

    // setting chart bar data
    const countPendent = dataConsults.me.pendent.length;
    const countAnswered = dataConsults.me.answered.length;
    const dataChart = [{ name: 'Pendientes', count: countPendent },
    { name: 'Contestadas', count: countAnswered }];

    return (
        <div>
            <BarChart data={dataChart} />
            <h2>Consultas Pendientes <span className="material-icons">new_releases</span></h2>
            <ul>
                {dataConsults.me.pendent.map((consult, index) => (
                    <ConsultTile consult={consult} key={index} borderColor={colors.warning} />
                ))}
            </ul>
            {!countPendent && <p>No tiene consultas pendientes.</p>}
            <h2>Consultas Contestadas</h2>
            <ul>
                {dataConsults.me.answered.map((consult, index) => (
                    <ConsultTile consult={consult} key={index} />
                ))}
            </ul>
            {!countAnswered && <p>No tiene consultas contestadas.</p>}
        </div>
    );
}