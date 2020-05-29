import { useQuery } from '@apollo/react-hooks';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import gql from 'graphql-tag';
import React from "react";
import { CONSULT_DATA_FRAGMENT } from '../pages/consult';
import ConsultTile from './consultTile';
import { colors } from '../styles';
import BarChart from './barchart';
import Loading from './loading';

export const CONSULTS = gql`
query consults{
    unassigned: consults(state: UNASSIGNED){
        ...ConsultData
    }
    pendent: consults(state: PENDENT){
        ...ConsultData
    }
}
${CONSULT_DATA_FRAGMENT}
`;

export default function ConsultSpecialist() {
    const {
        data: dataConsults,
        loading: loadingConsults,
        error: errorConsults
    } = useQuery(CONSULTS, { fetchPolicy: "network-only" });
    if (loadingConsults) return <Loading />;
    if (errorConsults || !dataConsults) return <p>Error obeteniendo las consultas</p>;

    // setting chart bar data
    let countUnassigned = dataConsults.unassigned.length;
    let countPendent = dataConsults.pendent.length;
    const dataChart = [{ name: 'Por asignar', count: countUnassigned }, { name: 'Asignados', count: countPendent }];

    return (
        <div>
            <BarChart data={dataChart} />
            <h2>Consultas Por asignar <span className="material-icons">new_releases</span></h2>
            <ul>
                {dataConsults.unassigned.map((consult, index) => (
                    <ConsultTile consult={consult} key={index} borderColor={colors.warning} />
                ))}
            </ul>
            {!countUnassigned && <p>No hay consultas por asignar.</p>}
            <h2>Consultas Recién Asignadas</h2>
            <ul>
                {dataConsults.pendent.map((consult, index) => (
                    <ConsultTile consult={consult} key={index} disabled={true} />
                ))}
            </ul>
            {!countPendent && <p>No hay consultas recién asignadas.</p>}
        </div>
    );
}