import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React from "react";
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import { CONSULT_DATA_FRAGMENT } from '../pages/consult';
import { ConsultTile } from '../pages/consults';
import { colors } from '../styles';
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

export default function ConsultEspecialist() {
    const {
        data: dataConsults,
        loading,
        error
    } = useQuery(CONSULTS, { fetchPolicy: "network-only" });

    if (loading) return <Loading />;
    if (error || !dataConsults) console.log('Error getting consults in consult.js :( ===> '+ error);

    // setting chart bar data
    let countUnassigned = dataConsults.unassigned.length;
    let countPendent = dataConsults.pendent.length;
    const dataChart = [{ name: 'Por asignar', count: countUnassigned }, { name: 'Asignados', count: countPendent }];

    return (
        <div>
            <hr />
            <hr />
            <BarChart width={document.body.clientWidth * 0.8} height={150} data={dataChart}>
                <Bar fill={colors.quaternary} dataKey="count" label={{ position: 'inside' }} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} hide={true} domain={[0, 'dataMax']} />
            </BarChart>
            <h2>Consultas Por asignar <span className="material-icons">new_releases</span></h2>
            <ul>
                {dataConsults.unassigned.map((consult, index) => (
                    <ConsultTile consult={consult} key={index} />
                ))}
            </ul>
            {dataConsults.unassigned.length == 0 && <p>No hay consultas por asignar.</p>}
            <h2>Consultas Recién Asignadas</h2>
            <ul>
                {dataConsults.pendent.map((consult, index) => (
                    <ConsultTile consult={consult} key={index} />
                ))}
            </ul>
            {dataConsults.pendent.length == 0 && <p>No hay consultas recién asignadas.</p>}
        </div>
    );
}